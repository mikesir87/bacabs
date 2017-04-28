"use strict";
exports.__esModule = true;

var express = require("express");

var ApiRouter = (function () {
    function ApiRouter(deploymentService) {
        this.deploymentService = deploymentService;
        this.configRoutes();
    }

    ApiRouter.prototype.configRoutes = function () {
        this.router = express.Router();
        this.router.get("/deployments", this.getDeployments.bind(this));
    };

    ApiRouter.prototype.getDeployments = function (req, res) {
        res.send(this.deploymentService.getDeployments());
    };

    ApiRouter.prototype.getRouter = function () {
        return this.router;
    };

    return ApiRouter;
}());

exports.ApiRouter = ApiRouter;
