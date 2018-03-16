
export const CHANNELS = {
  VCS_UPDATES : "vcs-updates",
  DEPLOYMENTS : "deployment-updates",
  HEALTH_STATUS : "health-status-updates",
  SERVICES : "services",
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
