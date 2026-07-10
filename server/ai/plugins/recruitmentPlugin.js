/**
 * recruitmentPlugin.js — Phase 15: AI Module Plugin Framework
 * Recruitment Module AI Plugin exposing standardized AI interface for job vacancy queries,
 * candidate funnel recommendations, time-to-hire insights, and candidate evaluation actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class RecruitmentPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'RECRUITMENT',
      version: '1.0.0',
      supportedIntents: [
        'RECRUITMENT_QUERY',
        'RECRUITMENT_RECOMMENDATION',
        'RECRUITMENT_INSIGHT',
        'RECRUITMENT_ACTION',
      ],
      availableFeatures: [
        'Job Vacancy & Applicant Funnel Context',
        'Candidate Sourcing & Interview Pipeline Recommendations',
        'Time-to-Hire & Recruitment Cost Efficiency Insights',
        'Candidate Evaluation & Onboarding Action Planning',
      ],
    });
  }
}

module.exports = new RecruitmentPlugin();
