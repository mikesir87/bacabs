import {ServiceManager} from "./ServiceManager";
import {Service} from "./Service";
import {DockerClient, DockerClientImpl} from "./DockerClient";
import {CollectionMergeUtil} from "./CollectionMergeUtil";
import {ServiceRepo, ServiceRepoImpl} from "./ServiceRepo";

class DockerServiceManager implements ServiceManager {

  constructor(private dockerClient : DockerClient = DockerClientImpl,
              private serviceRepo : ServiceRepo = ServiceRepoImpl) {}

  getServices(): Service[] {
    return this.serviceRepo.getServices();
  }

  async pollServices(): Promise<any> {
    await this.updateServices();
    await this.updateTasks();
  }

  async pollService(serviceId: string): Promise<any> {
    try {
      const serviceDetails = await this.dockerClient.inspectService(serviceId);
      let service = this.serviceRepo.getService(serviceDetails.ID);
      if (service === null)
        service = this.serviceRepo.createService(serviceDetails);
      else
        service = this.serviceRepo.updateService(serviceId, serviceDetails);
      return service;
    }
    catch (e) {
      if (e.reason && e.reason === "no such service")
        this.serviceRepo.removeService(serviceId);
      else
        throw e;
    }
  }

  private async updateServices() {
    const retrievedServices = await this.dockerClient.listServices();

    CollectionMergeUtil.merge(this.serviceRepo.getServices(), retrievedServices,
      (a, b) => a.getId() == b.ID,
      (data) => this.serviceRepo.createService(data),
      (service, data) => this.serviceRepo.updateService(service.getId(), data),
      (service) => this.serviceRepo.removeService(service.getId()),
    );
  }

  private async updateTasks() {
    const tasks = (await this.dockerClient.listRunningTasks())
      .reduce((curr, val) => { // Map in an object of serviceID => task[]
        if (curr[val.ServiceID] === undefined) curr[val.ServiceID] = [];
        curr[val.ServiceID].push(val);
        return curr;
      }, {});

    Object.keys(tasks).forEach(serviceId => {
      this.serviceRepo.getService(serviceId).setNumRunningTasks(tasks[serviceId].length);
    });

    this.serviceRepo.getServices().forEach(s => {
      if (tasks[s.getId()] === undefined) s.setNumRunningTasks(0);
    })
  }
}

export default new DockerServiceManager();
