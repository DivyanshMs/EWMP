/**
 * asyncHandler.js
 * Async Controller Wrapper Middleware
 * Wraps asynchronous route handlers to catch rejected promises and automatically
 * pass errors to the next() middleware (global error handler).
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Error Handling)
 */

/**
 * Wraps an async route handler or middleware.
 * @param {Function} fn - Async Express function (req, res, next)
 * @returns {Function} Express middleware that catches async errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
