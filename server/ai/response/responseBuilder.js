/**
 * responseBuilder.js — Phase 8/10/11: AI Response Builder
 * Centralized Response Builder responsible for formatting every AI response before returning to the client.
 * Normalizes LLM outputs, trims whitespace, sanitizes markdown formatting, strips secrets/prompts/stack traces,
 * handles empty/error fallbacks, attaches follow-up suggestions, and binds structured recommendations/insights arrays.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 10, 11 & 12
 */

const AppError = require('../../utils/AppError');
const { logInfo, logWarn, logError } = require('../../utils/loggerHelper');
const outputGuard = require('../security/outputGuard');

const FOLLOW_UP_SUGGESTIONS = {
  GENERAL_CHAT: [
    'How can you help me with my HR queries?',
    'Show my attendance summary for this week.',
    'What is my current annual leave balance?',
  ],
  ATTENDANCE_QUERY: [
    'Request an attendance correction.',
    'View my attendance log for the last 30 days.',
    'Check my overtime working hours.',
  ],
  LEAVE_QUERY: [
    'Apply for annual leave.',
    'Check company holiday calendar.',
    'View status of my pending leave requests.',
  ],
  EMPLOYEE_QUERY: [
    'View employee directory.',
    'Check my reporting manager profile.',
    'Update my emergency contact details.',
  ],
  PAYROLL_QUERY: [
    'Download my salary slip for last month.',
    'View tax deduction (TDS) breakdown.',
    'Check reimbursement expense status.',
  ],
  PROJECT_QUERY: [
    'View my active project allocations.',
    'Check upcoming client project milestones.',
    'Review project team members.',
  ],
  TASK_QUERY: [
    'View my pending sprint tasks.',
    'Update assigned task status.',
    'Check task due dates for this week.',
  ],
  PERFORMANCE_QUERY: [
    'View my KPI appraisal scorecard.',
    'Submit self-assessment review.',
    'Check upcoming review cycle timeline.',
  ],
  RECRUITMENT_QUERY: [
    'View open job postings and vacancies.',
    'Check candidate interview pipeline.',
    'Submit interview evaluation feedback.',
  ],
  SUMMARY_REQUEST: [
    'Export this summary as a downloadable report.',
    'Share summary overview with department manager.',
  ],
  REPORT_QUERY: [
    'Download executive analytics dashboard.',
    'Export monthly headcount metrics.',
    'View department turnover trends.',
  ],
  RECOMMENDATION_REQUEST: [
    'Filter recommendations by high priority items.',
    'View attendance absenteeism risk alerts.',
    'Check pending promotion candidate reviews.',
  ],
  INSIGHT_REQUEST: [
    'View attendance percentage trend charts.',
    'Check quarterly payroll expenditure growth.',
    'Export executive headcount retention analytics.',
  ],
  UNKNOWN: [
    'Try asking about attendance, leave, or payroll.',
    'Type "help" to explore supported HR capabilities.',
    'Contact IT or HR helpdesk support for assistance.',
  ],
};

/**
 * Normalizes provider outputs, cleans markdown formatting, and strips security risks.
 *
 * @param {string} rawText - Raw string returned by LLM provider
 * @returns {string} Cleaned, safe response string
 */
const normalizeResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    return "I couldn't generate a meaningful response.";
  }

  let text = rawText.trim();

  // Strip internal prompt leaks (e.g. ### 1. SYSTEM PROMPT, <user_query>, etc.)
  text = text.replace(/###\s+\d\.\s+(SYSTEM|DEVELOPER|SECURITY|RESPONSE STYLE|USER|BUSINESS CONTEXT)[^\n]*/gi, '');
  text = text.replace(/<\/?(user_query|system_prompt|developer_prompt|security_prompt)>/gi, '');

  // Strip API keys and secrets (e.g., API_KEY="secret_val" or key: val)
  text = text.replace(/(api[_-]?key|secret|token|password)[\s]*[:=]+[\s]*([^\s,;'"{}()]+)/gi, '$1=[REDACTED_SECRET]');
  text = text.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]');

  // Strip stack traces and provider internals
  text = text.replace(/\s+at\s+(async\s+)?([a-zA-Z0-9_.<>]+)\s+\([^\)]+\)/g, '');

  // Normalize markdown blank lines and whitespace
  text = text.replace(/\r\n/g, '\n');
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  if (!text) {
    return "I couldn't generate a meaningful response.";
  }

  return text;
};

/**
 * Formats standard AI response payload.
 *
 * @param {object} params - Response parameters
 * @param {string} params.rawResponse - Raw LLM provider output
 * @param {string} params.intent - Classified intent category
 * @param {number} params.confidence - Intent detection confidence (0.0 to 1.0)
 * @param {string} params.provider - AI provider name (e.g., 'gemini')
 * @param {object} [params.contextMetadata] - Metadata from Context Builder
 * @param {number|string} [params.latencyMs] - Execution latency in milliseconds
 * @param {number|null} [params.tokensUsed] - Token usage count if available
 * @param {Array<object>|null} [params.recommendations] - Advisory recommendations array from Recommendation Engine
 * @param {Array<object>|null} [params.insights] - Analytical insights array from Insight Engine
 * @returns {object} Standardized AI response payload
 */
const buildResponse = ({
  rawResponse,
  intent,
  confidence,
  provider,
  contextMetadata,
  latencyMs,
  tokensUsed = null,
  recommendations = null,
  insights = null,
  actionPlan = null,
  workflowPlan = null,
}) => {
  const normalizedIntent = (intent && typeof intent === 'string') ? intent.toUpperCase() : 'UNKNOWN';
  const cleanResponse = normalizeResponse(rawResponse);
  const providerName = (provider && typeof provider === 'string') ? provider : 'gemini';
  const confScore = (typeof confidence === 'number' && !isNaN(confidence)) ? Number(confidence.toFixed(2)) : 1.00;

  const contextUsed = Boolean(
    contextMetadata &&
    typeof contextMetadata === 'object' &&
    typeof contextMetadata.recordsRetrieved === 'number' &&
    contextMetadata.recordsRetrieved > 0
  );

  const followUpSuggestions = FOLLOW_UP_SUGGESTIONS[normalizedIntent] || FOLLOW_UP_SUGGESTIONS.UNKNOWN;
  const formattedLatency = typeof latencyMs === 'number' ? `${latencyMs}ms` : (latencyMs || '0ms');

  logInfo('AI Response Built', {
    intent: normalizedIntent,
    provider: providerName,
    latency: formattedLatency,
    responseLength: cleanResponse.length,
    isFallback: cleanResponse === "I couldn't generate a meaningful response.",
    hasRecommendations: Array.isArray(recommendations) && recommendations.length > 0,
    hasInsights: Array.isArray(insights) && insights.length > 0,
    hasActionPlan: Boolean(actionPlan),
    hasWorkflowPlan: Boolean(workflowPlan),
  });

  const payload = {
    intent: normalizedIntent,
    confidence: confScore,
    provider: providerName,
    response: cleanResponse,
    contextUsed,
    followUpSuggestions,
    metadata: {
      generatedAt: new Date().toISOString(),
      latency: formattedLatency,
      tokensUsed: typeof tokensUsed === 'number' ? tokensUsed : null,
    },
  };

  if (Array.isArray(recommendations)) {
    payload.recommendations = recommendations;
  }

  if (Array.isArray(insights)) {
    payload.insights = insights;
  }

  if (actionPlan && typeof actionPlan === 'object') {
    payload.actionPlan = actionPlan;
  }

  if (workflowPlan && typeof workflowPlan === 'object') {
    payload.workflowPlan = workflowPlan;
  }

  return outputGuard.sanitizeOutput(payload);
};

/**
 * Formats structured error response when AI provider execution fails.
 *
 * @param {object} params - Error response parameters
 * @param {Error|string} params.error - Provider error object or message string
 * @param {string} [params.intent] - Classified intent category
 * @param {number} [params.confidence] - Intent detection confidence
 * @param {string} [params.provider] - AI provider name
 * @param {object} [params.contextMetadata] - Metadata from Context Builder
 * @param {number|string} [params.latencyMs] - Execution latency in milliseconds
 * @param {Array<object>|null} [params.recommendations] - Advisory recommendations array if already generated
 * @param {Array<object>|null} [params.insights] - Analytical insights array if already generated
 * @returns {object} Standardized AI error fallback payload
 */
const buildErrorResponse = ({
  error,
  intent,
  confidence,
  provider,
  contextMetadata,
  latencyMs,
  recommendations = null,
  insights = null,
}) => {
  const normalizedIntent = (intent && typeof intent === 'string') ? intent.toUpperCase() : 'UNKNOWN';
  const providerName = (provider && typeof provider === 'string') ? provider : 'gemini';
  const confScore = (typeof confidence === 'number' && !isNaN(confidence)) ? Number(confidence.toFixed(2)) : 0.00;

  let errorMessage = 'AI Provider execution failure.';
  if (error && typeof error === 'string') {
    errorMessage = error;
  } else if (error && error.message) {
    errorMessage = error.message;
  }

  // Strip stack traces and secrets from error message
  errorMessage = errorMessage.replace(/\s+at\s+(async\s+)?([a-zA-Z0-9_.<>]+)\s+\([^\)]+\)/g, '');
  errorMessage = errorMessage.replace(/(api[_-]?key|secret|token|password)[\s]*[:=]+[\s]*([^\s,;'"{}()]+)/gi, '$1=[REDACTED_SECRET]');
  errorMessage = errorMessage.trim();

  const fallbackResponse = `I encountered an issue while communicating with the AI provider (${errorMessage}). Please try again shortly.`;
  const formattedLatency = typeof latencyMs === 'number' ? `${latencyMs}ms` : (latencyMs || '0ms');

  const contextUsed = Boolean(
    contextMetadata &&
    typeof contextMetadata === 'object' &&
    typeof contextMetadata.recordsRetrieved === 'number' &&
    contextMetadata.recordsRetrieved > 0
  );

  logInfo('AI Response Built (Provider Error Fallback)', {
    intent: normalizedIntent,
    provider: providerName,
    latency: formattedLatency,
    responseLength: fallbackResponse.length,
    error: errorMessage,
    hasRecommendations: Array.isArray(recommendations) && recommendations.length > 0,
    hasInsights: Array.isArray(insights) && insights.length > 0,
  });

  const payload = {
    intent: normalizedIntent,
    confidence: confScore,
    provider: providerName,
    response: fallbackResponse,
    error: errorMessage,
    contextUsed,
    followUpSuggestions: [
      'Check system network connectivity and health status.',
      'Try submitting your query again in a few moments.',
      'Contact IT helpdesk if the service outage persists.',
    ],
    metadata: {
      generatedAt: new Date().toISOString(),
      latency: formattedLatency,
      tokensUsed: null,
    },
  };

  if (Array.isArray(recommendations)) {
    payload.recommendations = recommendations;
  }

  if (Array.isArray(insights)) {
    payload.insights = insights;
  }

  return outputGuard.sanitizeOutput(payload);
};

module.exports = {
  FOLLOW_UP_SUGGESTIONS,
  normalizeResponse,
  buildResponse,
  buildErrorResponse,
};
