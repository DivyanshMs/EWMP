/**
 * payrollPlugin.js — Phase 15: AI Module Plugin Framework
 * Payroll Module AI Plugin exposing standardized AI interface for salary queries, compensation optimization,
 * payroll expenditure insights, and payroll cycle generation actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class PayrollPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'PAYROLL',
      version: '1.0.0',
      supportedIntents: [
        'PAYROLL_QUERY',
        'PAYROLL_RECOMMENDATION',
        'PAYROLL_INSIGHT',
        'PAYROLL_ACTION',
        'GENERATE_PAYROLL',
      ],
      availableFeatures: [
        'Salary Structure & Tax Deduction Context',
        'Compensation Benchmarking Recommendations',
        'Monthly Payroll Expenditure Growth Insights',
        'Monthly Payroll Cycle Generation Action Planning',
      ],
    });
  }
}

module.exports = new PayrollPlugin();
