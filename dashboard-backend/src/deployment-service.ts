import * as redis from "redis";
import {Deployment} from "../../shared/deployment.model";
import {DeploymentUpdateEvent, HealthStatusUpdate, SourceCodeUpdateEvent} from "../../shared/events";


export class DeploymentService {

  readonly DOWN_TIMEOUT = 5000;

  private redisClient : redis.RedisClient;
  private deployments : Deployment[];
  private timeouts : {};


  constructor(private webSocketServer) {
    this.redisClient = redis.createClient({ host: 'redis' });
    this.fetchDeployments();
    this.timeouts = {};
  }

  getDeployments() : Deployment[] {
    return this.deployments;
  }

  processDeployment(event : DeploymentUpdateEvent) {
    console.log("Processing event:?", event);

    const deploymentIndex = this.deployments.findIndex(d => d.name == event.name && d.appGroup == event.appGroup);
    let newDeployment = null;
    delete this.timeouts[event.name];

    if (deploymentIndex == -1) {
      if (event.status == "DOWN") {
        console.log("Ignoring message - unrecognized dying container");
        return;
      }
      newDeployment = Object.assign({}, event);
      this.deployments = [...this.deployments, newDeployment];
    }
    else {
      // Deleting lastCommit data; provided by vcs updates; don't want this update to override/remove the data
      delete event["lastCommit"];
      newDeployment = Object.assign({}, this.deployments[deploymentIndex], event);
      this.updateDeployment(newDeployment, deploymentIndex);
    }
    if (event.status == 'DOWN') {
      this.processDownDeployment(Object.assign({}, { creationTime: 0 }, event));
    }
    this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
  }

  processVcsUpdate(sourceCodeUpdateEvent : SourceCodeUpdateEvent) {
    const deploymentIndex = this.deployments.findIndex(d => d.lastCommit.ref == sourceCodeUpdateEvent.ref);
    if (deploymentIndex == -1)
      return;
    const newDeployment = Object.assign({}, this.deployments[deploymentIndex], { lastCommit: sourceCodeUpdateEvent });
    this.updateDeployment(newDeployment, deploymentIndex);
    this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
  }

  processHealthCheckUpdate(healthCheckUpdateEvent : HealthStatusUpdate) {
    const deploymentIndex = this.deployments.findIndex(d => d.name == healthCheckUpdateEvent.deployment.name && d.appGroup == healthCheckUpdateEvent.deployment.appGroup);
    if (deploymentIndex == -1) {
      return console.log("Received health status for unknown deployment", event);
    }

    console.log("Found deployment to update", this.deployments[deploymentIndex]);
    const newDeployment = Object.assign({}, this.deployments[deploymentIndex], { healthStatus : healthCheckUpdateEvent.status });
    this.updateDeployment(newDeployment, deploymentIndex);
    this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
  }

  processDownDeployment(deployment : Deployment) {
    this.timeouts[deployment.name] = setTimeout(() => {
      if (this.timeouts[deployment.name] === undefined)
        return;
      this.removeDeployment(deployment);
      this.notifySubscribersOfUpdate(deployment, "REMOVAL");
    }, this.DOWN_TIMEOUT);
  }


  removeDeployment(deployment : Deployment) {
    const deploymentIndex = this.deployments.findIndex(d => d.name === deployment.name);
    if (deploymentIndex == -1)
      return;
    this.deployments = this.deployments.slice(0, deploymentIndex).concat(this.deployments.slice(deploymentIndex + 1));
  }

  updateDeployment(deployment : Deployment, index : number) {
    this.deployments = [
      ...this.deployments.slice(0, index),
      deployment,
      ...this.deployments.slice(index + 1)
    ];
  };

  notifySubscribersOfUpdate(deployment : Deployment, type : "UPDATE" | "REMOVAL") {
    this.redisClient.set("deployments", JSON.stringify(this.deployments), (err) => {
      if (err)
        return console.error(err.message, err);
      const eventType = (type == "UPDATE") ? "DeploymentUpdatedEvent" : "DeploymentRemovedEvent";
      const updateModel = { type: eventType, payload: deployment };
      const modelAsString = JSON.stringify(updateModel);
      console.log("Sending update model", modelAsString);
      this.webSocketServer.clients.forEach((client) => client.send(modelAsString));
    });
  }

  private fetchDeployments() {
    this.redisClient.get("deployments", (err, reply) => {
      if (err)
        return console.error(err.message, err);
      this.deployments = JSON.parse(reply) || [];
      this.deployments.forEach(deployment => {
        if (deployment.status == 'DOWN') {
          this.processDownDeployment(deployment);
        }
      });
    });
  }
}
