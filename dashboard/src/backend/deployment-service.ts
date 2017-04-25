
import {Deployment} from "../../../shared/deployment.model";
import {DeploymentUpdateEvent, SourceCodeUpdateEvent} from "../../../shared/events";
import WebSocket = require("ws");
import * as redis from "redis";
import Timer = NodeJS.Timer;

export interface Notifier {
  notify(event : any);
}


export class DeploymentService {

  private readonly DOWN_TIMEOUT = 5000;

  private redisClient : redis.RedisClient;
  private deployments : Deployment[] = [];
  private timeouts : { [identifier : string] : Timer } = {};

  constructor(private webSocketServer : WebSocket.Server) {
    this.redisClient = redis.createClient({ host : 'redis' });
    this._fetchDeployments();
  }

  private _fetchDeployments() {
    this.redisClient.get("deployments", (err, reply) => {
      if (err) return console.error(err.message, err);
      this.deployments = JSON.parse(reply) || [];

      this.deployments.forEach(deployment => {
        if (deployment.status == 'DOWN') {
          this.processDownDeployment(deployment);
        }
      })
    });
  }

  getDeployments() {
    return this.deployments;
  }

  processDeployment(event: DeploymentUpdateEvent) {
    const deploymentIndex = this.deployments.findIndex(d => d.name == event.name);
    let newDeployment : Deployment = null;
    delete this.timeouts[event.name];

    if (deploymentIndex == -1) {
      if (event.status == 'DOWN') { // Don't care about those we haven't seen that are dying
        console.log("Ignoring message - unrecognized dying container");
        return;
      }
      newDeployment = Object.assign({}, event, { creationTime : (new Date()).getTime()} );
      this.deployments = [...this.deployments, newDeployment];
    }
    else {
      // Deleting lastCommit data; provided by vcs updates; don't want this update to override/remove the data
      delete event['lastCommit'];
      newDeployment = Object.assign({}, this.deployments[deploymentIndex], event);
      this.updateDeployment(newDeployment, deploymentIndex);
    }

    if (event.status == 'DOWN') {
      this.processDownDeployment(event);
    }

    this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
  }

  processVcsUpdate(sourceCodeUpdateEvent: SourceCodeUpdateEvent) {
    const deploymentIndex = this.deployments
      .findIndex(d => d.lastCommit.ref == sourceCodeUpdateEvent.ref);
    if (deploymentIndex == -1)
      return;
    const newDeployment = Object.assign({}, this.deployments[deploymentIndex], { lastCommit : sourceCodeUpdateEvent });
    this.updateDeployment(newDeployment, deploymentIndex);
    this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
  }

  private processDownDeployment(deployment : Deployment) {
    this.timeouts[deployment.name] = setTimeout(() => {
      if (this.timeouts[deployment.name] === undefined)
        return;

      this.removeDeployment(deployment);
      this.notifySubscribersOfUpdate(deployment, "REMOVAL")
    }, this.DOWN_TIMEOUT); // a comment
  }

  private removeDeployment(deployment : Deployment) {
    const deploymentIndex = this.deployments.findIndex(d => d.name === deployment.name);
    if (deploymentIndex == -1)
      return;
    this.deployments = [...this.deployments.slice(0, deploymentIndex), ...this.deployments.slice(deploymentIndex + 1)];
  }

  private updateDeployment(deployment : Deployment, index : number) {
    this.deployments = [
      ...this.deployments.slice(0, index), deployment, ...this.deployments.slice(index + 1)
    ];
  }

  private notifySubscribersOfUpdate(deployment : Deployment, type : "UPDATE" | "REMOVAL") {
    this.redisClient.set("deployments", JSON.stringify(this.deployments), (err) => {
      if (err) return console.error(err.message, err);

      const eventType = (type == "UPDATE") ? "DeploymentUpdatedEvent" : "DeploymentRemovedEvent";
      const updateModel = {type: eventType, payload: deployment};
      const modelAsString = JSON.stringify(updateModel);
      console.log("Sending update model", modelAsString);
      this.webSocketServer.clients.forEach(client =>
        client.send(modelAsString)
      );
    });
  }

}
