import * as WebSocket from "ws";
import { RedisListener } from "./redis-listener";
import { Server } from "./server";
import { DeploymentService } from "./deployment-service";
import { ApiRouter } from "./api-router";

declare var process;

const appServer = Server.start(process.env.PORT || 3000);
const wss = new WebSocket.Server({ server: appServer.server, path: "/events", perMessageDeflate: false });
const deploymentService = new DeploymentService(wss);
const apiRoutes = new ApiRouter(deploymentService);
appServer.registerRoutes('/api', apiRoutes.getRouter());
new RedisListener(deploymentService);

wss.on("connection", function (ws) {
    console.log("-- A new user has connected!");

    ws.on("message", function(message) {
      if (message == "PING")
        ws.send("PONG");
    });
});
