const uuid = require('uuid')

module.exports = function nodeId() {
  const id = uuid.v4().substring(0, 7);
  /**
   * @param {import("./middly").WebSocketEvent} wsEvent 
   */
  return (wsEvent, next) => {
    wsEvent.connection.send(JSON.stringify({ event: 'welcome', data: id }))
    next();
  }
}