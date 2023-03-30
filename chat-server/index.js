const uuid = require('uuid')
const http = require("http");
const middly = require("./src/middly");
const { loadAppConfig } = require("./appConfigLoader");
const broadcastMessageToClients = require("./src/broadcastMessageToClients");
const publishMessageToRedisChannel = require("./src/publishMessageToRedisChannel");
const redisOnChannelMessage = require("./src/redisOnChannelMessage");
const connectRedisClient = require("./src/connectRedisClient");
const handleJoin = require("./src/eventHandlers/handleJoin");
const handleChat = require("./src/eventHandlers/handleChat");
const localMessageStore = require("./src/localMessageStore");

const { sendNodeIdOnConnect, checkNodeIdOnMessage } = require('./src/nodeId');
const redisMessageStore = require("./src/redisMessageStore");

const { MODE, PORT, REDIS_CHAT_CHANNEL, REDIS_HOST, REDIS_MESSAGE_LIST_CHANNEL } = loadAppConfig();

const httpServer = http.createServer();
const wsApp = middly({ httpServer });
wsApp.nodeId = uuid.v4().substring(0, 7);
wsApp.on("open", sendNodeIdOnConnect);
wsApp.on("message", checkNodeIdOnMessage)
wsApp.on("message", (ev) => {
  if (ev.data.event === 'join') handleJoin(ev);
  if (ev.data.event === 'chat') handleChat(ev);
})

async function main() {

  if (MODE === "local") {
    wsApp.publish = broadcastMessageToClients(wsApp);
    wsApp.messageStore = localMessageStore;
  } else if (MODE === "production") {
    const publishClient = await connectRedisClient(REDIS_HOST);
    const subscribeClient = await connectRedisClient(REDIS_HOST);
    const cacheClient = await connectRedisClient(REDIS_HOST);

    wsApp.publish = publishMessageToRedisChannel(publishClient, REDIS_CHAT_CHANNEL);
    wsApp.messageStore = redisMessageStore(cacheClient, REDIS_MESSAGE_LIST_CHANNEL);
    await redisOnChannelMessage(subscribeClient, REDIS_CHAT_CHANNEL, broadcastMessageToClients(wsApp));
  }

  httpServer.listen(PORT, () => console.log(`[INFO] Server@${wsApp.nodeId} listening on http://localhost:${PORT}/`));
}
main();