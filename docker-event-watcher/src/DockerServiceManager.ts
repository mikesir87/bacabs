import {ServiceManager} from "./ServiceManager";
import {Service, ServiceImpl} from "./Service";
import {DockerClient, DockerClientImpl} from "./DockerClient";
import {CollectionMergeUtil} from "./CollectionMergeUtil";

class DockerServiceManager implements ServiceManager {

  private services : Service[] = [];

  constructor(private dockerClient : DockerClient = DockerClientImpl) {}

  getServices(): Service[] {
    return this.services;
  }

  async pollServices(): Promise<any> {
    await this.updateServices();
    await this.updateTasks();
  }

  private async updateServices() {
    const retrievedServices = await this.dockerClient.listServices();

    let newServices = [];
    CollectionMergeUtil.merge(this.services, retrievedServices,
      (a, b) => a.getId() == b.ID,
      (data) => newServices.push(new ServiceImpl(data)),
      (service, data) => {
        service.update(data);
        newServices.push(service);
        console.log(`Updating service with id: ${service.getId()}`)
      },
      (service) => console.log(`Removing service with id: ${service.getId()}`),
    );

    this.services = newServices;
  }

  private async updateTasks() {
    const tasks = (await this.dockerClient.listRunningTasks())
      .reduce((curr, val) => { // Map in an object of serviceID => task[]
        console.log(JSON.stringify(val, null, 2));
        if (curr[val.ServiceID] === undefined) curr[val.ServiceID] = [];
        curr[val.ServiceID].push(val);
        return curr;
      }, {});

    Object.keys(tasks).forEach(serviceId => {
      this.services.find(s => s.getId() == serviceId).setNumRunningTasks(tasks[serviceId].length);
    });

    this.services.forEach(s => {
      if (tasks[s.getId()] === undefined) s.setNumRunningTasks(0);
    })
  }
}

export default new DockerServiceManager();
