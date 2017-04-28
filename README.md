

## Requirements

- A running Docker Swarm

  ```docker swarm init```

- An attachable overlay network named `qa-application`. This network will be the one that Traefik will be sending traffic on.  Only applications on this network will be able to receive traffic.

  ```docker network create -d overlay --attachable qa-application```


 
 
## Running

The app is available as a Docker Swarm stack, but there's a little bit of configuration that is needed to run.

### Runtime Configuration

- `$BACABS_HOST` - the hostname for the dashboard. The other components will be subdomains upon this root
- `$TRAEFIK_ARGS` - other arguments to provide when starting up Traefik. This allows you to setup ACME (LetsEncrypt), logging, etc.  To see all available options, you can run `docker run --rm traefik:1.2-alpine --help`


### Launching

After setting the runtime configuration and meeting the requirements above, simply launch the stack!

```docker stack deploy -c docker-stack.yml bacabs```




## Development

There is a `docker-compose.yml` file that can be used for local development. The main difference between this file and `docker-stack.yml` is that this one builds the images locally and mounts the local source for easier development.

The requirements listed above still apply.  Once met, run:

```docker-compose up -d```
 

 
## Building

There is a simple build script (`build.sh`) that simply performs all of the Docker builds for the application.

- `-t` - specify the tag to be applied to the built images. _Default: latest_
- `-p` - when set, images are pushed after they are built


## Roadmap

- **Native Swarm support** - Depends on [PR #32421](https://github.com/moby/moby/pull/32421) to receive events of Swarm service events. Until then, the `docker-event-watcher` agent has to run on every node to ensure container starts/stops are observed 



## Known Issues/Shortcomings

- Due to the lack of native Swarm support (see above), a deployment could be marked as down from a simple scaling down, as that causes a container "die" event.  If you're running only a single replica, this won't be an issue for you.
