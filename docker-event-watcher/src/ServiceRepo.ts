import {Service} from "./Service";
import {DefaultServiceRepo} from "./ServiceRepoImpl";

/**
 * Definition for a repository-like object that stores services.
 */
export interface ServiceRepo {

  /**
   * Create a new service using the provided service details
   * @param serviceDetails Service details direct from the Docker API
   * @returns {Service} The newly created service
   */
  createService(serviceDetails : any) : Service;

  /**
   * Remove the service with the provided service id. If none found, no change made.
   * @param {string} serviceId The id of the service to remove.
   */
  removeService(serviceId : string);

  /**
   * Update the service with the provided id using the provided details
   * @param {string} serviceId The id of the service
   * @param serviceDetails Service details direct from the Docker API
   * @returns {Service} The updated service
   */
  updateService(serviceId : string, serviceDetails : any) : Service;

  /**
   * Get all services known to the system
   * @returns {Service[]} All services
   */
  getServices() : Service[];

  /**
   * Retrieve a service based on its id
   * @param {string} serviceId The id of the service
   * @returns {Service | null} The Service, if found. Otherwise, null.
   */
  getService(serviceId : string) : Service | null;
}

export const ServiceRepoImpl = DefaultServiceRepo;
