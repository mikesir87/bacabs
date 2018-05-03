import * as WebSocket from "ws";
import { RedisListener } from "./redis-listener";
import { Server } from "./server";
import { ApiRouter } from "./api-router";
import {ServiceManagerImpl} from "./ServiceManagerImpl";
import {ServiceManager} from "./ServiceManager";

declare var process;

const appServer = Server.start(process.env.PORT || 3000);

const serviceManager : ServiceManager = ServiceManagerImpl;

const wss = new WebSocket.Server({ server: appServer.server, path: "/events", perMessageDeflate: false });
const apiRoutes = new ApiRouter(serviceManager);
appServer.registerRoutes('/api', apiRoutes.getRouter());
new RedisListener(serviceManager);

wss.on("connection", function (ws) {
    console.log("-- A new user has connected!");

    ws.on("message", function(message) {
      if (message == "PING")
        ws.send("PONG");
    });
});

serviceManager.onServiceCreation((service) => {
  const model = JSON.stringify({ event : "service.created", payload : { service } });
  wss.clients.forEach((client) => client.send(model));
});

serviceManager.onServiceUpdate((service) => {
  const model = JSON.stringify({ event : "service.updated", payload : { service } });
  wss.clients.forEach((client) => client.send(model));
});

serviceManager.onServiceRemoval((service) => {
  const model = JSON.stringify({ event : "service.removed", payload : { service } });
  wss.clients.forEach((client) => client.send(model));
});
