
export interface DeploymentUpdateEvent {
  status : 'UP' | 'DOWN';
  name : string;
  url : string;
  issue : IssueDetails
}

export interface IssueDetails {
  identifier : string;
  url : string;
}
