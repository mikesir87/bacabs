
export interface Service {
  getId() : string;
  getServiceName() : string;
  getStackName() : string;
  getReplicas() : number;
  getRunningTasks() : number;
  getImage() : string;
  setNumRunningTasks(num : number) : void;
}

export class ServiceImpl implements Service {

  private id : string;
  private serviceName : string;
  private stackName : string;
  private replicas : number;
  private runningTasks : number;
  private image : string;

  constructor(serviceDetails : any) {
    this.update(serviceDetails);
    // console.log(`Created new service with { ID: ${this.getId()}, name: ${this.getServiceName()}, stackName: ${this.getStackName()} }`);
  }

  update(serviceDetails : any) {
    this.id = serviceDetails.ID;
    this.serviceName = serviceDetails.Spec.Name;
    this.stackName = serviceDetails.Spec.Labels["com.docker.stack.namespace"];
    this.image = serviceDetails.Spec.TaskTemplate.ContainerSpec.Image;
    this.replicas = serviceDetails.Spec.Mode.Replicated.Replicas;
    this.runningTasks = 0;
  }

  getId(): string {
    return this.id;
  }

  getServiceName(): string {
    return this.serviceName;
  }

  getStackName(): string {
    return this.stackName;
  }

  getReplicas(): number {
    return this.replicas;
  }

  getRunningTasks(): number {
    return this.runningTasks;
  }

  getImage(): string {
    return this.image;
  }

  setNumRunningTasks(num: number): void {
    this.runningTasks = num;
  }

}
