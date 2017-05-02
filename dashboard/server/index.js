"use strict";
exports.__esModule = true;
var WebSocket = require("ws");
var RedisListener = require("./redis-listener");
var Server = require("./server");
var DeploymentService = require("./deployment-service");
var ApiRouter = require("./api-router");


var appServer = Server.Server.start(process.env.PORT || 3000);
var wss = new WebSocket.Server({ server: appServer.server, path: "/events", perMessageDeflate: false });
var deploymentService = new DeploymentService.DeploymentService(wss);
var apiRoutes = new ApiRouter.ApiRouter(deploymentService);
appServer.registerRoutes('/api', apiRoutes.getRouter());
new RedisListener.RedisListener(deploymentService);

wss.on("connection", function (ws) {
    console.log("-- A new user has connected!");
});
