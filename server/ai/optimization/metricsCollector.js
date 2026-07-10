/**
 * metricsCollector.js — Phase 13: AI Optimization
 * Production performance metrics collector tracking request volume, average latency,
 * provider latency, cache hit/miss rates, error rates, token usage, retries, and timeouts.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 13
 */

const { logDebug } = require('../../utils/loggerHelper');

const metrics = {
  totalRequests: 0,
  totalErrors: 0,
  totalLatencyMs: 0,
  totalProviderLatencyMs: 0,
  cacheHits: 0,
  cacheMisses: 0,
  totalTokensUsed: 0,
  retriesCount: 0,
  timeoutsCount: 0,
  startTime: Date.now(),
};

/**
 * Records performance and execution metrics for an AI request.
 *
 * @param {object} params - Execution statistics
 * @param {number} [params.latencyMs=0] - Total request latency in milliseconds
 * @param {number} [params.providerLatencyMs=0] - Provider execution latency in milliseconds
 * @param {boolean} [params.isCacheHit=false] - Whether the request was served from Response Cache
 * @param {boolean} [params.isError=false] - Whether the request resulted in an error or fallback
 * @param {number|null} [params.tokensUsed=null] - Token count if reported by provider
 * @param {boolean} [params.wasRetry=false] - Whether a retry attempt occurred
 * @param {boolean} [params.wasTimeout=false] - Whether a provider timeout occurred
 */
const recordRequest = ({
  latencyMs = 0,
  providerLatencyMs = 0,
  isCacheHit = false,
  isError = false,
  tokensUsed = null,
  wasRetry = false,
  wasTimeout = false,
} = {}) => {
  metrics.totalRequests++;

  if (isError) {
    metrics.totalErrors++;
  }

  if (typeof latencyMs === 'number' && !isNaN(latencyMs)) {
    metrics.totalLatencyMs += latencyMs;
  }

  if (typeof providerLatencyMs === 'number' && !isNaN(providerLatencyMs)) {
    metrics.totalProviderLatencyMs += providerLatencyMs;
  }

  if (isCacheHit) {
    metrics.cacheHits++;
  } else {
    metrics.cacheMisses++;
  }

  if (typeof tokensUsed === 'number' && !isNaN(tokensUsed)) {
    metrics.totalTokensUsed += tokensUsed;
  }

  if (wasRetry) {
    metrics.retriesCount++;
  }

  if (wasTimeout) {
    metrics.timeoutsCount++;
  }

  logDebug(`AI Metrics Updated: Requests=${metrics.totalRequests}, Hits=${metrics.cacheHits}, Misses=${metrics.cacheMisses}, Errors=${metrics.totalErrors}`);
};

/**
 * Retrieves calculated summary performance metrics.
 *
 * @returns {object} Formatted metrics summary with percentages and averages
 */
const getMetrics = () => {
  const total = metrics.totalRequests;
  const cacheTotal = metrics.cacheHits + metrics.cacheMisses;

  const averageLatencyMs = total > 0 ? Number((metrics.totalLatencyMs / total).toFixed(2)) : 0;
  const averageProviderLatencyMs = total > 0 ? Number((metrics.totalProviderLatencyMs / total).toFixed(2)) : 0;
  const errorRatePercentage = total > 0 ? Number(((metrics.totalErrors / total) * 100).toFixed(2)) : 0;
  const cacheHitRatePercentage = cacheTotal > 0 ? Number(((metrics.cacheHits / cacheTotal) * 100).toFixed(2)) : 0;
  const cacheMissRatePercentage = cacheTotal > 0 ? Number(((metrics.cacheMisses / cacheTotal) * 100).toFixed(2)) : 0;
  const uptimeSeconds = Number(((Date.now() - metrics.startTime) / 1000).toFixed(0));

  return {
    requestVolume: total,
    errorRate: `${errorRatePercentage}%`,
    errorCount: metrics.totalErrors,
    averageLatencyMs,
    averageProviderLatencyMs,
    cacheHitRate: `${cacheHitRatePercentage}%`,
    cacheMissRate: `${cacheMissRatePercentage}%`,
    cacheHits: metrics.cacheHits,
    cacheMisses: metrics.cacheMisses,
    tokenUsage: metrics.totalTokensUsed,
    retries: metrics.retriesCount,
    timeouts: metrics.timeoutsCount,
    uptimeSeconds,
  };
};

/**
 * Resets all collected performance metrics to zero.
 */
const resetMetrics = () => {
  metrics.totalRequests = 0;
  metrics.totalErrors = 0;
  metrics.totalLatencyMs = 0;
  metrics.totalProviderLatencyMs = 0;
  metrics.cacheHits = 0;
  metrics.cacheMisses = 0;
  metrics.totalTokensUsed = 0;
  metrics.retriesCount = 0;
  metrics.timeoutsCount = 0;
  metrics.startTime = Date.now();
  logDebug('AI Metrics reset.');
};

module.exports = {
  recordRequest,
  getMetrics,
  resetMetrics,
};
