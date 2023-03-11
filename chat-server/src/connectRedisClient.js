const redis = require('redis');

async function connectRedisClient(host) {
  const client = redis.createClient({
    url: `redis://${host}`
  })

  await client.connect();
  console.log('[INFO] Connected to Redis at ' + `redis://${host}`);
  return client;
}

module.exports = connectRedisClient;