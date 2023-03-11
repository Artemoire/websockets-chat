function redisMessageStore(redisClient, messageListChannel) {
  return {
    async store(message) {
      try {
        console.log('[INFO] Storing message in redis list: ' + messageListChannel);
        await redisClient.lPush(messageListChannel, JSON.stringify(message))
      } catch (error) {
        console.log('[ERROR] Failed to store message in redis list: ' + error);
      }
    },
    async fetch() {
      try {
        console.log('[INFO] Fetching redis message cache');
        const res = await redisClient.lRange(messageListChannel, 0, -1);
        return res.map(x => JSON.parse(x)).sort((a, b) => a.ts - b.ts);
      } catch (error) {
        console.log('[ERROR] Failed to retrieve redis message list: ' + error);
        return [];
      }
    }
  }
}

module.exports = redisMessageStore;