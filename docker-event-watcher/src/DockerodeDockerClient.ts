import {DockerClient} from "./DockerClient";
import * as Dockerode from "dockerode";

const labelArray = [ 'deployment.name', 'deployment.url', 'deployment.vcs.ref' ];

const eventStreamOptions = {
  filters: {
    type: ['service'],
    label : labelArray,
  }
};

const serviceListOptions = {
  filters: {
    label: labelArray
  }
};


class DockerodeDockerClient implements DockerClient {

  private dockerClient : Dockerode;

  constructor() {
    this.dockerClient = new Dockerode();
  }

  listServices(): Promise<any> {
    return this.dockerClient
      .listServices(serviceListOptions);
  }

  inspectService(serviceNameOrId: string): Promise<any> {
    return this.dockerClient.getService(serviceNameOrId).inspect();
  }

  listRunningTasks(): Promise<any> {
    return this.dockerClient
      .listTasks({
        "desiredState" : "running",
      })
      .then(tasks => tasks.filter(t => t.Status.State == 'running'));
  }


  getEvents(): Promise<NodeJS.ReadableStream> {
    return this.dockerClient.getEvents({ filters : { type : ['service'] } })
      .then((stream) => {
        stream.setEncoding('utf8');
        return stream;
      });
  }
}

export default new DockerodeDockerClient();
