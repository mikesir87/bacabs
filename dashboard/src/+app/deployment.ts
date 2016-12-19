
export interface Deployment {
  name: string;
  url: string;
  creationTime: number;
  status: 'UP' | 'DOWN' | 'UNKNOWN';
  issueDetails?: IssueDetails;
  lastCommit?: LastCommit;
}

export interface LastCommit {
  date: number;
  author: string;
  ref: string;
}

export interface IssueDetails {
  identifier: string;
  summary?: string;
  acceptanceTesting?: boolean;
}
