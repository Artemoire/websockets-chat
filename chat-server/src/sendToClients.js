function sendToClients(server) {
  return (message) => {
    console.log("[INFO] publishing message locally");
    server.clients.forEach(connection => connection.send(message));
  }
}

module.exports = sendToClients;