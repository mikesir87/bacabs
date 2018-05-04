import {Publisher} from "./Publisher";
import {Service} from "./Service";
import * as redis from "redis";
import {CHANNELS, EVENT_TYPE} from "../../shared/events";

export class RedisPublisher implements Publisher {

  private client : redis.RedisClient;

  constructor() {
    this.client = redis.createClient({ host: 'redis' });
  }

  publishServiceCreated(service: Service) {
    const message = JSON.stringify({ type : EVENT_TYPE.SERVICE_CREATED, payload : { service }});
    console.log(`Publishing service creation event for service with id: ${service.getId()}`);
    this.client.publish(CHANNELS.SERVICES, message);
  }

  publishServiceUpdated(service: Service) {
    const message = JSON.stringify({ type : EVENT_TYPE.SERVICE_UPDATED, payload : { service }});
    console.log(`Publishing service update event for service with id: ${service.getId()}`);
    this.client.publish(CHANNELS.SERVICES, message);
  }

  publishServiceRemoved(service: Service) {
    const message = JSON.stringify({ type : EVENT_TYPE.SERVICE_REMOVED, payload : { service }});
    console.log(`Publishing service removed event for service with id: ${service.getId()}`);
    this.client.publish(CHANNELS.SERVICES, message);
  }

}
