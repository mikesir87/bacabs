
export interface Service {
  getId() : string;
  getServiceName() : string;
  getStackName() : string;
  getReplicas() : number;
  getRunningTasks() : number;
  getImage() : string;
  setNumRunningTasks(num : number) : void;
  update(serviceDetails : any) : boolean;
}

export class ServiceImpl implements Service {

  private id : string;
  private serviceName : string;
  private stackName : string;
  private replicas : number;
  private runningTasks : number;
  private image : string;
  private labels : { string : string };

  constructor(serviceDetails : any) {
    this.update(serviceDetails);
    this.runningTasks = 0;
  }

  update(serviceDetails : any) : boolean {
    //console.log("Updating with", JSON.stringify(serviceDetails, null, 2));

    const hasChange = (
        this.id != serviceDetails.ID ||
        this.serviceName != serviceDetails.Spec.Name ||
        this.stackName != serviceDetails.Spec.Labels["com.docker.stack.namespace"] ||
        this.image != serviceDetails.Spec.TaskTemplate.ContainerSpec.Image ||
        this.replicas != serviceDetails.Spec.Mode.Replicated.Replicas
    );

    this.id = serviceDetails.ID;
    this.serviceName = serviceDetails.Spec.Name;
    this.stackName = serviceDetails.Spec.Labels["com.docker.stack.namespace"];
    this.image = serviceDetails.Spec.TaskTemplate.ContainerSpec.Image;
    this.replicas = serviceDetails.Spec.Mode.Replicated.Replicas;

    this.labels = serviceDetails.Spec.Labels;

    return hasChange;
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

  setNumRunningTasks(num : number): void {
    this.runningTasks = num;
  }

}
