/**
 * providerFactory.js — Phase 4: LLM Provider Abstraction
 * Factory responsible for selecting, initializing, and caching the active LLM provider.
 * Reads AI_PROVIDER from environment/config and returns a BaseProvider subclass instance.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 7
 */

const AppError = require('../../utils/AppError');
const { logInfo, logError, logWarn } = require('../../utils/loggerHelper');
const config = require('../../config/config');
const GeminiProvider = require('./geminiProvider');

let activeProviderInstance = null;

/**
 * Retrieves the currently configured LLM provider instance.
 * Instantiates and initializes the provider on first invocation.
 *
 * @returns {import('./baseProvider')} Active provider instance
 * @throws {AppError} If provider is unsupported or unimplemented
 */
const getProvider = () => {
  if (activeProviderInstance) {
    return activeProviderInstance;
  }

  const providerName = (config && config.ai && config.ai.provider ? config.ai.provider : (process.env.AI_PROVIDER || 'gemini')).toLowerCase().trim();

  const supportedProviders = ['gemini'];
  const futureProviders = ['github', 'openai', 'azure', 'claude'];

  logInfo(`Select AI Provider: ${providerName}`);

  if (futureProviders.includes(providerName)) {
    logWarn(`⚠️ Provider '${providerName}' is configured but not yet implemented.`);
    throw new AppError(501, `AI Provider '${providerName}' is architecturally defined but not yet implemented. Supported provider in Phase 4: gemini.`, 'AI_PROVIDER_NOT_IMPLEMENTED');
  }

  if (!supportedProviders.includes(providerName)) {
    logError(`❌ Unsupported AI Provider configured: '${providerName}'`);
    throw new AppError(500, `Unsupported AI Provider configured: '${providerName}'. Supported provider: gemini.`, 'AI_PROVIDER_UNSUPPORTED');
  }

  try {
    if (providerName === 'gemini') {
      activeProviderInstance = new GeminiProvider();
      try {
        activeProviderInstance.initialize();
        logInfo(`✅ AI Provider '${providerName}' initialized successfully.`);
      } catch (initErr) {
        logWarn(`⚠️ AI Provider '${providerName}' initialization failure: ${initErr.message}`);
      }
    }
  } catch (err) {
    logError(`❌ Failed to instantiate AI Provider '${providerName}': ${err.message}`);
    throw new AppError(500, `Failed to instantiate AI Provider '${providerName}': ${err.message}`, 'AI_PROVIDER_INIT_ERROR');
  }

  return activeProviderInstance;
};

/**
 * Resets the cached provider instance. Useful for testing or dynamic configuration reload.
 */
const resetProvider = () => {
  activeProviderInstance = null;
};

module.exports = {
  getProvider,
  resetProvider,
};
