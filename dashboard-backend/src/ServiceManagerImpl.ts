import * as redis from "redis";
import {ServiceManager, Service} from "./ServiceManager";
import {EventEmitter} from "events";

const EVENT_SERVICE_CREATED = "service.created";
const EVENT_SERVICE_UPDATED = "service.updated";
const EVENT_SERVICE_REMOVED = "service.removed";

class DefaultServiceManager implements ServiceManager {

  private timeouts : {};
  private services : Service[];
  private eventEmitter : EventEmitter = new EventEmitter();

  constructor(private redisClient = redis.createClient({ host : "redis"})) {
    this.fetchServices();
    this.timeouts = {};

    this.eventEmitter.on(EVENT_SERVICE_CREATED, () => this.updatePersistentCopy);
    this.eventEmitter.on(EVENT_SERVICE_UPDATED, () => this.updatePersistentCopy);
    this.eventEmitter.on(EVENT_SERVICE_REMOVED, () => this.updatePersistentCopy);
  }

  getServices() : Service[] {
    return this.services;
  }

  setServices(services: Service[]) {
    // Add/update services as needed
    services
      .forEach((service) => {
        if (this.services.find((s) => s.id === service.id) === undefined)
          this.createService(service);
        else
          this.updateService(service)
      });

    // Remove local services no longer in the collection
    this.services
      .filter((service) => services.find((s) => s.id === service.id) === undefined)
      .forEach((s) => this.removeService(s));
  }

  createService(service : Service) {
    this.services = [ ...this.services, service ];
    this.eventEmitter.emit(EVENT_SERVICE_CREATED, service);
  }

  updateService(service : Service) {
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index === -1)
      return;

    this.services = [
      ...this.services.slice(0, index),
      service,
      ...this.services.slice(index + 1)
    ];

    this.eventEmitter.emit(EVENT_SERVICE_UPDATED, service);
  }

  removeService(service : Service) {
    const index = this.services.findIndex((s) => s.id === service.id);
    if (index === -1)
      return;

    console.log(`Removing service with id: ${service.id}`);

    this.services = [
      ...this.services.slice(0, index),
      ...this.services.slice(index + 1),
    ];

    this.eventEmitter.emit(EVENT_SERVICE_REMOVED, service);
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

  private fetchServices() {
    this.redisClient.get("services", (err, reply) => {
      if (err)
        return console.error(err.message, err);
      this.services = JSON.parse(reply) || [];
    });
  }

  private updatePersistentCopy() {
    this.redisClient.set("services", JSON.stringify(this.services), (err) => {
      if (err)
        return console.error(err.message, err);
    });
  }

}

export const ServiceManagerImpl = new DefaultServiceManager();
