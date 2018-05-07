import * as redis from "redis";
import {CHANNELS, EVENT_TYPE} from "../../shared/events";
import {ServiceManagerImpl} from "./ServiceManagerImpl";
import {ServiceManager} from "./ServiceManager";


export class RedisListener {

  constructor(private serviceManager : ServiceManager = ServiceManagerImpl,
              private redisClient : redis.RedisClient = redis.createClient({ host: "redis" }),
              private listeningClient : redis.RedisClient = redis.createClient({ host: "redis" })) {
    this.init();
    this.listenForRedisEvents();
    this.serviceManager.onServiceCreation(this.persistServices.bind(this));
    this.serviceManager.onServiceUpdate(this.persistServices.bind(this));
    this.serviceManager.onServiceRemoval(this.persistServices.bind(this));
  }

  private init() {
    this.redisClient.get("services", (err, reply) => {
      if (err)
        return console.error(err.message, err);
      this.serviceManager.setServices(JSON.parse(reply) || []);
    });
  }

  private listenForRedisEvents() {
    this.listeningClient.on("message", (channel, message) => {
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
        case EVENT_TYPE.SERVICES_SET:
          return this.serviceManager.setServices(data.payload.services);
        default:
          console.log("Unknown message", channel, data);
      }
    });

    Object.keys(CHANNELS).forEach((key) => {
      console.log("Subscribing to redis channel: " + CHANNELS[key]);
      this.listeningClient.subscribe(CHANNELS[key]);
    });
  };

  private persistServices() {
    this.redisClient.set("services", JSON.stringify(this.serviceManager.getServices()), (err) => {
      if (err) return console.error("Error persisting to redis: ", err);
      console.log("-- Persisted service collection update to redis");
    });
  }

}
