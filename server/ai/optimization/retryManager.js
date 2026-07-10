/**
 * retryManager.js — Phase 13: AI Optimization
 * Resilience engine managing provider retry attempts, execution timeouts, and exponential backoff.
 * Prevents hanging requests and enables seamless provider recovery before triggering graceful fallbacks.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 13
 */

const { logWarn, logDebug } = require('../../utils/loggerHelper');

/**
 * Utility to pause asynchronous execution for a specified duration.
 *
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes an asynchronous provider function with timeout enforcement and automated retries.
 *
 * @param {Function} asyncFn - Zero-argument asynchronous function to execute
 * @param {object} [options] - Execution options
 * @param {number} [options.maxRetries=2] - Maximum number of retry attempts
 * @param {number} [options.delayMs=500] - Base delay between retries in milliseconds
 * @param {number} [options.timeoutMs=5000] - Maximum execution timeout per attempt in milliseconds
 * @param {string} [options.providerName='gemini'] - Name of the AI provider for logging
 * @param {Function} [options.onRetry] - Callback invoked when a retry occurs
 * @param {Function} [options.onTimeout] - Callback invoked when a timeout occurs
 * @returns {Promise<any>} Result of asyncFn
 * @throws {Error} Throws error if all retry attempts fail or timeout expires without recovery
 */
const executeWithRetry = async (asyncFn, {
  maxRetries = 2,
  delayMs = 500,
  timeoutMs = 5000,
  providerName = 'gemini',
  onRetry = null,
  onTimeout = null,
} = {}) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          const timeoutErr = new Error(`PROVIDER_TIMEOUT: AI Provider '${providerName}' exceeded execution timeout of ${timeoutMs}ms.`);
          timeoutErr.code = 'PROVIDER_TIMEOUT';
          reject(timeoutErr);
        }, timeoutMs);
      });

      const execPromise = (async () => {
        const result = await asyncFn();
        return result;
      })();

      const result = await Promise.race([execPromise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      lastError = error;
      const isTimeout = error.code === 'PROVIDER_TIMEOUT' || (error.message && error.message.includes('PROVIDER_TIMEOUT'));

      if (isTimeout) {
        logWarn('Timeout', {
          providerName,
          timeoutMs,
          attempt,
          message: error.message,
        });
        if (typeof onTimeout === 'function') {
          onTimeout(error, attempt);
        }
      }

      if (attempt <= maxRetries) {
        logWarn('Retry', {
          providerName,
          attempt,
          maxRetries,
          reason: error.message || 'Unknown execution error',
        });
        if (typeof onRetry === 'function') {
          onRetry(attempt, error);
        }
        const backoffMs = delayMs * attempt; // Linear/exponential backoff
        await sleep(backoffMs);
      }
    }
  }

  logWarn(`All retry attempts (${maxRetries}) failed for AI Provider '${providerName}'. Triggering graceful fallback.`);
  throw lastError;
};

module.exports = {
  executeWithRetry,
  sleep,
};
