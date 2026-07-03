/**
 * queryHelper.js
 * Mongoose Query Builder and Filtering Utility
 * Constructs standardized filter, sort, and projection objects for Mongoose queries.
 *
 * Authority: API_SPECIFICATION.md Section 11 (Filtering and Search Contract)
 *            ARCHITECTURE_REVISION.md Section 7.3
 */

/**
 * Builds a Mongoose filter object from request query parameters.
 * Automatically strips pagination and control params (page, limit, sortBy, sortOrder, fields, search).
 *
 * @param {object} query - Express req.query object
 * @param {string[]} [allowedFilters] - Whitelist of allowed filtering keys
 * @returns {object} Mongoose filter query object
 */
const buildFilterQuery = (query = {}, allowedFilters = []) => {
  const excludedFields = ['page', 'limit', 'sortBy', 'sortOrder', 'fields', 'search', 'populate'];
  const filter = {};

  Object.keys(query).forEach((key) => {
    if (!excludedFields.includes(key)) {
      if (allowedFilters.length === 0 || allowedFilters.includes(key)) {
        // Handle boolean conversion
        if (query[key] === 'true') filter[key] = true;
        else if (query[key] === 'false') filter[key] = false;
        else filter[key] = query[key];
      }
    }
  });

  return filter;
};

/**
 * Builds a regex search query object across specified fields.
 * @param {string} searchTerm - The string to search for
 * @param {string[]} searchFields - Array of field names to match against
 * @returns {object} Mongoose $or query object
 */
const buildSearchQuery = (searchTerm, searchFields = []) => {
  if (!searchTerm || searchFields.length === 0) return {};

  const regex = new RegExp(searchTerm.trim(), 'i');
  return {
    $or: searchFields.map((field) => ({ [field]: regex })),
  };
};

/**
 * Formats standard sorting object for Mongoose .sort().
 * @param {string} sortBy - Field to sort by
 * @param {string|number} sortOrder - 'asc'|1 or 'desc'|-1
 * @returns {object} Mongoose sort object
 */
const buildSortQuery = (sortBy = 'createdAt', sortOrder = 'desc') => {
  const order = sortOrder === 'asc' || sortOrder === 1 || sortOrder === '1' ? 1 : -1;
  return { [sortBy]: order };
};

/**
 * Formats projection string for Mongoose .select().
 * @param {string} fields - Comma-separated field names (e.g., 'name,email,-password')
 * @returns {string} Space-separated select string
 */
const buildSelectQuery = (fields) => {
  if (!fields) return '-__v';
  return fields
    .split(',')
    .map((f) => f.trim())
    .join(' ');
};

module.exports = {
  buildFilterQuery,
  buildSearchQuery,
  buildSortQuery,
  buildSelectQuery,
};
