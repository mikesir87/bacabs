import * as Dockerode from 'dockerode';
const dockerClient = new Dockerode();
import {ServiceManagerImpl} from "./src/ServiceManager";
import {ServiceEventBusImpl} from "./src/ServiceEventBus";

poll();
ServiceEventBusImpl.onServiceCreation((service) => console.log(`Created service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceRemoval((service) => console.log(`Removed service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceUpdate((service) => console.log(`Service update: ${JSON.stringify(service)}`));

async function poll() {
  try {
    await ServiceManagerImpl.pollServices();
    console.log(`Completed poll of services (${new Date()})`);
  }
  catch (e) {
    console.error("Caught an error while polling", e);
  }

  setTimeout(() => poll(), 5000);
}


dockerClient.getEvents({ filters : { type : ['service'] } })
  .then((stream) => {
    console.log("Listening for Docker service events");
    stream.setEncoding('utf8');

    stream.on('data', function(chunk) {
      let data = JSON.parse(chunk.toString());
      console.log("Received service event: ", JSON.stringify(data));

      ServiceManagerImpl.pollService(data.Actor.ID);
    });

    stream.on('close', () => console.warn("Connection listening to container start/stop events has closed"));
  });
