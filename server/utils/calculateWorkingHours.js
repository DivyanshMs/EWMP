/**
 * calculateWorkingHours.js
 * Working Hours Computation Utility
 * Used by attendanceService to compute daily working hours, late status,
 * early exit, and overtime for each attendance record.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            DATABASE_DESIGN.md Collection: attendance
 *            DEVELOPMENT_ORDER.md Section 10 (Step 25)
 */

/**
 * Calculate working hours between clock-in and clock-out times.
 * @param {Date} clockIn - Clock-in timestamp
 * @param {Date} clockOut - Clock-out timestamp
 * @returns {number} Working hours rounded to 2 decimal places
 */
const calculateWorkingHours = (clockIn, clockOut) => {
  if (!clockIn || !clockOut) return 0;
  const diffMs = clockOut - clockIn;
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 100) / 100;
};

/**
 * Determine if employee clocked in late based on shift start time and grace period.
 * @param {Date} clockIn - Clock-in timestamp
 * @param {string} shiftStartTime - Shift start time in 'HH:mm' format (24hr)
 * @param {number} gracePeriodMinutes - Grace period in minutes (default 15)
 * @returns {boolean}
 */
const isLateArrival = (clockIn, shiftStartTime, gracePeriodMinutes = 15) => {
  // TODO: Implement in Phase 4B when Attendance module begins
  throw new Error('isLateArrival: Not implemented. Implement in Phase 4B.');
};

/**
 * Calculate overtime hours beyond the standard shift threshold.
 * @param {number} workingHours - Actual hours worked
 * @param {number} overtimeThreshold - Hours threshold (default 8)
 * @returns {number} Overtime hours (0 if no overtime)
 */
const calculateOvertimeHours = (workingHours, overtimeThreshold = 8) => {
  return Math.max(0, workingHours - overtimeThreshold);
};

module.exports = {
  calculateWorkingHours,
  isLateArrival,
  calculateOvertimeHours,
};
