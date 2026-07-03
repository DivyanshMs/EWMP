/**
 * generateEmployeeId.js
 * Auto-generate unique Employee IDs.
 * Format: EMP + zero-padded sequential number (e.g. EMP0001, EMP0042)
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            DATABASE_DESIGN.md Collection: employees (employeeId field)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 20)
 */

const Employee = require('../models/Employee');

/**
 * Generates the next sequential employeeId for an organization.
 * Queries the last created employee to determine the next number.
 * @param {string} organizationId - MongoDB ObjectId string
 * @returns {Promise<string>} Generated employeeId (e.g. 'EMP0042')
 */
const generateEmployeeId = async (organizationId) => {
  // TODO: Implement after Employee model is defined (Phase 4A)
  // Pattern: find last employee in org by employeeId, extract number, increment
  throw new Error('generateEmployeeId: Not implemented. Implement in Phase 4A.');
};

module.exports = generateEmployeeId;
