/**
 * @typedef {Object} AppConfig
 * @property {"production"|"local"} MODE
 * @property {number} PORT
 * @property {string=} REDIS_CHAT_CHANNEL
 * @property {string=} REDIS_HOST
 * @property {string=} REDIS_MESSAGE_LIST_CHANNEL
 */

/**
 * @returns {AppConfig}
 */
function loadAppConfig() {
  return require(`./appConfig.${process.argv[2] || "local"}.json`)
}

module.exports = { loadAppConfig };