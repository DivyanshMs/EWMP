/**
 * cacheManager.js — Phase 13: AI Optimization
 * Multi-layer caching engine managing Context Cache, Prompt Cache, and Response Cache with configurable TTLs.
 * Enforces strict caching rules: caches ONLY General chat, Insights, and Recommendations while authoritatively
 * bypassing caching for Authentication, Payroll, Employee private data, Attendance punches, and Leave approvals.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 13
 */

const { logInfo, logDebug } = require('../../utils/loggerHelper');

const DEFAULT_TTL_SECONDS = 300; // 5 minutes

// In-memory cache stores
const stores = {
  CONTEXT: new Map(),
  PROMPT: new Map(),
  RESPONSE: new Map(),
};

const stats = {
  hits: { CONTEXT: 0, PROMPT: 0, RESPONSE: 0 },
  misses: { CONTEXT: 0, PROMPT: 0, RESPONSE: 0 },
  evictions: 0,
};

/**
 * Determines whether a given request is allowed to be cached based on intent and query content.
 *
 * @param {string} intent - Classified intent category
 * @param {string} [message=''] - Raw or sanitized user query
 * @returns {boolean} True if eligible for caching
 */
const isCacheable = (intent, message = '') => {
  if (!intent || typeof intent !== 'string') {
    return false;
  }

  const normalizedIntent = intent.toUpperCase();
  const allowedIntents = ['GENERAL_CHAT', 'INSIGHT_REQUEST', 'RECOMMENDATION_REQUEST'];

  if (!allowedIntents.includes(normalizedIntent)) {
    return false;
  }

  const queryText = (message || '').toLowerCase();

  // Enforce Forbidden Caching Boundaries
  const forbiddenPatterns = [
    /auth|login|password|token|jwt|session|credential|secret/i, // Authentication
    /salary|salaries|payroll|pay|compensation|bonus|bonuses|tax|tds|reimburse|bank|routing/i, // Payroll
    /private|ssn|social\s*security|bank\s*account|routing\s*number|medical|health|dob|date\s*of\s*birth/i, // Employee private data
    /clock\s*in|punch\s*in|clock\s*out|punch\s*out|regulariz|correct\s*attendance/i, // Attendance punch actions
    /approve\s*leave|reject\s*leave|leave\s*approval|grant\s*leave/i, // Leave approvals
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(queryText)) {
      logDebug(`Cache Manager: Caching bypassed for query matching forbidden pattern: ${pattern}`);
      return false;
    }
  }

  return true;
};

/**
 * Retrieves an item from the specified cache store if present and not expired.
 *
 * @param {string} key - Cache lookup key
 * @param {string} [storeType='RESPONSE'] - Store tier ('CONTEXT', 'PROMPT', or 'RESPONSE')
 * @returns {any|null} Cached value or null on miss/expiration
 */
const get = (key, storeType = 'RESPONSE') => {
  const store = stores[storeType] || stores.RESPONSE;
  const item = store.get(key);

  if (!item) {
    if (stats.misses[storeType] !== undefined) stats.misses[storeType]++;
    logInfo('Cache miss', { storeType, key: key.slice(0, 50) });
    return null;
  }

  if (Date.now() > item.expiresAt) {
    store.delete(key);
    stats.evictions++;
    if (stats.misses[storeType] !== undefined) stats.misses[storeType]++;
    logInfo('Cache miss (expired)', { storeType, key: key.slice(0, 50) });
    return null;
  }

  if (stats.hits[storeType] !== undefined) stats.hits[storeType]++;
  logInfo('Cache hit', { storeType, key: key.slice(0, 50) });
  return item.value;
};

/**
 * Stores a value in the specified cache tier with a Time-To-Live (TTL).
 *
 * @param {string} key - Cache lookup key
 * @param {any} value - Value to cache
 * @param {string} [storeType='RESPONSE'] - Store tier ('CONTEXT', 'PROMPT', or 'RESPONSE')
 * @param {number} [ttlSeconds=DEFAULT_TTL_SECONDS] - Expiration duration in seconds
 */
const set = (key, value, storeType = 'RESPONSE', ttlSeconds = DEFAULT_TTL_SECONDS) => {
  if (!key || value === undefined || value === null) {
    return;
  }

  const store = stores[storeType] || stores.RESPONSE;
  const expiresAt = Date.now() + ttlSeconds * 1000;

  store.set(key, { value, expiresAt });
  logDebug(`Cache stored [${storeType}]: key=${key.slice(0, 50)} (TTL=${ttlSeconds}s)`);
};

/**
 * Clears items from a cache store.
 *
 * @param {string} [storeType] - Optional specific store to clear. If omitted, clears all stores.
 */
const clear = (storeType) => {
  if (storeType && stores[storeType]) {
    stores[storeType].clear();
    logDebug(`Cache cleared [${storeType}].`);
  } else {
    stores.CONTEXT.clear();
    stores.PROMPT.clear();
    stores.RESPONSE.clear();
    logDebug('All cache stores cleared.');
  }
};

/**
 * Retrieves aggregate cache statistics across all tiers.
 *
 * @returns {object} Cache statistics object
 */
const getStats = () => {
  return {
    sizes: {
      CONTEXT: stores.CONTEXT.size,
      PROMPT: stores.PROMPT.size,
      RESPONSE: stores.RESPONSE.size,
    },
    hits: { ...stats.hits },
    misses: { ...stats.misses },
    evictions: stats.evictions,
  };
};

module.exports = {
  DEFAULT_TTL_SECONDS,
  isCacheable,
  get,
  set,
  clear,
  getStats,
};
