const echo = {
  say: (ev) => ({
    event: 'hear',
    data: ev.data,
  }),
  join: (ev) => ({
    event: 'hear',
    data: { type: 'info', content: ev.data.name + " has entered chat" }
  })
}

/**
 * @param {import("./middly").WebSocketEvent} wsEvent 
 */
function broadcastLocal(wsEvent) {
  try {
    const inbound = JSON.parse(wsEvent.data);
    if (!(inbound.event in echo)) {
      console.log("[WARN] unknown client event " + inbound.event)
    }

    const outbound = JSON.stringify(echo[inbound.event](inbound));
    wsEvent.server.publish(outbound);
  } catch (error) {
    console.error('[ERROR} wsEvent message did not contain JSON data');
  }
}

module.exports = broadcastLocal;