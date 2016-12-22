import * as redis from 'redis';
import {DeploymentUpdateEvent, CHANNELS} from '../shared/events';

class Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishMessage(payload : DeploymentUpdateEvent) {
    const message = JSON.stringify(payload);
    console.log(message);
    this.client.publish(CHANNELS.DEPLOYMENTS, message);
  }

}

export const publisher = new Publisher();
