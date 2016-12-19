import Dockerode from 'dockerode-ts';
const dockerClient = new Dockerode();

const options =  {
  filters : {
    type: 'container'
    // event: ['create', 'destroy'],
    // label: ['deployment.url', 'deployment.issue', 'deployment.name']
  }
};

dockerClient.getEvents(options, function(err, stream) {
  if (err) return console.error(err.message, err);
  stream.setEncoding('utf8');

  stream.on('data', function(chunk) {
    var data = JSON.parse(chunk.toString());
    console.log("Received data", data);
  });

  stream.on('close', function() {
    console.warn("Connection to Docker daemon has been lost");
  });
});

