import * as express from "express";
import {ServiceManager} from "./ServiceManager";
import {ServiceManagerImpl} from "./ServiceManagerImpl";


export class ApiRouter {

  private router : express.Router;

  constructor(private serviceManager : ServiceManager = ServiceManagerImpl) {
    this.configRoutes();
  }

  configRoutes() {
    this.router = express.Router();
    this.router.get("/services", this.getServices.bind(this));
  }

  getServices(req: express.Request, res: express.Response) {
    res.send(this.serviceManager.getServices());
  }

  getRouter() {
    return this.router;
  }

}
