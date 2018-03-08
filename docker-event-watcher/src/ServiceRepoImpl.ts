import {Service, ServiceImpl} from "./Service";
import {ServiceRepo} from "./ServiceRepo";

class ServiceRepoImpl implements ServiceRepo {

  private services : Service[] = [];

  createService(serviceDetails: any): Service {
    const service = new ServiceImpl(serviceDetails);
    this.services.push(service);
    console.log(`Created service with id ${service.getId()}`);
    return service;
  }

  removeService(serviceId: string) {
    this.services = this.services.filter((s) => s.getId() !== serviceId);
    console.log(`Removed service with id ${serviceId}`);
  }

  updateService(serviceId: string, serviceDetails: any): Service {
    const service = this.getService(serviceId);
    service.update(serviceDetails);
    return service;
  }

  getServices(): Service[] {
    return this.services;
  }

  getService(serviceId: string): Service | null {
    const service = this.services.find((s) => s.getId() === serviceId);
    return (service === undefined) ? null : service;
  }

}

export const DefaultServiceRepo = new ServiceRepoImpl();
