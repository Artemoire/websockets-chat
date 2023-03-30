/**
 * 
 * @param {import("../middly").WebSocketEvent} ev 
 */
async function handleJoin(ev) {
    console.log('[INFO] User joined: ' + ev.data.payload.name);
    ev.client.user = ev.data.payload;
    const userJoinedEvent = JSON.stringify({
        event: 'chat',
        payload: { type: 'info', content: ev.data.payload.name + " has entered chat", id: ev.data.payload.id }
    })
    ev.client.connection.send(JSON.stringify({
        event: 'load-messages',
        payload: await ev.server.messageStore.fetch()
    }))
    ev.server.publish(userJoinedEvent);
}

module.exports = handleJoin;