import {ServiceEventBusImpl} from "./src/ServiceEventBus";
import {ServiceWatcherImpl} from "./src/ServiceWatcher";
import {PublishImpl} from "./src/Publisher";

// Local logging support
ServiceEventBusImpl.onServiceCreation((service) => console.log(`Created service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceRemoval((service) => console.log(`Removed service with id ${service.getId()}`));
ServiceEventBusImpl.onServiceUpdate((service) => console.log(`Service update: ${JSON.stringify(service)}`));

// Redis publishing support
ServiceEventBusImpl.onServiceCreation((service) => PublishImpl.publishServiceCreated(service));
ServiceEventBusImpl.onServiceRemoval((service) => PublishImpl.publishServiceRemoved(service));
ServiceEventBusImpl.onServiceUpdate((service) => PublishImpl.publishServiceUpdated(service));
ServiceEventBusImpl.onServicesSet((services) => PublishImpl.publishCurrentServices(services));

ServiceWatcherImpl.start();
