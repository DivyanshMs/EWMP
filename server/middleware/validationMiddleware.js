/**
 * validationMiddleware.js
 * Zod Request Body Validation Middleware
 * Validates request body, query params, and path params against Zod schemas.
 * Returns structured field-level errors on failure (400).
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Validation Architecture)
 *            API_SPECIFICATION.md Section 11 (Request Validation Standards)
 *            DEVELOPMENT_ORDER.md ADR-306
 */

const { z } = require('zod');
const AppError = require('../utils/AppError');

/**
 * Validate request body against a Zod schema.
 * Usage: router.post('/', validateRequest(mySchema), controller)
 *
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {function} Express middleware
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Convert Zod errors to field-level error map
      const fields = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        fields[field] = err.message;
      });

      return next(
        new AppError(400, 'Validation failed', 'VALIDATION_ERROR', fields)
      );
    }

    // Attach validated + parsed body (type-safe)
    req.validatedBody = result.data;
    next();
  };
};

/**
 * Validate query parameters against a Zod schema.
 * @param {z.ZodSchema} schema
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const fields = {};
      result.error.errors.forEach((err) => {
        const field = err.path.join('.');
        fields[field] = err.message;
      });
      return next(new AppError(400, 'Invalid query parameters', 'VALIDATION_ERROR', fields));
    }

    req.validatedQuery = result.data;
    next();
  };
};

module.exports = { validateRequest, validateQuery };
