/**
 * gemini.js
 * Google Gemini AI SDK Configuration
 * Initializes the Gemini client for AI Operations Assistant.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            AI_ENGINEERING_SPECIFICATION.md (AI Integration)
 *            API_SPECIFICATION.md Section 10 (AI Integration APIs)
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');
const { logInfo, logWarn } = require('../utils/loggerHelper');

let geminiClient = null;

const configureGemini = () => {
  try {
    if (!config.gemini.apiKey) {
      logWarn('⚠️  GEMINI_API_KEY is not configured. AI features will be unavailable.');
      return;
    }
    geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
    logInfo('✅ Google Gemini AI configured');
  } catch (error) {
    logWarn(`⚠️  Gemini AI configuration failed: ${error.message}`);
    logWarn('   AI features will be unavailable until resolved.');
  }
};

/**
 * Returns the initialized Gemini client.
 * AI routes must call this getter — not access the module variable directly.
 */
const getGeminiClient = () => {
  if (!geminiClient) {
    throw new Error('Gemini client is not initialized. Call configureGemini() first.');
  }
  return geminiClient;
};

module.exports = { configureGemini, getGeminiClient };
