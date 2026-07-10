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
 * Queries all employees in org to determine the max existing ID number.
 * @param {string} organizationId - MongoDB ObjectId string
 * @returns {Promise<string>} Generated employeeId (e.g. 'EMP0010')
 */
const generateEmployeeId = async (organizationId) => {
  const employees = await Employee.find({ organizationId }).select('employeeId').lean();
  let maxNum = 0;
  
  employees.forEach((emp) => {
    if (emp.employeeId && emp.employeeId.startsWith('EMP')) {
      const numPart = parseInt(emp.employeeId.slice(3), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `EMP${String(nextNum).padStart(4, '0')}`;
};

module.exports = generateEmployeeId;
