const uuid = require('uuid')

/**
 * 
 * @param {import("./middly").WebSocketEvent} ev 
 * @param {*} next 
 */
function checkNodeIdOnMessage(ev, next) {
  if (ev.event === 'join') return next();
  if (ev.nodeId !== ev.server.nodeId) console.log('[WARN] Client is not sending data to the intended server');
  next();
}

function sendNodeIdOnConnect(server) {
  server.nodeId = uuid.v4().substring(0, 7);
  /**
   * @param {import("./middly").WebSocketEvent} ev
   */
  return (ev, next) => {
    ev.client.connection.send(JSON.stringify({ event: 'welcome', payload: ev.server.nodeId }))
    next();
  }
}

module.exports = {
  checkNodeIdOnMessage,
  sendNodeIdOnConnect
}