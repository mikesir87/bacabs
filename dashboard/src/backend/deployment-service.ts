
import {Deployment} from "../../../shared/deployment.model";
import {DeploymentUpdateEvent, SourceCodeUpdateEvent} from "../../../shared/events";
import WebSocket = require("ws");

export interface Notifier {
  notify(event : any);
}


export class DeploymentService {

  deployments : Deployment[] = [];

  constructor(private webSocketServer : WebSocket.Server) {}

  getDeployments() {
    return this.deployments;
  }

  processDeployment(event: DeploymentUpdateEvent) {
    const deploymentIndex = this.deployments.findIndex(d => d.name == event.name);
    let newDeployment : Deployment = null;
    if (deploymentIndex == -1) {
      if (event.status == 'DOWN') { // Don't care about those we haven't seen that are dying
        console.log("Ignoring message - unrecognized dying container");
        return;
      }
      newDeployment = Object.assign({}, event, { creationTime : (new Date()).getTime()} );
      this.deployments = [...this.deployments, newDeployment];
    }
    else {
      delete event['lastCommit'];
      newDeployment = Object.assign({}, this.deployments[deploymentIndex], event);
      this.updateDeployment(newDeployment, deploymentIndex);
    }
    this.notifySubscribersOfUpdate(newDeployment);
  }

  processVcsUpdate(sourceCodeUpdateEvent: SourceCodeUpdateEvent) {
    const deploymentIndex = this.deployments
      .findIndex(d => d.lastCommit.ref == sourceCodeUpdateEvent.ref);
    if (deploymentIndex == -1)
      return;
    const newDeployment = Object.assign({}, this.deployments[deploymentIndex], { lastCommit : sourceCodeUpdateEvent });
    this.updateDeployment(newDeployment, deploymentIndex);
    this.notifySubscribersOfUpdate(newDeployment);
  }

  private updateDeployment(deployment : Deployment, index : number) {
    this.deployments = [
      ...this.deployments.slice(0, index), deployment, ...this.deployments.slice(index + 1)
    ];
  }

  private notifySubscribersOfUpdate(deployment : Deployment) {
    const updateModel = { type : "DeploymentUpdatedEvent", payload : deployment };
    const modelAsString = JSON.stringify(updateModel);
    console.log("Sending update model", modelAsString);
    this.webSocketServer.clients.forEach(client =>
      client.send(modelAsString)
    );
  }
}
