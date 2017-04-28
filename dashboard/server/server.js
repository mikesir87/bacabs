"use strict";
exports.__esModule = true;
var bodyParser = require("body-parser");
var compression = require("compression");
var express = require("express");

var Server = (function () {
    function Server() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.app.use(express.static(__dirname + '/../dist'));
    }

    Server.start = function (port) {
        var server = new Server();
        server.server = server.app.listen(port);
        console.log("Server is now listening on port " + port);
        return server;
    };

    Server.prototype.registerRoutes = function (basePath, router) {
      this.app.use(basePath, router);
    };

    return Server;
}());

exports.Server = Server;
