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

  /**
   * Update the state for a specific service.
   * Use case is when an event is received to indicate a service has been updated,
   * that service needs to be fully updated.
   * @param {string} serviceId The id of the service
   * @returns {Promise<any>} A promise resolved when the update is complete
   */
  pollService(serviceId : string) : Promise<any>;
}

export const ServiceManagerImpl : ServiceManager = DockerServiceManager;
