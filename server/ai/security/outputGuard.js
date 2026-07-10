/**
 * outputGuard.js — Phase 12: AI Security & Governance
 * Authoritative Output Guard responsible for sanitizing all outgoing AI responses before reaching the client.
 * Removes API keys, JWTs, database connection secrets, internal stack traces, local file paths,
 * system prompt template leaks, and masks sensitive personal financial numbers (SSN, routing/account numbers).
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 12
 */

const { logDebug, logWarn } = require('../../utils/loggerHelper');

/**
 * Sanitizes a text string by removing API keys, JWTs, secrets, stack traces, paths, and prompt templates.
 *
 * @param {string} rawText - Raw response string
 * @returns {string} Sanitized text string safe for client transmission
 */
const sanitizeString = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return '';
  }

  let text = rawText;

  // 1. Remove API keys
  text = text.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]');
  text = text.replace(/sk-[a-zA-Z0-9-_]{20,}/g, '[REDACTED_API_KEY]');
  text = text.replace(/(api[_-]?key|secret|token|password)[\s]*[:=]+[\s]*([^\s,;'"{}()]+)/gi, '$1=[REDACTED_SECRET]');

  // 2. Remove JWT tokens
  text = text.replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[REDACTED_JWT_TOKEN]');

  // 3. Remove database connection strings and URIs containing passwords
  text = text.replace(/(mongodb(?:\+srv)?|postgres|mysql|redis|https?):\/\/[^:\s]+:[^@\s]+@[^\s,;'"{}()]+/gi, '$1://[REDACTED_DB_CREDENTIALS]');

  // 4. Remove internal stack traces
  text = text.replace(/\s+at\s+(async\s+)?([a-zA-Z0-9_.<>]+)\s+\([^\)]+\)/g, '');
  text = text.replace(/Error:\s+[^\n]+(\n\s+at\s+[^\n]+)+/g, '[REDACTED_STACK_TRACE]');

  // 5. Remove local filesystem paths (Windows and Unix absolute paths)
  text = text.replace(/[a-zA-Z]:\\[^:\s*?"<>|]+(\\[^:\s*?"<>|]+)+/g, '[REDACTED_FILE_PATH]');
  text = text.replace(/(\/(?:Users|home|var|etc|usr|opt|app|server)\/[^\s,;'"{}()]+)/g, '[REDACTED_FILE_PATH]');

  // 6. Remove prompt templates and internal instructions
  text = text.replace(/###\s+\d\.\s+(SYSTEM|DEVELOPER|SECURITY|RESPONSE STYLE|USER|BUSINESS CONTEXT|AI RECOMMENDATIONS|AI INSIGHTS|CONVERSATION HISTORY)[^\n]*/gi, '');
  text = text.replace(/<\/?(user_query|system_prompt|developer_prompt|security_prompt|conversation_history)>/gi, '');
  text = text.replace(/You are the Enterprise Workforce Management Platform \(EWMP\) AI Assistant\.[^\n]*/gi, '');
  text = text.replace(/Internal operational constraints:[^\n]*/gi, '');
  text = text.replace(/Mandatory security guardrails:[^\n]*/gi, '');

  // 7. Mask sensitive PII (Social Security Numbers / National IDs)
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX');

  // 8. Mask sensitive financial numbers (Bank Account / Routing / IBAN numbers when prefixed by keyword)
  text = text.replace(/(account|routing|iban|card|routing\s*number|account\s*number)[\s#:=-]*(is\s+|was\s+|:\s*|\s+)?(\d{8,18})/gi, '$1: [MASKED_FINANCIAL_NUMBER]');

  // Normalize formatting after stripping
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text || "I couldn't generate a meaningful response.";
};

/**
 * Recursively sanitizes an outgoing AI response object or string.
 *
 * @param {object|string|Array} payload - Response payload from Response Builder or error handler
 * @returns {object|string|Array} Cleaned payload safe for client delivery
 */
const sanitizeOutput = (payload) => {
  if (!payload) {
    return payload;
  }

  if (typeof payload === 'string') {
    return sanitizeString(payload);
  }

  if (Array.isArray(payload)) {
    return payload.map((item) => sanitizeOutput(item));
  }

  if (typeof payload === 'object') {
    const sanitized = { ...payload };

    if (typeof sanitized.response === 'string') {
      sanitized.response = sanitizeString(sanitized.response);
    }
    if (typeof sanitized.error === 'string') {
      sanitized.error = sanitizeString(sanitized.error);
    }
    if (typeof sanitized.message === 'string') {
      sanitized.message = sanitizeString(sanitized.message);
    }

    if (Array.isArray(sanitized.recommendations)) {
      sanitized.recommendations = sanitized.recommendations.map((rec) => {
        if (!rec || typeof rec !== 'object') return rec;
        return {
          ...rec,
          title: rec.title ? sanitizeString(rec.title) : rec.title,
          reason: rec.reason ? sanitizeString(rec.reason) : rec.reason,
          recommendedAction: rec.recommendedAction ? sanitizeString(rec.recommendedAction) : rec.recommendedAction,
        };
      });
    }

    if (Array.isArray(sanitized.insights)) {
      sanitized.insights = sanitized.insights.map((ins) => {
        if (!ins || typeof ins !== 'object') return ins;
        return {
          ...ins,
          title: ins.title ? sanitizeString(ins.title) : ins.title,
          summary: ins.summary ? sanitizeString(ins.summary) : ins.summary,
        };
      });
    }

    return sanitized;
  }

  return payload;
};

module.exports = {
  sanitizeString,
  sanitizeOutput,
};
