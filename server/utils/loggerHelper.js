/**
 * loggerHelper.js
 * Logger Utility Functions
 * Wraps Winston logger to provide simplified logging methods across the application.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 */

const logger = require('../config/logger');

const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logError = (message, meta = {}) => {
  logger.error(message, meta);
};

const logWarn = (message, meta = {}) => {
  logger.warn(message, meta);
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

const logHttp = (message, meta = {}) => {
  logger.http(message, meta);
};

module.exports = {
  logInfo,
  logError,
  logWarn,
  logDebug,
  logHttp,
  logger,
};
