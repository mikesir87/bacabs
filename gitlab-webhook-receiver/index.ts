import {Server} from './server';

declare let process: {
  env: {
    PORT: number,
    GITLAB_AUTH_TOKEN: string,
  }
};

Server.start(process.env.PORT || 80, process.env.GITLAB_AUTH_TOKEN);
