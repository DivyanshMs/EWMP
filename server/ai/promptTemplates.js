/**
 * promptTemplates.js
 * Role-Aware AI Prompt Builders
 * Constructs structured prompts for the Gemini AI model
 * based on user role, module context, and HR data.
 *
 * Authority: AI_ENGINEERING_SPECIFICATION.md (Prompt Engineering)
 *            API_SPECIFICATION.md Section 10 (AI Integration APIs)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 50)
 */

/**
 * Build a system prompt defining the AI assistant's persona and constraints.
 * @param {string} role - User's EWMP role (e.g. 'HR_MANAGER')
 * @param {object} context - HR context data assembled by contextBuilder
 * @returns {string} System prompt string
 *
 * TODO: Implement in Phase 6A. Prompts must be role-scoped — EMPLOYEE
 *       prompts must never include other employees' private data.
 */
const buildSystemPrompt = (role, context) => {
  throw new Error('buildSystemPrompt: Not implemented. Implement in Phase 6A.');
};

/**
 * Build a user query prompt combining the user message with context.
 * @param {string} userMessage - The user's raw query
 * @param {string} moduleContext - Module scope (e.g. 'Leave', 'Attendance')
 * @param {object} context - HR context data
 * @returns {string} Complete prompt string
 *
 * TODO: Implement in Phase 6A.
 */
const buildQueryPrompt = (userMessage, moduleContext, context) => {
  throw new Error('buildQueryPrompt: Not implemented. Implement in Phase 6A.');
};

module.exports = { buildSystemPrompt, buildQueryPrompt };
