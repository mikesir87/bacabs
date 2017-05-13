import * as redis from "redis";
import {DeploymentService} from "./deployment-service";
import {CHANNELS} from "../../shared/events";


export class RedisListener {

  private redisClient : redis.RedisClient;

  constructor(private deploymentService : DeploymentService) {
    this.redisClient = redis.createClient({ host: "redis" });
    this.init();
  }

  private init() {
    this.redisClient.on("message", (channel, message) => {
      console.log("Received message", channel, message);
      const data = JSON.parse(message);
      switch (channel) {
        case CHANNELS.DEPLOYMENTS:
          return this.deploymentService.processDeployment(data);
        case CHANNELS.VCS_UPDATES:
          return this.deploymentService.processVcsUpdate(data);
        case CHANNELS.HEALTH_STATUS:
          return this.deploymentService.processHealthCheckUpdate(data);
        default:
          console.log("Unknown message", channel, data);
      }
    });

    Object.keys(CHANNELS).forEach((key) => {
      console.log("Subscribing to redis channel: " + CHANNELS[key]);
      this.redisClient.subscribe(CHANNELS[key]);
    });
  };
}
