# Docker Event Watcher

This component listens to Docker events using the Docker Remote API, specifically looking for the following:

- **type** - `container`
- **event** - ``create` and `destroy`
- **label** - `deployment.url`, `deployment.issue`, `deployment.name`