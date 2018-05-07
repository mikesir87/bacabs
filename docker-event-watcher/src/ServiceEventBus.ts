import {Service} from "./Service";
import {DefaultServiceRepo} from "./ServiceRepoImpl";

export interface ServiceEventBus {

  /**
   * Register a callback to fire whenever a service is created
   * @param {(service: Service) => void} fn The callback invoked, providing the new service
   * @returns {Function} A de-registration function
   */
  onServiceCreation(fn : (service : Service) => void) : Function;

  /**
   * Register a callback to fire whenever a service is updated
   * @param {(service: Service) => void} fn The callback invoked, providing the updated service
   * @returns {Function} A de-registration function
   */
  onServiceUpdate(fn : (service : Service) => void) : Function;

  /**
   * Register a callback to fire whenever a service is removed
   * @param {(service: Service) => void} fn The callback invoked, providing the removed service
   * @returns {Function} A de-registration function
   */
  onServiceRemoval(fn : (service : Service) => void) : Function;

  /**
   * Register a callback to be notified of periodic "current service collection heartbeats"
   * @param {(services: Service[]) => void} fun The callback to be invoked
   * @returns {Function} A de-registration function
   */
  onServicesSet(fun : (services : Service[]) => void) : Function;
}

export const ServiceEventBusImpl : ServiceEventBus = DefaultServiceRepo;
