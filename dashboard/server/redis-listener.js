"use strict";
exports.__esModule = true;
var redis = require("redis");
var events_1 = require("../../shared/events");

var RedisListener = (function () {
    function RedisListener(deploymentService) {
        this.deploymentService = deploymentService;
        this.redisClient = redis.createClient({ host: 'redis' });
        this._init();
    }

    RedisListener.prototype._init = function () {
        var _this = this;
        this.redisClient.on("message", (channel, message) => {
            console.log("Received message", channel, message);
            var data = JSON.parse(message);
            switch (channel) {
                case events_1.CHANNELS.DEPLOYMENTS:
                    return this.deploymentService.processDeployment(data);
                case events_1.CHANNELS.VCS_UPDATES:
                    return this.deploymentService.processVcsUpdate(data);
                default:
                    console.log("Unknown message", channel, data);
            }
        });

        Object.keys(events_1.CHANNELS).forEach((key) => _this.redisClient.subscribe(events_1.CHANNELS[key]));
    };

    return RedisListener;
}());
exports.RedisListener = RedisListener;
