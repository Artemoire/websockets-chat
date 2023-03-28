const ws = require("websocket");
const http = require("http");


const jsonDataOrText = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
  }
  return data;
}

/**
 * @typedef MiddlyConfig
 * @property {http.Server<typeof http.IncomingMessage,typeof http.ServerResponse>=} httpServer
 * @property {http.RequestListener<typeof http.IncomingMessage,http.ServerResponse>=} httpRequestListener
 */

/**
 * @param {MiddlyConfig} config 
 */
function configureWebsocket(config) {
  const httpServer = config.httpServer || http.createServer(config.httpRequestListener);
  return new ws.server({
    httpServer
  });
}

/**
 * @typedef {Object} WebSocketEvent
 * @property {{connection: ws.connection}} client - user object contains connection object, can be used to store user state
 * @property {"message"|"open"|"close"} type - Type of websocket event
 * @property {any=} data - Only present on message type event
 * @property {any} server - Server state
 */

/**
 * @typedef {(wsEvent: WebSocketEvent, next: {():void})} WebSocketMiddleware
 */

/**
 * @param {MiddlyConfig} config 
 * @returns 
 */
function middly(config) {
  const ws = configureWebsocket(config);

  const middlewares = {
    message: [],
    open: [],
    close: []
  }

  function Middly() {
  }
  /**
   * @param {"message"|"open"|"close"} event 
   * @param {WebSocketMiddleware} callback 
   */
  Middly.prototype.on = (event, callback) => {
    if (!(event in middlewares)) throw "Unknown event type: " + event;
    middlewares[event].push(callback);
  }
  /**
   * @param {WebSocketMiddleware} callback 
   */
  Middly.prototype.use = (callback) => {
    for (prop in middlewares) {
      middlewares[prop].push(callback);
    }
  }

  /**
   * WebSocketEvent handler invokes middlewares
   * @param {WebSocketEvent} wsEvent 
   */
  const handle = async (wsEvent) => {
    const callbacks = middlewares[wsEvent.type];
    if (callbacks.length === 0) return;
    let nexted;
    let i = 0;
    const next = () => nexted = true;
    do {
      nexted = false;
      await callbacks[i](wsEvent, next);
      i++;
    } while (i < callbacks.length && nexted)
  }

  const server = new Middly();
  server.clients = [];

  // integrate websocket
  ws.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    const client = { connection };
    server.clients.push(client);
    handle({ type: "open", client, server });

    connection.on("close", () => {
      server.clients.splice(server.clients.indexOf(client), 1)
      handle({ type: "close", client, server });
    });
    connection.on("message", (data) => {
      handle({ type: "message", client, server, data: jsonDataOrText(data.utf8Data) })
    })
  })

  return server;

}

module.exports = middly;