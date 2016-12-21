import * as redis from 'redis';
import { SourceCodeUpdateEvent } from './event';

const CHANNEL_NAME = "cvs-updates";

class Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishMessage(payload : SourceCodeUpdateEvent) {
    const type = "SourceCodeUpdateEvent";
    const message = JSON.stringify({ type, payload });
    console.log(message);
    this.client.publish(CHANNEL_NAME, message);
  }

}

export const publisher = new Publisher();
