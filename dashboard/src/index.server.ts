// the polyfills must be one of the first things imported in node.js.
// The only modules to be imported higher - node modules with es6-promise 3.x or other Promise polyfill dependency
// (rule of thumb: do it if you have zone.js exception that it has been overwritten)
// if you are including modules that modify Promise, such as NewRelic,, you must include them before polyfills
import 'angular2-universal-polyfills';
import 'ts-helpers';
import './__workaround.node'; // temporary until 2.1.1 things are patched in Core

import * as WebSocket from 'ws';
import {RedisListener} from "./backend/redis-listener";
import {DeploymentService} from "./backend/deployment-service";
import {AppServer} from "./backend/app-server";

const deploymentService = new DeploymentService();
const server = AppServer.start(process.env.PORT || 3000, deploymentService);
const wss = new WebSocket.Server({server: server, path : "/events", perMessageDeflate: false});
new RedisListener(wss, deploymentService);

wss.on("connection", function(ws) {
   console.log("-- A new user has connected");
});
