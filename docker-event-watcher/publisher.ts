import * as redis from 'redis';
import { DeploymentUpdateEvent } from '../shared/events';

const CHANNEL_NAME = "deployments";

class Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishMessage(payload : DeploymentUpdateEvent) {
    const type = "DeploymentUpdateEvent";
    const message = JSON.stringify({ type, payload });
    console.log(message);
    this.client.publish(CHANNEL_NAME, message);
  }

}

export const publisher = new Publisher();
