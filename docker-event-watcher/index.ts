import Dockerode from 'dockerode-ts';
const dockerClient = new Dockerode();
import { publisher } from './publisher';
import { DeploymentUpdateEvent } from "./event";

let options = {
  filters: {
    type: ['container'],
    event: ['create', 'destroy'],
    label: ['deployment.url', 'deployment.issue', 'deployment.name']
  }
};

dockerClient.getEvents(options, function(err, stream) {
  if (err) return console.error(err.message, err);
  stream.setEncoding('utf8');

  stream.on('data', function(chunk) {
    let data = JSON.parse(chunk.toString());
    let attributes = data.Actor.Attributes;

    let message : DeploymentUpdateEvent = {
      name : attributes['deployment.name'],
      status : (data.Action == 'create') ? 'UP' : 'DOWN',
      url : attributes['deployment.url'],
      issue : attributes['deployment.issue']
    };
    publisher.publishMessage(message);
  });

  stream.on('close', function() {
    console.warn("Connection to Docker daemon has been lost");
  });
});

