
export interface Deployment {
  name: string;
  url: string;
  creationTime: number;
  issueDetails?: IssueDetails;
  lastCommit?: LastCommit;
}

export interface LastCommit {
  date: number;
  author: string;
  ref: string;
}

export interface IssueDetails {
  summary: string;
  acceptanceTesting: boolean;
}
