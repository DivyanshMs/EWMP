/**
 * promptInjectionDetector.js — Phase 12: AI Security & Governance
 * Specialized detector for prompt injections, jailbreak attempts, system instruction overrides,
 * developer impersonation, and security disable commands.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 12
 */

const INJECTION_PATTERNS = [
  {
    regex: /ignore\s+(all\s+|previous\s+|the\s+)?(instructions|rules|prompts|system\s+prompt|context)/i,
    threatType: 'PROMPT_INJECTION',
    reason: 'Detected instruction override attempt ("ignore previous instructions").',
  },
  {
    regex: /forget\s+(all\s+|previous\s+|the\s+)?(instructions|rules|prompts|system\s+prompt|context)/i,
    threatType: 'PROMPT_INJECTION',
    reason: 'Detected memory/instruction wipe attempt ("forget previous instructions").',
  },
  {
    regex: /override\s+(all\s+|previous\s+|the\s+)?(instructions|rules|prompts|system|security|rbac)/i,
    threatType: 'PROMPT_INJECTION',
    reason: 'Detected system override attempt.',
  },
  {
    regex: /(reveal|show|display|dump|output|print)\s+(your\s+|the\s+)?(system\s+)?(prompt|instructions|rules|secrets|config|architecture)/i,
    threatType: 'SYSTEM_PROMPT_LEAK',
    reason: 'Detected attempt to reveal internal system prompts or developer instructions.',
  },
  {
    regex: /(reveal|show|display|dump|output|print)\s+(your\s+|the\s+)?(api\s*key|secret|jwt|token|password|credentials|database\s*url)/i,
    threatType: 'CREDENTIAL_LEAK_ATTEMPT',
    reason: 'Detected attempt to extract API keys or system credentials.',
  },
  {
    regex: /(disable|turn\s+off|bypass|remove|ignore)\s+(all\s+)?(security|rbac|guardrails|filters|auth|permissions)/i,
    threatType: 'SECURITY_BYPASS_ATTEMPT',
    reason: 'Detected attempt to disable or bypass security guardrails and RBAC validation.',
  },
  {
    regex: /act\s+as\s+(system|admin|root|unrestricted|jailbroken|unbound|dan)/i,
    threatType: 'JAILBREAK_ATTEMPT',
    reason: 'Detected jailbreak attempt ("act as system/admin/DAN").',
  },
  {
    regex: /pretend\s+to\s+be\s+(a\s+)?(developer|admin|system|root|unbound|unrestricted)/i,
    threatType: 'IMPERSONATION_ATTEMPT',
    reason: 'Detected developer/system impersonation attempt ("pretend to be developer").',
  },
  {
    regex: /you\s+are\s+now\s+(in\s+)?(developer\s+mode|unrestricted|unbound|jailbroken|admin|dan)/i,
    threatType: 'JAILBREAK_ATTEMPT',
    reason: 'Detected jailbreak mode activation attempt ("developer mode").',
  },
  {
    regex: /do\s+anything\s+now|DAN\s+mode/i,
    threatType: 'JAILBREAK_ATTEMPT',
    reason: 'Detected DAN (Do Anything Now) jailbreak signature.',
  },
  {
    regex: /\[system\]|\[developer\]|\[admin\]|system:\s*you\s+are/i,
    threatType: 'PROMPT_INJECTION',
    reason: 'Detected fake system role markup injection.',
  },
];

/**
 * Scans untrusted input for prompt injection and jailbreak signatures.
 *
 * @param {string} message - Untrusted input string
 * @returns {object} Detection result { isInjection, threatType, reason }
 */
const detectInjection = (message) => {
  if (!message || typeof message !== 'string') {
    return { isInjection: false, threatType: null, reason: null };
  }

  const cleanText = message.trim();

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.regex.test(cleanText)) {
      return {
        isInjection: true,
        threatType: pattern.threatType,
        reason: pattern.reason,
      };
    }
  }

  return { isInjection: false, threatType: null, reason: null };
};

module.exports = {
  INJECTION_PATTERNS,
  detectInjection,
};
