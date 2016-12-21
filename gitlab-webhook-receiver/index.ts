import { publisher } from './publisher';

import * as bodyParser from "body-parser";
import * as express from "express";
import { SourceCodeUpdateEvent } from "./event";
import {ParsedAsJson} from "body-parser";
import {GitLabPushEvent} from "./typings/local/gitlab-push-model";

const app = express();
const router = express.Router();
app.use(bodyParser.json());
router.post("/", onPost);
app.use(router);
app.listen(80);


const refMatcher = new RegExp("refs/heads/(\\w+)");
function onPost(req: express.Request & ParsedAsJson, res: express.Response) {
  let gitlabEvent = req.body as GitLabPushEvent;
  let ref = gitlabEvent.ref.match(refMatcher);
  if (ref == null || ref.length != 2) {
    return;
  }

  let sourceCodeEvent : SourceCodeUpdateEvent = {
    ref: ref[1],
    date: (new Date(gitlabEvent.commits[0].timestamp)).getTime(),
    author: gitlabEvent.commits[0].author.name,
    summary: gitlabEvent.commits[0].message
  };
  publisher.publishMessage(sourceCodeEvent);
  res.send("Thanks!");
}
