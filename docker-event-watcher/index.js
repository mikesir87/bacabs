"use strict";
var dockerode_ts_1 = require("dockerode-ts");
var dockerClient = new dockerode_ts_1["default"]();
var publisher_1 = require("./publisher");
var options = {
    filters: {
        type: ['container'],
        event: ['create', 'destroy'],
        label: ['deployment.url', 'deployment.issue', 'deployment.name']
    }
};
dockerClient.getEvents(options, function (err, stream) {
    if (err)
        return console.error(err.message, err);
    stream.setEncoding('utf8');
    stream.on('data', function (chunk) {
        var data = JSON.parse(chunk.toString());
        var attributes = data.Actor.Attributes;
        var message = {
            name: attributes['deployment.name'],
            status: (data.Action == 'create') ? 'UP' : 'DOWN',
            url: attributes['deployment.url'],
            issue: attributes['deployment.issue']
        };
        publisher_1.publisher.publishMessage(message);
    });
    stream.on('close', function () {
        console.warn("Connection to Docker daemon has been lost");
    });
});
