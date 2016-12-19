
export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  name : string;
  url : string;
  issue : string;
}
