/**
 * 
 * @param {import("../middly").WebSocketEvent} ev 
 */
module.exports = (ev) => {
    if (!('user' in ev.client)) {
        console.log('[WARN] Anonymous user tried to send a message');
        return;
    }
    console.log(`[INFO] User: ${ev.client.user.name} sent a message`);
    const chatData = {
        id: ev.data.payload.id,
        ts: +new Date(),
        content: ev.data.payload.content,
        type: 'text',
        user: ev.client.user,
    }
    ev.server.messageStore.store(chatData)
    ev.server.publish(JSON.stringify({ event: 'chat', payload: chatData }));
}