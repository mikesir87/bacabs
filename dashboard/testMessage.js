if (process.argv.length == 2) {
  console.log("Usage: node testMessage.js 'message'");
  return;
}
var message = process.argv[2];

var redis = require("redis");
console.log("Creating client");
var pub = redis.createClient();
console.log("Client created");

pub.publish("git-messages", message);
console.log("Message published");
pub.quit();

