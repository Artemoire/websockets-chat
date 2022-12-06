const redis = require('redis');

async function redisClient(host) {
  const client = redis.createClient({
    url: `redis://${host}`
  })
  await client.connect();
  console.log('Connected to Redis at ' + `redis://${host}`);
  return client;
}

module.exports = redisClient;