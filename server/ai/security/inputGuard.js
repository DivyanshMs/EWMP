/**
 * inputGuard.js — Phase 12: AI Security & Governance
 * Authoritative Input Guard responsible for validating message length, removing dangerous control sequences,
 * detecting prompt injections and jailbreak attempts, enforcing RBAC authorization, and verifying multi-tenant
 * organizationId and employee ownership boundaries.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 12
 */

const { detectInjection } = require('./promptInjectionDetector');
const AppError = require('../../utils/AppError');
const { logWarn, logInfo, logDebug } = require('../../utils/loggerHelper');

const MAX_MESSAGE_LENGTH = 10000;

const LEADERSHIP_ROLES = [
  'SUPER_ADMIN',
  'ORG_ADMIN',
  'HR_MANAGER',
  'MANAGER',
  'FINANCE',
  'TEAM_LEAD',
  'AUDITOR',
];

/**
 * Strips dangerous ASCII control sequences and null bytes from input string.
 *
 * @param {string} text - Raw input string
 * @returns {string} Sanitized text free of control sequences
 */
const removeControlSequences = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  // Remove ASCII control characters (0-8, 11-12, 14-31, 127) and null bytes
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

/**
 * Validates RBAC authorization and employee ownership rules for the requested query.
 *
 * @param {string} message - Sanitized user message
 * @param {object} user - Authenticated user object { userId, organizationId, role, employeeId }
 * @throws {AppError} Throws 403 error if RBAC or ownership boundary is breached
 */
const validateRbacAndOwnership = (message, user = {}) => {
  if (!user || (!user.userId && !user.id)) {
    throw new AppError(401, 'Authentication required for AI Service access.', 'UNAUTHORIZED_AI_ACCESS');
  }

  if (!user.organizationId) {
    throw new AppError(403, 'Multi-tenant organization boundary required: missing organizationId.', 'TENANT_ISOLATION_VIOLATION');
  }

  const role = user.role || 'EMPLOYEE';
  const queryText = message.toLowerCase();

  // Enforce Employee Ownership: Standard employees cannot query enterprise-wide salaries, bank details, or other employees' private records
  if (!LEADERSHIP_ROLES.includes(role)) {
    const unauthorizedPayrollQueries = [
      /(show|view|get|dump|print|list|export)\s+(all|everyone'?s?|company|department|colleague'?s?|other|another|employee'?s?|staff|manager'?s?|ceo'?s?)\s+.*?(salaries|salary|payroll|pay|compensation|bonus|bonuses|bank|routing|tax|ssn)/i,
      /(what\s+is|show\s+me|tell\s+me)\s+(the\s+)?(ceo'?s?|manager'?s?|admin'?s?|everyone'?s?|colleague'?s?|other|another|employee'?s?)\s+.*?(salary|pay|bonus|bank|compensation)/i,
      /dump\s+.*?(tax|bank|ssn|salary|salaries|payroll|compensation)\s+(records|data|details|files)/i,
      /(get|show|view|fetch)\s+.*?(salary|pay|bank|routing|tax|ssn)\s+of\s+.*?(employee|user|staff|manager|colleague|ceo)/i,
    ];

    for (const pattern of unauthorizedPayrollQueries) {
      if (pattern.test(queryText)) {
        throw new AppError(
          403,
          'RBAC Violation: You do not have permission to view other employees\' payroll or sensitive financial records.',
          'RBAC_VIOLATION'
        );
      }
    }
  }
};

/**
 * authoritatively inspects and sanitizes every incoming AI request.
 *
 * @param {object} params - Guard parameters
 * @param {string} params.message - Raw user input query
 * @param {object} params.user - Authenticated user context
 * @returns {object} Validated and sanitized payload { sanitizedMessage, isValid: true }
 * @throws {AppError} Throws 400 or 403 on validation failure, injection, or RBAC breach
 */
const validateInput = ({ message, user = {} }) => {
  const start = Date.now();

  // 1. Validate message presence and type
  if (!message || typeof message !== 'string' || !message.trim()) {
    const latencyMs = Date.now() - start;
    logWarn('🚨 AI Security Layer: Blocked empty or non-string request', {
      threatType: 'INVALID_INPUT_FORMAT',
      blockedRequest: true,
      reason: 'Message must be a non-empty string.',
      latency: `${latencyMs}ms`,
    });
    throw new AppError(400, 'A non-empty message string is required.', 'INVALID_PROMPT_MESSAGE');
  }

  // 2. Validate message length
  if (message.length > MAX_MESSAGE_LENGTH) {
    const latencyMs = Date.now() - start;
    logWarn('🚨 AI Security Layer: Blocked oversized input request', {
      threatType: 'INPUT_TOO_LARGE',
      blockedRequest: true,
      reason: `Message length (${message.length}) exceeds maximum allowed limit of ${MAX_MESSAGE_LENGTH} characters.`,
      latency: `${latencyMs}ms`,
    });
    throw new AppError(
      400,
      `User message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
      'MESSAGE_TOO_LONG'
    );
  }

  // 3. Remove dangerous control sequences
  const sanitizedMessage = removeControlSequences(message).trim();

  // 4. Validate RBAC and employee ownership boundaries
  try {
    validateRbacAndOwnership(sanitizedMessage, user);
  } catch (rbacError) {
    const latencyMs = Date.now() - start;
    logWarn('🚨 AI Security Layer: Blocked request due to RBAC or ownership breach', {
      threatType: rbacError.errorCode || 'RBAC_VIOLATION',
      blockedRequest: true,
      reason: rbacError.message,
      latency: `${latencyMs}ms`,
    });
    throw rbacError;
  }

  // 5. Scan for prompt injection, jailbreaks, and system override attempts
  const injectionCheck = detectInjection(sanitizedMessage);
  if (injectionCheck.isInjection) {
    const latencyMs = Date.now() - start;
    // Log required threat metrics WITHOUT logging message contents
    logWarn('🚨 AI Security Layer: Blocked malicious prompt injection request', {
      threatType: injectionCheck.threatType,
      blockedRequest: true,
      reason: injectionCheck.reason,
      latency: `${latencyMs}ms`,
    });
    throw new AppError(
      403,
      `AI Security Violation: ${injectionCheck.reason}`,
      injectionCheck.threatType
    );
  }

  const latencyMs = Date.now() - start;
  logDebug(`AI Security Layer: Input validated successfully in ${latencyMs}ms.`);

  return {
    sanitizedMessage,
    isValid: true,
  };
};

module.exports = {
  MAX_MESSAGE_LENGTH,
  removeControlSequences,
  validateRbacAndOwnership,
  validateInput,
};
