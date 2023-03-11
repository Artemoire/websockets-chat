function broadcastMessageToClients(server) {
  return (message) => {
    try {
      console.log("[INFO] Broadcasting message on node: " + server.nodeId);
      server.clients.forEach(client => client.connection.send(message));
    } catch (error) {
      console.log('[ERROR] ' + error);
    }
  }
}

module.exports = broadcastMessageToClients;