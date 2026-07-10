/**
 * errorMiddleware.js
 * Global Error Handler
 * Must be registered as the LAST middleware in app.js / server.js.
 * Catches all errors propagated via next(err) or thrown AppErrors.
 * Formats all errors using the standard response envelope.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Error Handling)
 *            API_SPECIFICATION.md Section 12 (Standard Response Format)
 *            DEVELOPMENT_ORDER.md ADR-307
 */

const { sendError } = require('../utils/formatResponse');
const { logError } = require('../utils/loggerHelper');
const { ERROR_CODES } = require('../config/constants');

/**
 * Global error handling middleware.
 * @param {Error} err - Error object (AppError or native Error)
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Express next (required signature for error middleware)
 */
const errorMiddleware = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Log all errors using winston
  logError(`[${req.method}] ${req.originalUrl} - Error: ${err.message}`, {
    stack: err.stack,
    name: err.name,
    code: err.code || err.errorCode,
  });

  // Operational error (thrown by AppError in service layer)
  if (err.isOperational) {
    const errorPayload = {
      code: err.errorCode || ERROR_CODES.OPERATIONAL_ERROR,
    };

    if (err.fields) {
      errorPayload.fields = err.fields;
    }

    if (err.detail && !isProduction) {
      errorPayload.detail = err.detail;
    }

    return sendError(res, err.statusCode, err.message, errorPayload);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const fields = {};
    Object.keys(err.errors).forEach((key) => {
      fields[key] = err.errors[key].message;
    });
    return sendError(res, 400, 'Validation failed', {
      code: ERROR_CODES.VALIDATION_ERROR,
      fields,
    });
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, `A record with this ${field} already exists.`, {
      code: ERROR_CODES.DUPLICATE_RESOURCE,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid authentication token.', {
      code: ERROR_CODES.TOKEN_INVALID,
    });
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Authentication token has expired.', {
      code: ERROR_CODES.TOKEN_EXPIRED,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid resource identifier format.', {
      code: ERROR_CODES.INVALID_ID,
    });
  }

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 400, 'Uploaded file exceeds the maximum allowed size.', {
        code: ERROR_CODES.FILE_TOO_LARGE,
      });
    }
    return sendError(res, 400, `File upload error: ${err.message}`, {
      code: ERROR_CODES.FILE_UPLOAD_ERROR,
    });
  }

  // Unhandled / programming error — do not expose internals
  return sendError(res, 500, 'An internal server error occurred. Please try again later.', {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
  });
};

module.exports = errorMiddleware;
