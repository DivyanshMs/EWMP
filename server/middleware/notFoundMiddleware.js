/**
 * notFoundMiddleware.js
 * 404 Unmatched Route Handler Middleware
 * Intercepts requests that do not match any registered API route and forwards
 * a structured AppError to the global error handler.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5 (Middleware Pipeline)
 */

const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../config/constants');

const notFoundMiddleware = (req, res, next) => {
  next(
    new AppError(
      404,
      `Route ${req.method} ${req.originalUrl} not found on this server.`,
      ERROR_CODES.ROUTE_NOT_FOUND
    )
  );
};

module.exports = notFoundMiddleware;
