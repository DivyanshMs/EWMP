/**
 * employeePlugin.js — Phase 15: AI Module Plugin Framework
 * Employee Module AI Plugin exposing standardized AI interface for employee profile queries,
 * headcount retention recommendations, workforce demographics insights, and profile creation/update actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class EmployeePlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'EMPLOYEE',
      version: '1.0.0',
      supportedIntents: [
        'EMPLOYEE_QUERY',
        'EMPLOYEE_RECOMMENDATION',
        'EMPLOYEE_INSIGHT',
        'EMPLOYEE_ACTION',
        'CREATE_EMPLOYEE',
        'UPDATE_EMPLOYEE',
      ],
      availableFeatures: [
        'Employee Profile & Department Context',
        'Workforce Structure & Career Growth Recommendations',
        'Executive Headcount & Retention Insights',
        'Employee Onboarding & Profile Update Action Planning',
      ],
    });
  }
}

module.exports = new EmployeePlugin();
