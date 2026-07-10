/**
 * baseProvider.js — Phase 4: LLM Provider Abstraction
 * Common interface and base class for all AI LLM providers.
 * Enforces implementation of initialize(), chat(), summarize(), and health().
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 7
 */

class BaseProvider {
  /**
   * @param {string} name - Identifier for the LLM provider (e.g. 'gemini', 'openai')
   */
  constructor(name) {
    if (this.constructor === BaseProvider) {
      throw new Error('Abstract class BaseProvider cannot be instantiated directly.');
    }
    this.name = name || 'UnknownProvider';
  }

  /**
   * Initializes the LLM client SDK and validates required credentials.
   * @throws {Error|AppError} if initialization or credential validation fails
   */
  initialize() {
    throw new Error(`Method initialize() must be implemented by provider: ${this.name}`);
  }

  /**
   * Generates a conversational chat response from a structured prompt.
   * @param {string} prompt - Fully formatted prompt string
   * @returns {Promise<string>} Generated text completion
   */
  async chat(prompt) {
    throw new Error(`Method chat(prompt) must be implemented by provider: ${this.name}`);
  }

  /**
   * Generates a summary completion from a structured prompt.
   * @param {string} prompt - Fully formatted prompt string
   * @returns {Promise<string>} Generated summary text
   */
  async summarize(prompt) {
    throw new Error(`Method summarize(prompt) must be implemented by provider: ${this.name}`);
  }

  /**
   * Returns provider health status without throwing exceptions when offline.
   * @returns {object} Provider health object containing provider name, model, and connection status
   */
  health() {
    throw new Error(`Method health() must be implemented by provider: ${this.name}`);
  }
}

module.exports = BaseProvider;
