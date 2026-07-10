/**
 * taskPlugin.js — Phase 15: AI Module Plugin Framework
 * Task Module AI Plugin exposing standardized AI interface for task tracking queries,
 * deadline optimization recommendations, task completion velocity insights, and task creation actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class TaskPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'TASK',
      version: '1.0.0',
      supportedIntents: [
        'TASK_QUERY',
        'TASK_RECOMMENDATION',
        'TASK_INSIGHT',
        'TASK_ACTION',
        'CREATE_TASK',
      ],
      availableFeatures: [
        'Task Status & Assignee Workload Context',
        'Deadline Optimization & Bottleneck Removal Recommendations',
        'Task Completion Velocity & Backlog Insights',
        'Operational & Onboarding Task Creation Action Planning',
      ],
    });
  }
}

module.exports = new TaskPlugin();
