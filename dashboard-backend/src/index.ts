import * as WebSocket from "ws";
import { RedisListener } from "./redis-listener";
import { Server } from "./server";
import { ApiRouter } from "./api-router";
import {ServiceManagerImpl} from "./ServiceManagerImpl";
import {ServiceManager} from "./ServiceManager";

declare var process;
const serviceManager : ServiceManager = ServiceManagerImpl;

const appServer = Server.start(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server: appServer.server, path: "/events", perMessageDeflate: false });
appServer.registerRoutes('/api', (new ApiRouter(serviceManager)).getRouter());
new RedisListener(serviceManager);

wss.on("connection", (ws) => {
    console.log("-- A new user has connected!");
    ws.on("message", (message) => {
      if (message == "PING") ws.send("PONG");
    });
});

serviceManager.onServiceCreation(createBroadcaster("service.created"));
serviceManager.onServiceUpdate(createBroadcaster("service.updated"));
serviceManager.onServiceRemoval(createBroadcaster("service.removed"));

function createBroadcaster(eventType) {
  return (service) => {
    const model = JSON.stringify({ event : eventType, payload : { service } });
    wss.clients.forEach((client) => client.send(model));
  }
}
