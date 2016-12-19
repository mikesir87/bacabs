import * as redis from 'redis';
import { DeploymentUpdateEvent } from './event';

const CHANNEL_NAME = "deployments";

class Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishMessage(payload : DeploymentUpdateEvent) {
    const type = "DeploymentUpdateEvent";
    const message = { type, payload };
    this.client.publish(CHANNEL_NAME, JSON.stringify(message));
  }

}

export const publisher = new Publisher();
