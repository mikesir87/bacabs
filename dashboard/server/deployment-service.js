"use strict";
exports.__esModule = true;
var redis = require("redis");

var DeploymentService = (function () {
    function DeploymentService(webSocketServer) {
        this.webSocketServer = webSocketServer;
        this.DOWN_TIMEOUT = 5000;
        this.deployments = [];
        this.timeouts = {};
        this.redisClient = redis.createClient({ host: 'redis' });
        this._fetchDeployments();
    }

    DeploymentService.prototype.getDeployments = function () {
        return this.deployments;
    };

    DeploymentService.prototype.processDeployment = function (event) {
        var deploymentIndex = this.deployments.findIndex(d => d.name == event.name);
        var newDeployment = null;
        delete this.timeouts[event.name];
        if (deploymentIndex == -1) {
            if (event.status == 'DOWN') {
                console.log("Ignoring message - unrecognized dying container");
                return;
            }
            newDeployment = Object.assign({}, event);
            this.deployments = [...this.deployments, newDeployment];
        }
        else {
            // Deleting lastCommit data; provided by vcs updates; don't want this update to override/remove the data
            delete event['lastCommit'];
            newDeployment = Object.assign({}, this.deployments[deploymentIndex], event);
            this.updateDeployment(newDeployment, deploymentIndex);
        }
        if (event.status == 'DOWN') {
            this.processDownDeployment(event);
        }
        this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
    };

    DeploymentService.prototype.processVcsUpdate = function (sourceCodeUpdateEvent) {
        var deploymentIndex = this.deployments
            .findIndex(d => d.lastCommit.ref == sourceCodeUpdateEvent.ref);
        if (deploymentIndex == -1)
            return;
        var newDeployment = Object.assign({}, this.deployments[deploymentIndex], { lastCommit: sourceCodeUpdateEvent });
        this.updateDeployment(newDeployment, deploymentIndex);
        this.notifySubscribersOfUpdate(newDeployment, "UPDATE");
    };

    DeploymentService.prototype._fetchDeployments = function () {
        var _this = this;
        this.redisClient.get("deployments", (err, reply) => {
            if (err)
                return console.error(err.message, err);
            _this.deployments = JSON.parse(reply) || [];
            _this.deployments.forEach(deployment => {
                if (deployment.status == 'DOWN') {
                    _this.processDownDeployment(deployment);
                }
            });
        });
    };

    DeploymentService.prototype.processDownDeployment = function (deployment) {
        var _this = this;
        this.timeouts[deployment.name] = setTimeout(() => {
            if (_this.timeouts[deployment.name] === undefined)
                return;
            _this.removeDeployment(deployment);
            _this.notifySubscribersOfUpdate(deployment, "REMOVAL");
        }, this.DOWN_TIMEOUT);
    };

    DeploymentService.prototype.removeDeployment = function (deployment) {
        var deploymentIndex = this.deployments.findIndex(d => d.name === deployment.name);
        if (deploymentIndex == -1)
            return;
        this.deployments = this.deployments.slice(0, deploymentIndex).concat(this.deployments.slice(deploymentIndex + 1));
    };

    DeploymentService.prototype.updateDeployment = function (deployment, index) {
        this.deployments = [
                ...this.deployments.slice(0, index),
                deployment,
                ...this.deployments.slice(index + 1)
            ];
    };

    DeploymentService.prototype.notifySubscribersOfUpdate = function (deployment, type) {
        var _this = this;
        this.redisClient.set("deployments", JSON.stringify(this.deployments), (err) => {
            if (err)
                return console.error(err.message, err);
            var eventType = (type == "UPDATE") ? "DeploymentUpdatedEvent" : "DeploymentRemovedEvent";
            var updateModel = { type: eventType, payload: deployment };
            var modelAsString = JSON.stringify(updateModel);
            console.log("Sending update model", modelAsString);
            _this.webSocketServer.clients.forEach((client) => client.send(modelAsString));
        });
    };

    return DeploymentService;
}());


exports.DeploymentService = DeploymentService;
