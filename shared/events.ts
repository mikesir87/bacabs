
export const CHANNELS = {
  VCS_UPDATES : "vcs-updates",
  DEPLOYMENTS : "deployment-updates"
};

export interface SourceCodeUpdateEvent {
  date: number;
  author: string;
  ref: string;
  summary: string;
}

export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
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
