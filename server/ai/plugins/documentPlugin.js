/**
 * documentPlugin.js — Phase 15: AI Module Plugin Framework
 * Document Module AI Plugin exposing standardized AI interface for compliance/HR document queries,
 * document renewal recommendations, policy adherence insights, and document upload actions.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const BasePlugin = require('./basePlugin');

class DocumentPlugin extends BasePlugin {
  constructor() {
    super({
      moduleName: 'DOCUMENT',
      version: '1.0.0',
      supportedIntents: [
        'DOCUMENT_QUERY',
        'DOCUMENT_RECOMMENDATION',
        'DOCUMENT_INSIGHT',
        'DOCUMENT_ACTION',
        'UPLOAD_DOCUMENT',
      ],
      availableFeatures: [
        'HR Policy & Compliance Document Repository Context',
        'Document Renewal & Expiry Alert Recommendations',
        'Enterprise Policy Adherence & Audit Insights',
        'Compliance & Employee Document Upload Action Planning',
      ],
    });
  }
}

module.exports = new DocumentPlugin();
