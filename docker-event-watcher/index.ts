import * as Dockerode from 'dockerode';
const dockerClient = new Dockerode();
import { publisher } from './publisher';
import {DeploymentUpdateEvent} from "../shared/events";
import {ServiceManagerImpl} from "./src/ServiceManager";
import {ServiceEventBus, ServiceEventBusImpl} from "./src/ServiceEventBus";

const labelArray = [
  'deployment.name', 'deployment.url', 'deployment.vcs.ref'
];

const eventStreamOptions = {
  filters: {
    type: ['service'],
    // label : labelArray,
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

poll();
ServiceEventBusImpl.onServiceCreation((service) => console.log(`Created service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceRemoval((service) => console.log(`Removed service with id ${service.getId()}`));

//ServiceChangeBusImpl.onServiceCreation((service) => console.log(`Created service with id ${service.getId()}`));

async function poll() {
  try {
    await ServiceManagerImpl.pollServices();
    console.log(`Completed poll of services (${new Date()})`);
  }
  catch (e) {
    console.error("Caught an error while polling", e);
  }

  setTimeout(() => poll(), 30000);
}


dockerClient.getEvents(eventStreamOptions)
  .then((stream) => {
    console.log("Listening for Docker events for services using filter: ", JSON.stringify(eventStreamOptions));
    stream.setEncoding('utf8');

    stream.on('data', function(chunk) {
      let data = JSON.parse(chunk.toString());
      console.log("Received service event ", JSON.stringify(data));

      ServiceManagerImpl.pollService(data.Actor.ID);
    });

    stream.on('close', () => console.warn("Connection listening to container start/stop events has closed"));
  });
