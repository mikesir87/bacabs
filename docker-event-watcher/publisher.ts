import * as redis from 'redis';
import {DeploymentUpdateEvent, CHANNELS, HealthStatusUpdate} from '../shared/events';

class Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishDeploymentUpdate(payload : DeploymentUpdateEvent) {
    const message = JSON.stringify(payload);
    console.log(message);
    this.client.publish(CHANNELS.DEPLOYMENTS, message);
  }

  publishHealthStatusUpdate(payload : HealthStatusUpdate) {
    const message = JSON.stringify(payload);
    console.log("Publishing message", message);
    this.client.publish(CHANNELS.HEALTH_STATUS, message);
  }

}

export const publisher = new Publisher();
