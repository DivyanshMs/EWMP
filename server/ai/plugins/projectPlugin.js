/**
 * projectPlugin.js — Phase 15: AI Module Plugin Framework
 * Project Module AI Plugin exposing standardized AI interface for project status queries,
 * resource allocation recommendations, budget burn insights, and project assignment actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class ProjectPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'PROJECT',
      version: '1.0.0',
      supportedIntents: [
        'PROJECT_QUERY',
        'PROJECT_RECOMMENDATION',
        'PROJECT_INSIGHT',
        'PROJECT_ACTION',
        'ASSIGN_PROJECT',
      ],
      availableFeatures: [
        'Project Allocation & Milestone Context',
        'Resource Leveling & Workload Balancing Recommendations',
        'Budget Burn & Project Delivery Velocity Insights',
        'Employee Project Assignment Action Planning',
      ],
    });
  }
}

module.exports = new ProjectPlugin();
