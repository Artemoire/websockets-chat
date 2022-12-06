const ws = require("websocket");
const http = require("http");
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
 * @property {ws.connection} connection
 * @property {"message"|"open"|"close"} type - Indicates whether the Courage component is present.
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
   * 
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
  const handle = (wsEvent) => {
    const callbacks = middlewares[wsEvent.type];
    if (callbacks.length === 0) return;
    let nexted;
    let i = 0;
    const next = () => nexted = true;
    do {
      nexted = false;
      callbacks[i](wsEvent, next);
      i++;
    } while (i < callbacks.length && nexted)
  }

  const server = new Middly();

  // integrate websocket
  ws.on("request", (request) => {
    const connection = request.accept(null, request.origin);
    handle({ type: "open", connection, server });

    connection.on("close", () => {
      handle({ type: "close", connection, server });
    });
    connection.on("message", (data) => {
      handle({ type: "message", connection, server, data: data.utf8Data })
    })
  })

  return server;

  // const _emit = (event, msg) => {
  //   const callbacks = middlewares[event]; // TODO: maybe need not event because msg.type
  //   if (callbacks.length === 0) return;


  // }

  // integrateWebsocket(ws, _emit);

  // return {
  //   use(eventOrCallback, callback) {
  //     let events;
  //     if (typeof eventOrCallback === 'function') {
  //       events = ['message', 'open', 'close'];
  //       callback = eventOrCallback;
  //     } else {
  //       events = [eventOrCallback];
  //     }

  //     for (const event of events) {
  //       middlewares[event].push(callback);
  //     }

  //     return this;
  //   },
  //   ws // TODO: remove ws
  // }
}

module.exports = middly;