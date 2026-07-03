/**
 * contextBuilder.js
 * HR Context Assembler for AI Requests
 * Fetches and assembles relevant HR data scoped to the requesting user's
 * role and organizationId for inclusion in AI prompts.
 *
 * Authority: AI_ENGINEERING_SPECIFICATION.md (AI Context Architecture)
 *            API_SPECIFICATION.md Section 10 (AI Integration APIs)
 *            ARCHITECTURE_REVISION.md Section 7.3 (ai/ folder)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 50)
 */

/**
 * Build an HR context object for a given user and module.
 * Context is always scoped to the user's organizationId and role.
 * EMPLOYEE context contains only that employee's own data.
 * MANAGER context contains only their department's data.
 * HR_MANAGER context contains full organizational data.
 *
 * @param {object} user - Decoded JWT payload { userId, role, organizationId }
 * @param {string} moduleContext - Module scope ('Leave', 'Attendance', 'Payroll', 'General', etc.)
 * @returns {Promise<object>} Context object for prompt assembly
 *
 * TODO: Implement in Phase 6A after all HR module models are complete.
 *       Context must NEVER include passwordHash, refreshToken, or PAN/bank data.
 */
const buildContext = async (user, moduleContext) => {
  throw new Error('buildContext: Not implemented. Implement in Phase 6A.');
};

module.exports = { buildContext };
