function publishToRedis(chatChannel, publisher) {
  return async (message) => {
    await publisher.publish(chatChannel, message);
  }
}

module.exports = publishToRedis;