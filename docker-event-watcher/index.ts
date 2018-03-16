import {ServiceEventBusImpl} from "./src/ServiceEventBus";
import {ServiceWatcherImpl} from "./src/ServiceWatcher";

ServiceEventBusImpl.onServiceCreation((service) => console.log(`Created service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceRemoval((service) => console.log(`Removed service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceUpdate((service) => console.log(`Service update: ${JSON.stringify(service)}`));

ServiceWatcherImpl.start();
