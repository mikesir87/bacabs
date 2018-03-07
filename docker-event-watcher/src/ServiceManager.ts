import {Service} from "./Service";
import DockerServiceManager from "./DockerServiceManager";

export interface ServiceManager {

  /**
   * Get all current services known to the system
   * @returns {Service[]} The services in the system
   */
  getServices() : Service[];

  /**
   * Update the state of all services held within the manager, using
   * whatever mechanism is appropriate.
   * @returns {Promise<any>} A promise when polling is complete
   */
  pollServices() : Promise<any>;

}

export const ServiceManagerImpl = DockerServiceManager;
