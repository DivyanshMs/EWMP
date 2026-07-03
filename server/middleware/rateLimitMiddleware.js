/**
 * rateLimitMiddleware.js
 * Express Rate Limiting Middleware
 * Applies per-IP rate limits to prevent abuse.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Security)
 *            API_SPECIFICATION.md Section 15.3 (Rate Limiting Contract)
 *            DEVELOPMENT_ORDER.md ADR-302
 */

const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/formatResponse');
const { ERROR_CODES } = require('../config/constants');

/**
 * Standard API rate limiter.
 * Applied to all non-auth routes.
 * Limit: 100 requests per 15 minutes per IP.
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, 429, 'Too many requests. Please try again in a moment.', {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      retryAfterSeconds: 60,
    });
  },
});

/**
 * Strict authentication rate limiter.
 * Applied to login, forgot-password endpoints.
 * Limit: 10 requests per 15 minutes per IP.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(res, 429, 'Too many authentication attempts. Please try again later.', {
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      retryAfterSeconds: 900,
    });
  },
});

/**
 * AI endpoint rate limiter.
 * Limit: 20 requests per minute per IP.
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      429,
      'AI rate limit exceeded. Please wait before sending another query.',
      {
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        retryAfterSeconds: 60,
      }
    );
  },
});

module.exports = { apiRateLimiter, authRateLimiter, aiRateLimiter };
