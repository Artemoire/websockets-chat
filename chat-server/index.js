const ws = require("websocket");
const http = require("http");
const middly = require("./src/middly");
const conntrack = require("./src/conntrack");
const broadcastLocal = require("./src/broadcastLocal");
const { loadAppConfig } = require("./appConfigLoader");
const sendToClients = require("./src/sendToClients");
const publishToRedis = require("./src/publishToRedis");
const redisSubscription = require("./src/redisSubscription");
const redisClient = require("./src/redisClient");
const nodeId = require("./src/nodeId");

const { MODE, PORT, REDIS_CHAT_CHANNEL, REDIS_HOST } = loadAppConfig();

const httpServer = http.createServer();
const wsApp = middly({ httpServer });
wsApp.on("open", nodeId());
wsApp.use(conntrack(wsApp));
wsApp.on("message", broadcastLocal)

async function main() {

  if (MODE === "local") {
    wsApp.publish = sendToClients(wsApp);
  } else if (MODE === "production") {
    const publisher = await redisClient(REDIS_HOST);
    const subscriber = await redisClient(REDIS_HOST);

    wsApp.publish = publishToRedis(REDIS_CHAT_CHANNEL, publisher);
    await redisSubscription(wsApp, REDIS_CHAT_CHANNEL, subscriber);
  }

  httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/`));
}
main();