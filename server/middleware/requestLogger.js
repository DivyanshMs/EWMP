/**
 * requestLogger.js
 * HTTP Request Logging Middleware
 * Integrates Morgan HTTP request logging with Winston logger.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5 (Middleware Pipeline)
 */

const morgan = require('morgan');
const { logHttp } = require('../utils/loggerHelper');

// Create a stream object with a write function that calls logHttp
const stream = {
  write: (message) => {
    // Remove trailing newline added by Morgan
    logHttp(message.trim());
  },
};

// Skip logging during automated test runs
const skip = () => {
  return process.env.NODE_ENV === 'test';
};

// Build the morgan middleware
const requestLogger = morgan(
  process.env.NODE_ENV === 'production'
    ? ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    : ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = requestLogger;
