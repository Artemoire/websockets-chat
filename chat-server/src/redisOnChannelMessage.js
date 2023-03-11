async function redisOnChannelMessage(redisClient, chatChannel, onMessage) {

  await redisClient.subscribe(chatChannel, (message) => {
    console.log('[INFO] Recieved message from redis channel: ' + chatChannel);
    onMessage(message);
  });
}

module.exports = redisOnChannelMessage;