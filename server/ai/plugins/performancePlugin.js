/**
 * performancePlugin.js — Phase 15: AI Module Plugin Framework
 * Performance Module AI Plugin exposing standardized AI interface for KPI appraisal queries,
 * performance improvement recommendations, appraisal rating distribution insights, and review cycle actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class PerformancePlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'PERFORMANCE',
      version: '1.0.0',
      supportedIntents: [
        'PERFORMANCE_QUERY',
        'PERFORMANCE_RECOMMENDATION',
        'PERFORMANCE_INSIGHT',
        'PERFORMANCE_ACTION',
      ],
      availableFeatures: [
        'KPI Appraisal Scorecard Context',
        'Performance Coaching & Improvement Recommendations',
        'Appraisal Rating Distribution & Bell Curve Insights',
        'Performance Review Cycle & Goal Setting Action Planning',
      ],
    });
  }
}

module.exports = new PerformancePlugin();
