/**
 * validationMiddleware.js
 * Zod Request Body, Query, and Path Param Validation Middleware
 * Validates request body, query params, and path params against Zod schemas.
 * Returns structured field-level errors on failure (400).
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Validation Architecture)
 *            API_SPECIFICATION.md Section 11 (Request Validation Standards)
 *            DEVELOPMENT_ORDER.md ADR-306
 */

const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../config/constants');

/**
 * Validate request body against a Zod schema.
 * Usage: router.post('/', validateRequest(mySchema), controller)
 *
 * @param {object} schema - Zod schema to validate against
 * @returns {function} Express middleware
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fields = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'body';
        fields[field] = err.message;
      });

      return next(new AppError(400, 'Validation failed', ERROR_CODES.VALIDATION_ERROR, fields));
    }

    req.validatedBody = result.data;
    next();
  };
};

/**
 * Validate query parameters against a Zod schema.
 * @param {object} schema
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const fields = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'query';
        fields[field] = err.message;
      });
      return next(
        new AppError(400, 'Invalid query parameters', ERROR_CODES.VALIDATION_ERROR, fields)
      );
    }

    req.validatedQuery = result.data;
    next();
  };
};

/**
 * Validate path parameters against a Zod schema.
 * @param {object} schema
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const fields = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.') || 'params';
        fields[field] = err.message;
      });
      return next(
        new AppError(400, 'Invalid URL parameters', ERROR_CODES.VALIDATION_ERROR, fields)
      );
    }

    req.validatedParams = result.data;
    next();
  };
};

module.exports = { validateRequest, validateQuery, validateParams };
