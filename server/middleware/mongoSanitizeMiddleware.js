/**
 * mongoSanitizeMiddleware.js
 * Centralized NoSQL Operator Injection Protection Middleware
 * Prevents MongoDB operator injection ($ne, $gt, $regex, etc.) across request body, query params, URL params, and headers.
 * Compatible with Express 5 (where req.query is getter-only and must be sanitized in place without reassignment).
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5
 *            API_SPECIFICATION.md Section 11
 */

const mongoSanitize = require('express-mongo-sanitize');

/**
 * Express 5 compatible NoSQL injection sanitization middleware.
 * Iterates through request body, params, headers, and query parameters to strip prohibited keys.
 */
const mongoSanitizeMiddleware = (options = {}) => {
  const hasOnSanitize = typeof options.onSanitize === 'function';
  return (req, res, next) => {
    ['body', 'params', 'headers', 'query'].forEach((key) => {
      if (req[key]) {
        const target = req[key];
        const isSanitized = mongoSanitize.has(target, options.allowDots);

        if (key === 'query') {
          // Express 5 makes req.query a getter-only property. Mutate in place without reassignment.
          mongoSanitize.sanitize(target, options);
        } else {
          req[key] = mongoSanitize.sanitize(target, options);
        }

        if (isSanitized && hasOnSanitize) {
          options.onSanitize({ req, key });
        }
      }
    });
    next();
  };
};

mongoSanitizeMiddleware.sanitize = mongoSanitize.sanitize;
mongoSanitizeMiddleware.has = mongoSanitize.has;

module.exports = mongoSanitizeMiddleware;
