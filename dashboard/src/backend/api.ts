import * as express from "express";
import {DeploymentService} from "./deployment-service";

export class ApiRoutes {

  private router : express.Router;

  constructor(private deploymentService : DeploymentService) {
    this.configRoutes();
  }

  private configRoutes() {
    this.router = express.Router();
    this.router.get("/deployments", this.getDeployments.bind(this));
  }

  getDeployments(req : express.Request, res : express.Response) {
    res.send(this.deploymentService.getDeployments());
  }

  getRouter() {
    return this.router;
  }
}
