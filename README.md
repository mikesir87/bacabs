

## Requirements

- A running Docker Swarm

  ```docker swarm init```

- An attachable overlay network named `qa-application`. This network will be the one that Traefik will be sending traffic on.  Only applications on this network will be able to receive traffic.

  ```docker network create -d overlay --attachable qa-application```


 
 
## Running

After meeting the requirements above, simply launch the stack!

```docker stack deploy -c docker-stack.yml bacabs```




## Development

There is a `docker-compose.yml` file that can be used for local development. The main difference between this file and `docker-stack.yml` is that this one builds the images locally and mounts the local source for easier development.

The requirements listed above still apply.  Once met, run:

```docker-compose up -d```
 
 


## Roadmap

- **Native Swarm support** - Depends on [PR #32421](https://github.com/moby/moby/pull/32421) to receive events of Swarm service events. Until then, the `docker-event-watcher` agent has to run on every node to ensure container starts/stops are observed 



## Known Issues/Shortcomings

- Due to the lack of native Swarm support (see above), a deployment could be marked as down from a simple scaling down, as that causes a container "die" event.  If you're running only a single replica, this won't be an issue for you.
