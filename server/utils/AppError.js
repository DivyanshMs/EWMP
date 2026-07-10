/**
 * AppError.js
 * Custom Application Error Class
 * All operational errors thrown by services use this class.
 * The global error middleware catches and formats AppError instances.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Error Handling)
 *            API_SPECIFICATION.md Section 12 (Standard Response Format)
 *            DEVELOPMENT_ORDER.md ADR-307
 */

const { HTTP_STATUS, ERROR_CODES } = require('../config/constants');

class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 422, 500)
   * @param {string} message - Human-readable error message
   * @param {string} [errorCode] - Machine-readable error code (e.g. 'LEAVE_BALANCE_INSUFFICIENT')
   * @param {object} [fields] - Field-level validation errors for 400 responses
   */
  constructor(statusCode, message, errorCode = null, fields = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || ERROR_CODES.OPERATIONAL_ERROR;
    this.fields = fields;
    this.isOperational = true;

    // Capture stack trace (excluding constructor call from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', errorCode = ERROR_CODES.VALIDATION_ERROR, fields = null) {
    super(HTTP_STATUS.BAD_REQUEST, message, errorCode, fields);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', errorCode = ERROR_CODES.TOKEN_MISSING) {
    super(HTTP_STATUS.UNAUTHORIZED, message, errorCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Permission denied', errorCode = ERROR_CODES.INSUFFICIENT_ROLE) {
    super(HTTP_STATUS.FORBIDDEN, message, errorCode);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errorCode = ERROR_CODES.ROUTE_NOT_FOUND) {
    super(HTTP_STATUS.NOT_FOUND, message, errorCode);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict', errorCode = ERROR_CODES.DUPLICATE_RESOURCE) {
    super(HTTP_STATUS.CONFLICT, message, errorCode);
  }
}

module.exports = AppError;
module.exports.BadRequestError = BadRequestError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.NotFoundError = NotFoundError;
module.exports.ConflictError = ConflictError;
