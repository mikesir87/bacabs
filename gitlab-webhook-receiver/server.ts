import * as express from "express";
import * as bodyParser from "body-parser";
import {Publisher, PUBLISHER} from "./publisher";
import {tokenValidator} from "./token-validator";
import {ParsedAsJson} from "body-parser";
import {GitLabPushEvent} from "./typings/local/gitlab-push-model";
import {SourceCodeUpdateEvent} from "../shared/events";

export class Server {

  app: express.Application;
  publisher : Publisher;

  static start(port : number, gitlabValidationToken? : string) {
    const server = new Server(gitlabValidationToken);
    server.app.listen(port);
  }

  constructor(gitlabValidationToken : string) {
    this.app = express();
    this.app.use(bodyParser.json());
    if (gitlabValidationToken != null) {
      this.app.use(tokenValidator(gitlabValidationToken));
    }
    this.app.post("/", this.onNotification.bind(this))
    this.publisher = PUBLISHER;
  }

  onNotification(req: express.Request & ParsedAsJson, res: express.Response, next: express.NextFunction) {
    let gitlabEvent = req.body as GitLabPushEvent;
    if (gitlabEvent == null || gitlabEvent == undefined)
      return console.log("Received notification without body");

    if (gitlabEvent.commits.length == 0) {
      return console.log("Got event with no commits in it");
    }

    let sourceCodeEvent : SourceCodeUpdateEvent = {
      ref: gitlabEvent.ref,
      date: (new Date(gitlabEvent.commits[0].timestamp)).getTime(),
      author: gitlabEvent.commits[0].author.name,
      summary: gitlabEvent.commits[0].message
    };
    this.publisher.publishMessage(sourceCodeEvent);
    res.send("Thanks!");
  }

}
