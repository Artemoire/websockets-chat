function publishMessageToRedisChannel(redisClient, chatChannel) {
  return async (message) => {
    console.log('[INFO] Publishing message on redis channel: ' + chatChannel);
    await redisClient.publish(chatChannel, message);
  }
}

module.exports = publishMessageToRedisChannel;