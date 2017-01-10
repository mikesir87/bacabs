import Dockerode from 'dockerode-ts';
const dockerClient = new Dockerode();
import { publisher } from './publisher';
import { DeploymentUpdateEvent } from "../shared/events";
import {ContainerInfo} from "dockerode-ts";

const labelArray = [
  'deployment.name', 'deployment.url',
  'deployment.issue.identifier', 'deployment.issue.url',
  'deployment.vcs.ref'
];

const eventStreamOptions = {
  filters: {
    type: ['container'],
    event: ['die', 'start'],
    label: labelArray
  }
};

const listOptions = {
  filters: {
    label: labelArray
  }
};

const processContainer = (status : 'UP' | 'DOWN', labels : any) => {
  let message : DeploymentUpdateEvent = {
    name : labels['deployment.name'],
    status,
    url : labels['deployment.url'],
    issue : {
      identifier: labels['deployment.issue.identifier'],
      url : labels['deployment.issue.url']
    },
    lastCommit : {
      ref : labels['deployment.vcs.ref'],
    }
  };
  publisher.publishMessage(message);
};

dockerClient.listContainers(listOptions, (err, containers : ContainerInfo[]) => {
  if (err) return console.error(err.message, err);

  containers.forEach((container : ContainerInfo) => {
    let labels : any = container.Labels;
    processContainer("UP", labels);
  });
});


dockerClient.getEvents(eventStreamOptions, function(err, stream) {
  if (err) return console.error(err.message, err);
  console.log("Listening for Docker events");
  stream.setEncoding('utf8');

  stream.on('data', function(chunk) {
    let data = JSON.parse(chunk.toString());
    console.log("Received event", chunk);
    processContainer((data.Action == 'start') ? 'UP' : 'DOWN', data.Actor.Attributes);
  });

  stream.on('close', function() {
    console.warn("Connection to Docker daemon has been lost");
  });
});
