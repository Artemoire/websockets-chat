/**
 * 
 * @param {import("../middly").WebSocketEvent} ev 
 */
module.exports = async (ev, messageData) => {
    console.log('[INFO] User joined: ' + messageData.data.name);
    ev.client.user = messageData.data;
    const userJoinedEvent = JSON.stringify({
        event: 'chat',
        data: { type: 'info', content: messageData.data.name + " has entered chat", id: messageData.data.id }
    })
    ev.client.connection.send(JSON.stringify({
        event: 'load-messages',
        data: await ev.server.messageStore.fetch()
    }))
    ev.server.publish(userJoinedEvent);
}