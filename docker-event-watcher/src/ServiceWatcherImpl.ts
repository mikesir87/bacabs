import {ServiceWatcher} from "./ServiceWatcher";
import {ServiceManager, ServiceManagerImpl} from "./ServiceManager";
import {DockerClient, DockerClientImpl} from "./DockerClient";

/**
 * A default service poller.
 */
export class ServiceWatcherImpl implements ServiceWatcher {

  constructor(private dockerClient : DockerClient = DockerClientImpl,
              private serviceManager : ServiceManager = ServiceManagerImpl) {}

  start() {
    this.poll();
    this.listenToStreamEvents();
  }

  async poll() {
    try { await this.serviceManager.pollServices(); }
    catch (e) { console.error("Caught an error while polling", e); }
    setTimeout(() => this.poll(), 5000);
  }

  listenToStreamEvents() {
    this.dockerClient.getEvents()
      .then((stream) => {
        stream.on('data', (chunk) => {
          let data = JSON.parse(chunk.toString());
          console.log("Received service event: ", JSON.stringify(data));

          return this.serviceManager.pollService(data.Actor.ID);
        });

        stream.on('close', () => {
          console.warn("Connection listening to container start/stop events has closed. Will restart in 10 seconds");
          setTimeout(() => this.listenToStreamEvents(), 10000);
        });
      });
  }

}
