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
    this.errorCode = errorCode;
    this.fields = fields;
    this.isOperational = true;

    // Capture stack trace (excluding constructor call from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
