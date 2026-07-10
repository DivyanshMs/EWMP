/**
 * securityMiddleware.js — Phase 12: AI Security & Governance
 * Express middleware layer integrating Input Guard and Output Guard into AI API endpoints.
 * Intercepts incoming requests to detect prompt injections, oversized messages, control sequences,
 * and RBAC/ownership violations. Intercepts outgoing HTTP responses to strip API keys, JWTs, secrets,
 * stack traces, file paths, and mask sensitive financial numbers.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 12
 */

const { validateInput } = require('./inputGuard');
const { sanitizeOutput } = require('./outputGuard');
const { logDebug } = require('../../utils/loggerHelper');

/**
 * Express middleware that validates and sanitizes incoming AI request messages.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const validateAiRequest = (req, res, next) => {
  try {
    if (req.body && typeof req.body.message !== 'undefined') {
      const validationResult = validateInput({
        message: req.body.message,
        user: req.user,
      });
      req.body.message = validationResult.sanitizedMessage;
    }
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Express middleware that intercepts outgoing JSON responses to enforce output sanitization.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const sanitizeAiResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    if (body && typeof body === 'object') {
      if (body.data) {
        body.data = sanitizeOutput(body.data);
      } else {
        body = sanitizeOutput(body);
      }
    }
    return originalJson.call(this, body);
  };

  next();
};

module.exports = {
  validateAiRequest,
  sanitizeAiResponse,
};
