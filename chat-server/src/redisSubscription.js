const redis = require("redis");

async function redisSubscription(server, chatChannel, subscriber) {

  await subscriber.subscribe(chatChannel, function (message) {
    try {
      server.clients.forEach(connection => connection.send(message));
    } catch (error) {
      console.log("[ERROR] " + error);
    }
  });
}

module.exports = redisSubscription;