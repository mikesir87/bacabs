import * as Dockerode from 'dockerode';
const dockerClient = new Dockerode();
import { publisher } from './publisher';
import {DeploymentUpdateEvent} from "../shared/events";
import {ServiceImpl} from "./src/Service";
import {ServiceManagerImpl} from "./src/ServiceManager";

const labelArray = [
  'deployment.name', 'deployment.url', 'deployment.vcs.ref'
];

const eventStreamOptions = {
  filters: {
    type: ['service'],
    label : labelArray,
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

setInterval(() => {
  console.log("************ STARTING POLL *******************");
  ServiceManagerImpl.pollServices()
    .then(() => console.log("Done polling services!"))
    .then(() => console.log("New services", ServiceManagerImpl.getServices()))
    .catch((e) => console.log("Caught something", e));
}, 5000);

// dockerClient.listServices(listOptions)
//   .then((dockerServices) => {
//     console.log("See the following services", JSON.stringify(dockerServices, null, 2));
//     console.log("******************************************");
//     dockerServices.forEach(service => {
//       dockerClient.getService(service.Spec.Name).inspect()
//         .then(serviceDetails => services.push(new ServiceImpl(serviceDetails)));
//     });
//   });


dockerClient.getEvents(eventStreamOptions)
  .then((stream) => {
    console.log("Listening for Docker events for services using filter: ", JSON.stringify(eventStreamOptions));
    stream.setEncoding('utf8');

    stream.on('data', function(chunk) {
      let data = JSON.parse(chunk.toString());
      console.log("Received service event", data);
      // const action = (data.Action == 'start') ? 'UP' : 'DOWN';
      // processContainerEvent(action, data.Actor.Attributes, action == 'UP' ? data.time : null);
    });

    stream.on('close', () => console.warn("Connection listening to container start/stop events has closed"));
  });
