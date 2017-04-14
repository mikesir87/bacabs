# Docker Event Watcher

This component listens to Docker events using the Docker Remote API, specifically filtering for the following:

- **type** - `container`
- **event** - `create` and `destroy`
- **label** - the required labels listed below


## Docker Container Labels

### Required Labels

- `deployment.name` - a name to display for the deployment
- `deployment.url` - the URL to access the deployment
- `deployment.vcs.ref` - version control ref (i.e., `refs/heads/master`)

### Optional Labels

- `deployment.issue.identifier` - an issue identifier
- `deployment.issue.url` - the URL to the issue
- `deployment.appGroup` - a name to group with (client, api, etc.)



