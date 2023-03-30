/**
 * 
 * @param {import("./middly").WebSocketEvent} ev 
 * @param {*} next 
 */
function checkNodeIdOnMessage(ev, next) {
  if (ev.data.event === 'join') return next();
  if (ev.data.nodeId !== ev.server.nodeId) console.log('[WARN] Client is not sending data to the intended server');
  next();
}

/**
 * @param {import("./middly").WebSocketEvent} ev
 */
function sendNodeIdOnConnect(ev, next) {
  ev.client.connection.send(JSON.stringify({ event: 'welcome', payload: ev.server.nodeId }))
  next();

}

module.exports = {
  checkNodeIdOnMessage,
  sendNodeIdOnConnect
}