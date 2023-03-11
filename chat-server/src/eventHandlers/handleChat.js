/**
 * 
 * @param {import("../middly").WebSocketEvent} ev 
 */
module.exports = (ev, messageData) => {
    if (!('user' in ev.client)) {
        console.log('[WARN] Anonymous user tried to send a message');
        return;
    }
    console.log(`[INFO] User: ${ev.client.user.name} sent a message`);
    const chatData = {
        id: messageData.data.id,
        ts: +new Date(),
        content: messageData.data.content,
        type: 'text',
        user: ev.client.user,
    }
    ev.server.messageStore.store(chatData)
    ev.server.publish(JSON.stringify({ event: 'chat', data: chatData }));
}