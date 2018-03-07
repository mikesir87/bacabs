import DockerodeDockerClient from "./DockerodeDockerClient";

export interface DockerClient {

  /**
   * List all services known to the Docker engine
   * @returns {Promise<any>}
   */
  listServices() : Promise<any>;

  /**
   * Get the details for a specific service
   * @param {string} serviceNameOrId The name or ID of the service
   * @returns {Promise<any>}
   */
  inspectService(serviceNameOrId : string) : Promise<any>;

  /**
   * Get all running tasks for a service
   * @returns {Promise<any>}
   */
  listRunningTasks() : Promise<any>;

}

export const DockerClientImpl = DockerodeDockerClient;
