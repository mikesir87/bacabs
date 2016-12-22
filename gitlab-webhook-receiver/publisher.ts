import * as redis from 'redis';
import {SourceCodeUpdateEvent, CHANNELS} from '../shared/events';

export interface Publisher {
  publishMessage(payload : SourceCodeUpdateEvent) : void;
}

class DefaultPublisher implements Publisher {
  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishMessage(payload : SourceCodeUpdateEvent) {
    const message = JSON.stringify(payload);
    console.log(message);
    this.client.publish(CHANNELS.VCS_UPDATES, message);
  }

}

export const PUBLISHER = new DefaultPublisher();
