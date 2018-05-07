
export interface Service {
  id : string;
  status : "HEALTHY" | "UPDATING" | "ERROR";
  statusMessage : string;
  serviceName : string;
  stackName : string;
  replicas : number;
  runningTasks : number;
  image : string;
  labels : { string : string };
}


export interface ServiceManager {

  getServices() : Service[];

  createService(service : Service);

  updateService(service : Service);

  removeService(service : Service);

  setServices(services : Service[]);

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

}
