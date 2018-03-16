import {ServiceWatcherImpl as ServiceWatcherImpl_imported} from "./ServiceWatcherImpl";

/**
 * Definition for a service that watches services and keeps everything up-to-date.
 */
export interface ServiceWatcher {

  /**
   * Start the service watcher.
   */
  start();
}

export const ServiceWatcherImpl : ServiceWatcher = new ServiceWatcherImpl_imported();
