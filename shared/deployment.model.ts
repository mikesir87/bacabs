
export interface Deployment {
  name: string;
  url: string;
  creationTime: number;
  appGroup?: string;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  issue?: IssueDetails;
  lastCommit: LastCommit;
  healthStatus? : 'healthy' | 'unhealthy';
}

export interface LastCommit {
  date?: number;
  author?: string;
  ref: string;
  summary?: string;
}

export interface IssueDetails {
  identifier?: string;
  url?: string;
  summary?: string;
  acceptanceTesting?: boolean;
}
