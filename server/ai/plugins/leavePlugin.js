/**
 * leavePlugin.js — Phase 15: AI Module Plugin Framework
 * Leave Module AI Plugin exposing standardized AI interface for leave queries, leave balance optimization,
 * absence trend insights, and leave approval/rejection actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class LeavePlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'LEAVE',
      version: '1.0.0',
      supportedIntents: [
        'LEAVE_QUERY',
        'LEAVE_RECOMMENDATION',
        'LEAVE_INSIGHT',
        'LEAVE_ACTION',
        'LEAVE_APPROVAL',
        'LEAVE_REJECTION',
      ],
      availableFeatures: [
        'Leave Balance & Pending Request Context',
        'Leave Optimization & Burnout Recommendations',
        'Department Leave Trend Insights',
        'Leave Approval & Rejection Action Planning',
      ],
    });
  }
}

module.exports = new LeavePlugin();
