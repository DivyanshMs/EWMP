/**
 * dateHelper.js
 * Standardized Date and Time Calculation Utility
 * Provides reusable date formatting, range generation, and difference computation across the backend.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 */

/**
 * Returns the start of the day (00:00:00.000) for a given date.
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns the end of the day (23:59:59.999) for a given date.
 * @param {Date|string} [date=new Date()]
 * @returns {Date}
 */
const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Returns a Mongoose date range query object ($gte, $lte) for a given start and end date.
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {object} { $gte: Date, $lte: Date }
 */
const getDateRangeFilter = (startDate, endDate) => {
  const filter = {};
  if (startDate) filter.$gte = getStartOfDay(startDate);
  if (endDate) filter.$lte = getEndOfDay(endDate);
  return filter;
};

/**
 * Formats a Date object as YYYY-MM-DD string.
 * @param {Date|string} date
 * @returns {string}
 */
const formatDateString = (date = new Date()) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculates the difference in days between two dates.
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 * @returns {number}
 */
const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = {
  getStartOfDay,
  getEndOfDay,
  getDateRangeFilter,
  formatDateString,
  getDaysDifference,
};
