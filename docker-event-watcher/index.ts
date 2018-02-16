import * as Dockerode from 'dockerode';
const dockerClient = new Dockerode();
import { publisher } from './publisher';
import {DeploymentUpdateEvent, HealthStatusUpdate} from "../shared/events";
import {ContainerInfo} from "dockerode";

const labelArray = [
  'deployment.name', 'deployment.url', 'deployment.vcs.ref'
];

const eventStreamOptions = {
  filters: {
    type: ['container'],
    event: ['die', 'start'],
    label: labelArray
  }
};

const healthCheckEventStreamOptions = {
  filters: {
    type: ['container'],
    event: ['health_status'],
    label: labelArray
  }
};

const listOptions = {
  filters: {
    label: labelArray
  }
};

const processContainerEvent = (status : 'UP' | 'DOWN', labels : any, creationTime? : number, healthy? : boolean) => {
  const appGroup = ('deployment.appGroup' in labels) ? labels['deployment.appGroup'] : null;
  const issueIdentifier = ('deployment.issue.identifier' in labels) ? labels['deployment.issue.identifier'] : null;
  const issueUrl = ('deployment.issue.url' in labels) ? labels['deployment.issue.url'] : null;

  let message : DeploymentUpdateEvent = {
    name : labels['deployment.name'],
    status,
    url : labels['deployment.url'],
    lastCommit : {
      ref : labels['deployment.vcs.ref'],
    }
  };

  if (issueIdentifier && issueUrl)
    message.issue = { identifier : issueIdentifier, url : issueUrl };
  if (appGroup)
    message.appGroup = appGroup;
  if (creationTime)
    message.creationTime = creationTime;
  if (healthy !== undefined)
    message.healthStatus = (healthy) ? 'healthy' : 'unhealthy';

  publisher.publishDeploymentUpdate(message);
};

const processHealthStatusEvent = (healthStatus : string, name : string, appGroup? : string) => {
  const status = (healthStatus == 'health_status: healthy') ? 'healthy' : 'unhealthy';

  const message : HealthStatusUpdate = {
    status,
    deployment: { name }
  };

  if (appGroup)
    message.deployment.appGroup = appGroup;

  publisher.publishHealthStatusUpdate(message);
};


dockerClient.listContainers(listOptions, (err, containers : ContainerInfo[]) => {
  if (err) return console.error(err.message, err);

  containers.forEach((container : ContainerInfo) => {
    let labels : any = container.Labels;
    let healthy = undefined;
    console.log("See container!", container);
    if (container.Status.indexOf("(healthy)") > -1)
      healthy = true;
    else if (container.Status.indexOf("(unhealthy)") > -1)
      healthy = false;

    processContainerEvent("UP", labels, container.Created, healthy);
  });
});


dockerClient.getEvents(eventStreamOptions, function(err, stream) {
  if (err) return console.error(err.message, err);
  console.log("Listening for Docker events for container starts/stops");
  stream.setEncoding('utf8');

  stream.on('data', function(chunk) {
    let data = JSON.parse(chunk.toString());
    console.log("Received container event", chunk);
    const action = (data.Action == 'start') ? 'UP' : 'DOWN';
    processContainerEvent(action, data.Actor.Attributes, action == 'UP' ? data.time : null);
  });

  stream.on('close', () => console.warn("Connection listening to container start/stop events has closed"));
});


dockerClient.getEvents(healthCheckEventStreamOptions, (err, stream) => {
  if (err) return console.error(err.message, err);
  console.log("Listening to Docker events for health status changes");
  stream.setEncoding('utf8');

  stream.on('data', (chunk) => {
    const data = JSON.parse(chunk.toString());
    console.log("Received health status event", chunk);
    processHealthStatusEvent(data.status, data.Actor.Attributes['deployment.name'], data.Actor.Attributes['deployment.appGroup']);
  });

  stream.on('close', () => console.warn("Connection listening to health status changes has closed"));
});
