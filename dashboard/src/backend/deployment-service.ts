
import {Deployment} from "../../../shared/deployment.model";
export class DeploymentService {

  deployments : Deployment[];

  getDeployments() {
    return this.deployments;
  }


}
