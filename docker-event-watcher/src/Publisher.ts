import {Service} from "./Service";
import {RedisPublisher} from "./RedisPublisher";

export interface Publisher {

  /**
   * Send notification that the provided service was created
   * @param {Service} service The created service
   */
  publishServiceCreated(service : Service);

  /**
   * Send notification that the provided service was updated
   * @param {Service} service The updated service
   */
  publishServiceUpdated(service : Service);

  /**
   * Send notification that the provided service was removed
   * @param {Service} service The removed service
   */
  publishServiceRemoved(service : Service);

  /**
   * Publish the collection of all current services.
   * @param {Service[]} services
   */
  publishCurrentServices(services : Service[]);
}

export const PublishImpl : Publisher = new RedisPublisher();
