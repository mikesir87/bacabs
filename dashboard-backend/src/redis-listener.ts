import * as redis from "redis";
import {CHANNELS, EVENT_TYPE} from "../../shared/events";
import {ServiceManagerImpl} from "./ServiceManagerImpl";
import {ServiceManager} from "./ServiceManager";


export class RedisListener {

  constructor(private serviceManager : ServiceManager = ServiceManagerImpl,
              private redisClient : redis.RedisClient = redis.createClient({ host: "redis" })) {
    this.init();
  }

  private init() {
    this.redisClient.on("message", (channel, message) => {
      if (channel !== CHANNELS.SERVICES)
        return console.log(`Unexpected message on channel '${channel}`, message);

      console.log(`Received message on channel ${channel}:`, message);
      const data = JSON.parse(message);
      const service = data.payload.service;
      switch (data.type) {
        case EVENT_TYPE.SERVICE_CREATED:
          return this.serviceManager.createService(service);
        case EVENT_TYPE.SERVICE_UPDATED:
          return this.serviceManager.updateService(service);
        case EVENT_TYPE.SERVICE_REMOVED:
          return this.serviceManager.removeService(service);
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
