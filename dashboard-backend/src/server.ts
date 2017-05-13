import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import { Server as HttpServer } from "http";

declare var __dirname;

export class Server {

  private app : express.Application;
  public server : HttpServer;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(compression());
    this.app.use(express.static(__dirname + "/../dist"));
  }

  static start(port : number) {
    const server = new Server();
    server.server = server.app.listen(port);
    console.log(`Server is now listening on port ${port}`);
    return server;
  }

  registerRoutes(basePath, router) {
    console.log("")
    this.app.use(basePath, router);
  }
}
