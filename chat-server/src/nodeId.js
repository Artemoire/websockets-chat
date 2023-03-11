const uuid = require('uuid')

/**
 * 
 * @param {import("./middly").WebSocketEvent} wsEvent 
 * @param {*} next 
 */
function checkNodeIdOnMessage(wsEvent, next) {
  const appEvent = JSON.parse(wsEvent.data);
  if (appEvent.event === 'join') return next();
  if (appEvent.nodeId !== wsEvent.server.nodeId) console.log('[WARN] Client is not sending data to the intended server');
  next();
}

function sendNodeIdOnConnect(server) {
  server.nodeId = uuid.v4().substring(0, 7);
  /**
   * @param {import("./middly").WebSocketEvent} wsEvent 
   */
  return (wsEvent, next) => {
    wsEvent.client.connection.send(JSON.stringify({ event: 'welcome', data: wsEvent.server.nodeId }))
    next();
  }
}

module.exports = {
  checkNodeIdOnMessage,
  sendNodeIdOnConnect
}