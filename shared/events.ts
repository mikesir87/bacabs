
export const CHANNELS = {
  DEPLOYMENTS : "deployment-updates",
  HEALTH_STATUS : "health-status-updates",
  SERVICES : "services",
};

export const EVENT_TYPE = {
  SERVICE_CREATED : "SERVICE_CREATED",
  SERVICE_UPDATED : "SERVICE_UPDATED",
  SERVICE_REMOVED : "SERVICE_REMOVED",
};

export interface SourceCodeUpdateEvent {
  date: number;
  author: string;
  ref: string;
  summary: string;
}

export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  healthStatus? : 'healthy' | 'unhealthy';
  creationTime? : number;
  name : string;
  url : string;
  appGroup? : string,
  issue? : {
    identifier : string,
    url : string
  },
  lastCommit : {
    ref : string
  }
}

export interface HealthStatusUpdate {
  status : 'healthy' | 'unhealthy';
  deployment: {
    name : string;
    appGroup? : string;
  };
}
