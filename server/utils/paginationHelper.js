/**
 * paginationHelper.js
 * Pagination Parameters and Metadata Calculation Utility
 * Standardizes extraction of page, limit, and skip values across all query endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 11 (Query Parameter Standards)
 *            ARCHITECTURE_REVISION.md Section 7.3
 */

const { PAGINATION } = require('../config/constants');

/**
 * Extracts and normalizes pagination parameters from request query object.
 * @param {object} query - Express req.query object
 * @returns {object} { page, limit, skip, sortBy, sortOrder }
 */
const getPaginationParams = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder && query.sortOrder.toLowerCase() === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

/**
 * Formats standard pagination metadata envelope.
 * @param {number} total - Total number of matching items
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {object} { total, page, limit, totalPages, hasNextPage, hasPrevPage }
 */
const getPaginationMetadata = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  getPaginationParams,
  getPaginationMetadata,
};
