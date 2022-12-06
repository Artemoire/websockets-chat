module.exports = function conntrack(server) {
  server.clients = [];
  return (wsEvent, next) => {
    switch (wsEvent.type) {
      case "message":
        next();
        break;
      case "open":
        console.log("[INFO] WebSocket Connection Opened");
        server.clients.push(wsEvent.connection);
        break;
      case "close":
        server.clients.splice(server.clients.indexOf(wsEvent.connection), 1);
        console.log("[INFO] WebSocket Connection Closed");
        break;
    }
  }
}