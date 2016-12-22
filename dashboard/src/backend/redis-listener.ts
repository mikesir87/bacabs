import * as redis from 'redis';
import * as WebSocket from 'ws';
import {CHANNELS, DeploymentUpdateEvent, SourceCodeUpdateEvent} from "../../../shared/events";
import {DeploymentService} from "./deployment-service";

export class RedisListener {

  private redisClient : redis.RedisClient;

  constructor(private deploymentService : DeploymentService) {
    this.redisClient = redis.createClient({ host : 'redis' });
    this._init();
  }

  _init() {
    this.redisClient.on("message", function (channel, message) {
      const data = JSON.parse(message);
      switch (channel) {
        case CHANNELS.DEPLOYMENTS:
          return this.deploymentService.processDeployment(data as DeploymentUpdateEvent);
        case CHANNELS.VCS_UPDATES:
          return this.deploymentService.processVcsUpdate(data as SourceCodeUpdateEvent);
        default:
          console.log("Unknown message", channel, data);
      }
    }.bind(this));

    Object.keys(CHANNELS).forEach(key => this.redisClient.subscribe(CHANNELS[key]));
  }

}
