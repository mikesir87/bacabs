export interface GitLabPushEvent {
  object_kind: string;
  event_name: string;
  before: string;
  after: string;
  ref: string;
  checkout_sha : string;
  message: string | null;
  user_id: number;
  user_name: string;
  user_email: string;
  user_avatar: string;
  project_id: number;
  project: GitLabProject;
  commits: GitLabCommit[];
  total_commits_count: number;
  repository: GitLabRepository;
}

export interface GitLabProject {
  name: string;
  description: string;
  web_url: string;
  avatar_url: string | null;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

export interface GitLabCommit {
  id: string;
  message: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    email: string;
  }
  added: string[];
  modified: string[];
  removed: string[];
}

export interface GitLabRepository {
  name: string;
  url: string;
  description: string;
  homepage: string;
  git_http_url: string;
  git_ssh_url: string;
  visibility_level: 0;
}
