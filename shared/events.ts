
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
  name : string;
  url : string;
  issue : {
    identifier : string,
    url : string
  },
  lastCommit : {
    ref : string
  }
}
