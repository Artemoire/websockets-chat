const ws = require("websocket");
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
wsApp.on("open", sendNodeIdOnConnect(wsApp));
wsApp.on("message", checkNodeIdOnMessage)
wsApp.on("message", (ev) => {
  const jsonMessage = JSON.parse(ev.data);
  if (jsonMessage.event === 'join') handleJoin(ev, jsonMessage);
  if (jsonMessage.event === 'chat') handleChat(ev, jsonMessage);
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

  httpServer.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}/`));
}
main();