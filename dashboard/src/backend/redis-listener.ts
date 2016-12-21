import * as redis from 'redis';
import * as WebSocket from 'ws';

export class RedisListener {

  private redisClient : redis.RedisClient;

  constructor(private webSocketServer : WebSocket.Server) {
    this.redisClient = redis.createClient({ host : 'redis' });
    this._init();
  }

  _init() {
    this.redisClient.on("message", function (channel, message) {
      this.webSocketServer.clients.forEach(function each(client) {
        client.send(message);
      });
    }.bind(this));

    this.redisClient.subscribe("deployments");
    this.redisClient.subscribe("cvs-updates");
  }
}
