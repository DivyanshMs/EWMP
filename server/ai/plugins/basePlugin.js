/**
 * basePlugin.js — Phase 15: AI Module Plugin Framework
 * Abstract Base Plugin establishing the standardized AI interface for all enterprise business modules.
 * Authoritatively delegates execution to existing core engines (Context Builder, Recommendation Engine,
 * Insight Engine, and Action Planner) without duplicating business logic or querying MongoDB directly.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 15
 */

const contextBuilder = require('../context/contextBuilder');
const recommendationEngine = require('../recommendation/recommendationEngine');
const insightEngine = require('../insights/insightEngine');
const actionPlanner = require('../planner/actionPlanner');
const { logDebug, logWarn } = require('../../utils/loggerHelper');

class BasePlugin {
  /**
   * @param {object} config - Plugin configuration
   * @param {string} config.moduleName - Unique module identifier (e.g. 'ATTENDANCE')
   * @param {string} [config.version='1.0.0'] - Plugin semantic version
   * @param {Array<string>} [config.supportedIntents=[]] - List of intents supported by this plugin
   * @param {Array<string>} [config.availableFeatures=[]] - List of feature descriptions exposed
   */
  constructor({ moduleName, version = '1.0.0', supportedIntents = [], availableFeatures = [] }) {
    if (!moduleName || typeof moduleName !== 'string') {
      throw new Error('BasePlugin initialization failed: moduleName is required.');
    }
    this.moduleName = moduleName.toUpperCase();
    this.version = version;
    this.supportedIntents = Array.isArray(supportedIntents) ? supportedIntents.map(i => i.toUpperCase()) : [];
    this.availableFeatures = Array.isArray(availableFeatures) ? availableFeatures : [];
    this.isInitialized = false;
  }

  /**
   * Initializes the plugin, validating integrity and readiness.
   * @returns {boolean} True if successfully initialized
   */
  initialize() {
    this.isInitialized = true;
    logDebug(`AI Plugin initialized [${this.moduleName} v${this.version}] supporting intents: [${this.supportedIntents.join(', ')}]`);
    return true;
  }

  /**
   * Returns all AI intents supported by this module plugin.
   * @returns {Array<string>} Array of uppercase intent strings
   */
  getSupportedIntents() {
    return this.supportedIntents;
  }

  /**
   * Delegates context building to the existing Context Builder engine.
   * Never duplicates business logic or queries MongoDB directly.
   *
   * @param {object} intentResult - Classified intent { intent, confidence, source }
   * @param {string} message - User query string
   * @param {object} user - Authenticated user context
   * @returns {Promise<object>} Built context payload
   */
  async buildContext(intentResult, message, user) {
    const start = Date.now();
    try {
      const payload = await contextBuilder.buildContext(intentResult, message, user);
      logDebug(`Plugin [${this.moduleName}] buildContext completed in ${Date.now() - start}ms`);
      return payload;
    } catch (err) {
      logWarn(`Plugin [${this.moduleName}] buildContext failed: ${err.message}`);
      return {
        intent: intentResult && intentResult.intent ? intentResult.intent : 'UNKNOWN',
        context: {},
        metadata: { recordsRetrieved: 0, buildTimeMs: Date.now() - start, timestamp: new Date().toISOString() },
      };
    }
  }

  /**
   * Delegates recommendation generation to the existing Recommendation Engine.
   *
   * @param {object} params - Parameters { contextPayload, message, user }
   * @returns {Array<object>} Advisory recommendations array
   */
  getRecommendations({ contextPayload, message, user }) {
    const start = Date.now();
    try {
      const recs = recommendationEngine.generateRecommendations({ contextPayload, message, user });
      logDebug(`Plugin [${this.moduleName}] getRecommendations completed in ${Date.now() - start}ms`);
      return recs;
    } catch (err) {
      logWarn(`Plugin [${this.moduleName}] getRecommendations failed: ${err.message}`);
      return [];
    }
  }

  /**
   * Delegates analytical insight generation to the existing Insight Engine.
   *
   * @param {object} params - Parameters { contextPayload, message, user }
   * @returns {Array<object>} Analytical insights array
   */
  getInsights({ contextPayload, message, user }) {
    const start = Date.now();
    try {
      const insights = insightEngine.generateInsights({ contextPayload, message, user });
      logDebug(`Plugin [${this.moduleName}] getInsights completed in ${Date.now() - start}ms`);
      return insights;
    } catch (err) {
      logWarn(`Plugin [${this.moduleName}] getInsights failed: ${err.message}`);
      return [];
    }
  }

  /**
   * Delegates structured action planning to the existing Action Planner.
   *
   * @param {object} params - Parameters { intent, contextPayload, history, user, message }
   * @returns {object} Structured action plan
   */
  getActions({ intent, contextPayload, history = [], user = {}, message = '' }) {
    const start = Date.now();
    try {
      const plan = actionPlanner.planAction({ intent, contextPayload, history, user, message });
      logDebug(`Plugin [${this.moduleName}] getActions completed in ${Date.now() - start}ms`);
      return plan;
    } catch (err) {
      logWarn(`Plugin [${this.moduleName}] getActions failed: ${err.message}`);
      return {
        actionType: 'UNKNOWN_ACTION',
        tool: null,
        requiredRole: null,
        parameters: {},
        confidence: 0.0,
        confirmationRequired: false,
        executionAllowed: false,
        status: 'UNSUPPORTED_ACTION',
        reason: err.message || 'Action planning failed via module plugin.',
      };
    }
  }

  /**
   * Returns standardized health status and metadata for this plugin.
   * @returns {object} Health status payload
   */
  health() {
    return {
      module: this.moduleName,
      supportedIntents: this.supportedIntents,
      health: 'HEALTHY',
      isHealthy: true,
      version: this.version,
      availableFeatures: this.availableFeatures,
    };
  }
}

module.exports = BasePlugin;
