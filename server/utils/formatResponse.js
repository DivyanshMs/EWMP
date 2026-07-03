/**
 * formatResponse.js
 * Standard Response Envelope Utility
 * All controllers use this utility to format their responses.
 * Ensures consistent { success, message, data } structure across all 100+ endpoints.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Response Format)
 *            API_SPECIFICATION.md Section 12 (Standard Response Format)
 *            DEVELOPMENT_ORDER.md ADR-303
 */

/**
 * Format a successful response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, 204)
 * @param {string} message - Human-readable success message
 * @param {*} data - Response payload (object, array, or null)
 */
const sendSuccess = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Format a paginated list response.
 * @param {object} res - Express response object
 * @param {string} message - Human-readable success message
 * @param {Array} items - Array of records for the current page
 * @param {number} total - Total record count across all pages
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 */
const sendPaginatedSuccess = (res, message, items, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    message,
    data: {
      items,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    },
  });
};

/**
 * Format an error response.
 * Used exclusively by the global error middleware — services throw AppError instead.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {object} error - Error details { code, detail, fields }
 */
const sendError = (res, statusCode, message, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

module.exports = { sendSuccess, sendPaginatedSuccess, sendError };
