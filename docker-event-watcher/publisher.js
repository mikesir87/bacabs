"use strict";
var redis = require("redis");
var CHANNEL_NAME = "deployments";
var Publisher = (function () {
    function Publisher() {
        this.client = redis.createClient({ host: 'redis' });
    }
    Publisher.prototype.publishMessage = function (message) {
        this.client.publish(CHANNEL_NAME, JSON.stringify(message));
    };
    return Publisher;
}());
exports.publisher = new Publisher();
