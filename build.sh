#!/bin/bash

TAG="latest"
PUSH="no"

while [[ $# -gt 0 ]]
do
  key="$1"

  case $key in
    -t|--tag)
      TAG="$2"
      shift 2
      ;;

    -p|--push)
      PUSH="yes"
      shift
      ;;

    *)
      echo "Unknown flag $key"
      exit 1
      ;;

esac
done

echo "Building images using tag: $TAG"

if [ $PUSH = "yes" ]; then
  echo "Will push afterwards"
fi


docker build -t bacabs/dashboard:$TAG -f Dockerfile-dashboard .
docker build -t bacabs/docker-event-watcher:$TAG -f Dockerfile-docker-event-watcher .
docker build -t bacabs/gitlab-webhook-receiver:$TAG -f Dockerfile-gitlab-webhook-receiver .


if [ $PUSH = "yes" ]; then
  docker push bacabs/dashboard:$TAG
  docker push bacabs/docker-event-watcher:$TAG
  docker push bacabs/gitlab-webhook-receiver:$TAG
fi
