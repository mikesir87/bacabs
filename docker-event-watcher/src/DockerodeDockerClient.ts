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
}

export default new DockerodeDockerClient();
