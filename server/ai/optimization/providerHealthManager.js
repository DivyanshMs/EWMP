/**
 * providerHealthManager.js — Phase 13: AI Optimization
 * Continuous provider health monitor tracking availability, failure rates, and circuit breaker states.
 * When a provider is unhealthy, immediately triggers fast graceful fallbacks without waiting for timeout cycles.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 13
 */

const { logWarn, logInfo, logDebug } = require('../../utils/loggerHelper');

const DEFAULT_MAX_FAILURES = 3;
const RECOVERY_WINDOW_MS = 30000; // 30 seconds

const providerStates = new Map();

/**
 * Retrieves or initializes the health tracking state for a given provider.
 *
 * @param {string} [providerName='gemini'] - Provider identifier
 * @returns {object} Provider state object
 */
const getStatus = (providerName = 'gemini') => {
  if (!providerStates.has(providerName)) {
    providerStates.set(providerName, {
      providerName,
      isHealthy: true,
      consecutiveFailures: 0,
      lastFailureTime: null,
      lastSuccessTime: Date.now(),
      lastError: null,
    });
  }
  return providerStates.get(providerName);
};

/**
 * Records a successful execution for a provider, resetting failure counters.
 *
 * @param {string} [providerName='gemini'] - Provider identifier
 */
const recordSuccess = (providerName = 'gemini') => {
  const state = getStatus(providerName);
  const wasUnhealthy = !state.isHealthy;

  state.isHealthy = true;
  state.consecutiveFailures = 0;
  state.lastSuccessTime = Date.now();
  state.lastError = null;

  if (wasUnhealthy) {
    logInfo('🟢 AI Provider recovered and is now HEALTHY', { providerName });
  } else {
    logDebug(`AI Provider health confirmed [${providerName}].`);
  }
};

/**
 * Records an execution failure or timeout for a provider, evaluating circuit breaker thresholds.
 *
 * @param {string} [providerName='gemini'] - Provider identifier
 * @param {Error|string} [error=null] - Error object or message
 * @param {number} [maxFailures=DEFAULT_MAX_FAILURES] - Threshold before marking unhealthy
 */
const recordFailure = (providerName = 'gemini', error = null, maxFailures = DEFAULT_MAX_FAILURES) => {
  const state = getStatus(providerName);
  state.consecutiveFailures++;
  state.lastFailureTime = Date.now();
  state.lastError = error && (error.message || error.toString()) ? (error.message || error.toString()) : 'Unknown error';

  if (state.consecutiveFailures >= maxFailures && state.isHealthy) {
    state.isHealthy = false;
    logWarn('🚨 AI Provider marked UNHEALTHY (Health failure threshold reached)', {
      providerName,
      consecutiveFailures: state.consecutiveFailures,
      lastError: state.lastError,
    });
  } else {
    logWarn('⚠️ AI Provider execution failure recorded', {
      providerName,
      consecutiveFailures: state.consecutiveFailures,
      error: state.lastError,
    });
  }
};

/**
 * Checks whether a provider is currently healthy and eligible for traffic.
 * Implements a half-open probe mechanism after the recovery window expires.
 *
 * @param {string} [providerName='gemini'] - Provider identifier
 * @returns {boolean} True if healthy or ready for a probe attempt
 */
const isProviderHealthy = (providerName = 'gemini') => {
  const state = getStatus(providerName);

  if (state.isHealthy) {
    return true;
  }

  // Check if recovery window has passed for a probe attempt
  if (state.lastFailureTime && Date.now() - state.lastFailureTime > RECOVERY_WINDOW_MS) {
    logDebug(`AI Provider '${providerName}' recovery window passed. Permitting half-open probe attempt.`);
    return true;
  }

  return false;
};

/**
 * Resets the health state of all or specific providers.
 *
 * @param {string} [providerName] - Optional provider identifier to reset
 */
const resetHealth = (providerName) => {
  if (providerName && providerStates.has(providerName)) {
    providerStates.delete(providerName);
  } else {
    providerStates.clear();
  }
  logDebug('AI Provider health monitor states reset.');
};

module.exports = {
  DEFAULT_MAX_FAILURES,
  RECOVERY_WINDOW_MS,
  getStatus,
  recordSuccess,
  recordFailure,
  isProviderHealthy,
  resetHealth,
};
