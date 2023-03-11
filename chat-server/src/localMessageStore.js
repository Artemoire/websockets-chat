const messageCache = [];

const localMessageStore = {
    async store(message) {
        console.log('[INFO] Storing message in local cache');
        messageCache.push(message);
    },
    async fetch() {
        return messageCache.sort((a, b) => a.ts - b.ts);
    }
}

module.exports = localMessageStore;