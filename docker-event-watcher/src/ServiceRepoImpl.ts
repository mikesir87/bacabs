import {Service, ServiceImpl} from "./Service";
import {ServiceRepo} from "./ServiceRepo";
import {ServiceEventBus} from "./ServiceEventBus";
import {EventEmitter} from "events";

const EVENT_SERVICE_CREATED = "service.created";
const EVENT_SERVICE_UPDATED = "service.updated";
const EVENT_SERVICE_REMOVED = "service.removed";

class ServiceRepoImpl implements ServiceRepo, ServiceEventBus {

  private services : Service[] = [];
  private eventEmitter : EventEmitter = new EventEmitter();

  createService(serviceDetails: any): Service {
    const service = new ServiceImpl(serviceDetails);
    this.services.push(service);
    this.eventEmitter.emit(EVENT_SERVICE_CREATED, service);
    return service;
  }

  removeService(serviceId: string) {
    const service = this.getService(serviceId);
    this.services = this.services.filter((s) => s.getId() !== serviceId);
    this.eventEmitter.emit(EVENT_SERVICE_REMOVED, service);
  }

  updateService(serviceId: string, serviceDetails: any): Service {
    const service = this.getService(serviceId);

    if (service.update(serviceDetails)) {
      this.eventEmitter.emit(EVENT_SERVICE_UPDATED, service);
    }

    return service;
  }

  updateTasksOnService(serviceId: string, numTasksRunning: number): Service {
    const service = this.getService(serviceId);

    if (service.getRunningTasks() != numTasksRunning) {
      service.setNumRunningTasks(numTasksRunning);
      this.eventEmitter.emit(EVENT_SERVICE_UPDATED, service);
    }

    return service;
  }

  getServices(): Service[] {
    return this.services;
  }

  getService(serviceId: string): Service | null {
    const service = this.services.find((s) => s.getId() === serviceId);
    return (service === undefined) ? null : service;
  }

  onServiceCreation(fn: (service: Service) => void): Function {
    this.eventEmitter.on(EVENT_SERVICE_CREATED, fn);
    return () => { this.eventEmitter.removeListener(EVENT_SERVICE_CREATED, fn )};
  }

  onServiceUpdate(fn: (service: Service) => void): Function {
    this.eventEmitter.on(EVENT_SERVICE_UPDATED, fn);
    return () => { this.eventEmitter.removeListener(EVENT_SERVICE_UPDATED, fn )};
  }

  onServiceRemoval(fn: (service: Service) => void): Function {
    this.eventEmitter.on(EVENT_SERVICE_REMOVED, fn);
    return () => { this.eventEmitter.removeListener(EVENT_SERVICE_REMOVED, fn )};
  }

}

export const DefaultServiceRepo = new ServiceRepoImpl();
