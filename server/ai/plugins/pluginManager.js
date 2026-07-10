/**
 * pluginManager.js — Phase 15: AI Module Plugin Framework
 * Centralized AI Plugin Manager responsible for registering, loading, validating, and monitoring
 * business module plugins. Connects the AI Service Router to module plugins without hardcoding
 * implementation details, enforcing standardized delegation to core AI engines.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 15
 */

const { logInfo, logWarn, logDebug } = require('../../utils/loggerHelper');

const registeredPlugins = new Map();
const intentToPluginMap = new Map();
let isDefaultLoaded = false;

/**
 * Validates that an object implements the required standardized AI Plugin interface.
 *
 * @param {object} plugin - Candidate plugin object
 * @returns {boolean} True if valid
 * @throws {Error} Throws if mandatory methods or properties are missing
 */
const validatePlugin = (plugin) => {
  if (!plugin || typeof plugin !== 'object') {
    throw new Error('Plugin validation failed: invalid plugin instance.');
  }
  if (!plugin.moduleName || typeof plugin.moduleName !== 'string') {
    throw new Error('Plugin validation failed: missing moduleName.');
  }
  const requiredMethods = ['initialize', 'getSupportedIntents', 'buildContext', 'getRecommendations', 'getInsights', 'getActions', 'health'];
  for (const method of requiredMethods) {
    if (typeof plugin[method] !== 'function') {
      throw new Error(`Plugin validation failed for '${plugin.moduleName}': missing required method '${method}()'.`);
    }
  }
  return true;
};

/**
 * Registers and initializes a business module plugin in the framework.
 *
 * @param {object} plugin - Plugin instance extending BasePlugin
 * @returns {boolean} True if successfully registered
 */
const registerPlugin = (plugin) => {
  const start = Date.now();
  try {
    validatePlugin(plugin);
    plugin.initialize();

    const moduleKey = plugin.moduleName.toUpperCase();
    registeredPlugins.set(moduleKey, plugin);

    const intents = plugin.getSupportedIntents();
    if (Array.isArray(intents)) {
      for (const intent of intents) {
        intentToPluginMap.set(intent.toUpperCase(), plugin);
      }
    }

    const latencyMs = Date.now() - start;
    logInfo('AI Plugin Loaded', {
      module: moduleKey,
      version: plugin.version || '1.0.0',
      supportedIntents: intents,
      latencyMs: `${latencyMs}ms`,
    });
    return true;
  } catch (err) {
    logWarn(`🚨 AI Plugin Failed to load: ${err.message}`);
    return false;
  }
};

/**
 * Loads all 12 core EWMP enterprise module plugins into the registry.
 */
const loadDefaultPlugins = () => {
  if (isDefaultLoaded) return;
  const start = Date.now();

  const attendancePlugin = require('./attendancePlugin');
  const leavePlugin = require('./leavePlugin');
  const payrollPlugin = require('./payrollPlugin');
  const employeePlugin = require('./employeePlugin');
  const performancePlugin = require('./performancePlugin');
  const projectPlugin = require('./projectPlugin');
  const taskPlugin = require('./taskPlugin');
  const recruitmentPlugin = require('./recruitmentPlugin');
  const assetPlugin = require('./assetPlugin');
  const documentPlugin = require('./documentPlugin');
  const notificationPlugin = require('./notificationPlugin');
  const helpdeskPlugin = require('./helpDeskPlugin');

  const defaults = [
    attendancePlugin, leavePlugin, payrollPlugin, employeePlugin,
    performancePlugin, projectPlugin, taskPlugin, recruitmentPlugin,
    assetPlugin, documentPlugin, notificationPlugin, helpdeskPlugin,
  ];

  for (const p of defaults) {
    registerPlugin(p);
  }

  isDefaultLoaded = true;
  logDebug(`Plugin Manager: Loaded ${registeredPlugins.size} core module plugins in ${Date.now() - start}ms.`);
};

/**
 * Retrieves the responsible plugin for a given classified intent.
 *
 * @param {string} intent - Uppercase intent classification string
 * @returns {object|null} Responsible plugin instance or null
 */
const getPluginByIntent = (intent) => {
  if (!isDefaultLoaded) loadDefaultPlugins();
  if (!intent || typeof intent !== 'string') return null;
  return intentToPluginMap.get(intent.trim().toUpperCase()) || null;
};

/**
 * Retrieves a registered plugin by exact module name.
 *
 * @param {string} moduleName - Module identifier (e.g. 'ATTENDANCE')
 * @returns {object|null} Plugin instance or null
 */
const getPluginByName = (moduleName) => {
  if (!isDefaultLoaded) loadDefaultPlugins();
  if (!moduleName || typeof moduleName !== 'string') return null;
  return registeredPlugins.get(moduleName.trim().toUpperCase()) || null;
};

/**
 * Returns metadata and capabilities for all registered plugins.
 *
 * @returns {Array<object>} Array of plugin metadata objects
 */
const getAllPlugins = () => {
  if (!isDefaultLoaded) loadDefaultPlugins();
  return Array.from(registeredPlugins.values()).map(p => p.health());
};

/**
 * Returns aggregated health status and operational metrics across all loaded plugins.
 *
 * @returns {object} Aggregated plugin health report
 */
const getHealth = () => {
  if (!isDefaultLoaded) loadDefaultPlugins();
  const pluginsList = Array.from(registeredPlugins.values()).map(p => p.health());
  const allHealthy = pluginsList.every(p => p.isHealthy);

  return {
    status: allHealthy ? 'HEALTHY' : 'DEGRADED',
    pluginCount: registeredPlugins.size,
    loadedPlugins: Array.from(registeredPlugins.keys()),
    plugins: pluginsList,
  };
};

// Auto-load defaults on require
loadDefaultPlugins();

module.exports = {
  validatePlugin,
  registerPlugin,
  loadDefaultPlugins,
  getPluginByIntent,
  getPluginByName,
  getAllPlugins,
  getHealth,
};
