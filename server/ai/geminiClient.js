/**
 * geminiClient.js
 * Initialized Gemini AI Client
 * Exposes a ready-to-use Gemini generative model instance.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3 (ai/ folder)
 *            AI_ENGINEERING_SPECIFICATION.md (AI Integration Architecture)
 *            API_SPECIFICATION.md Section 10 (AI Integration APIs)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 50)
 */

const { getGeminiClient } = require('../config/gemini');

/**
 * Get an initialized Gemini generative model.
 * Model selection: gemini-pro for text generation.
 * @returns {GenerativeModel}
 */
const getModel = () => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-2.0-flash' });
};

/**
 * Generate a response from the Gemini model.
 * @param {string} prompt - Fully-constructed prompt string
 * @returns {Promise<string>} AI-generated response text
 */
const generateResponse = async (prompt) => {
  // TODO: Implement in Phase 6A
  throw new Error('generateResponse: Not implemented. Implement in Phase 6A.');
};

module.exports = { getModel, generateResponse };
