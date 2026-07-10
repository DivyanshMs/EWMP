/**
 * memoryManager.js — Phase 9: Conversation Memory Manager
 * Manages conversational memory lifecycle, history retrieval, follow-up intent inheritance,
 * history truncation for prompt injection, and exchange persistence.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 11
 */

const conversationMemory = require('./conversationMemory');
const AppError = require('../../utils/AppError');
const { logInfo, logWarn, logDebug } = require('../../utils/loggerHelper');

/**
 * Prepares conversational context by retrieving existing history or initializing a new session.
 *
 * @param {object} params - Request parameters { conversationId, message }
 * @param {object} reqUser - Authenticated user object from authMiddleware { userId, organizationId, role }
 * @returns {object} { conversationId, history, lastIntent, historyLength }
 */
const prepareConversation = (params = {}, reqUser = {}) => {
  const start = Date.now();
  const userId = reqUser.userId || reqUser._id || 'anonymous';
  const organizationId = reqUser.organizationId || 'default';
  const requestedId = params.conversationId || null;

  let conversation = null;
  if (requestedId) {
    conversation = conversationMemory.retrieveConversation(requestedId, userId, organizationId);
  }

  if (!conversation) {
    conversation = conversationMemory.createConversation({
      conversationId: requestedId,
      userId,
      organizationId,
    });
  }

  const retrievalTimeMs = Date.now() - start;
  const historySize = conversation.exchanges.length;
  const lastIntent = historySize > 0 ? conversation.exchanges[historySize - 1].intent : null;

  // Log required observability metrics WITHOUT logging message contents
  logInfo('Conversation Memory Retrieved', {
    conversationId: conversation.conversationId,
    historySize,
    retrievalTimeMs,
  });

  return {
    conversationId: conversation.conversationId,
    history: conversation.exchanges,
    lastIntent,
    historyLength: historySize,
  };
};

/**
 * Resolves follow-up query intents by inheriting the previous conversation exchange intent
 * when the current message is classified as UNKNOWN or low-confidence GENERAL_CHAT.
 *
 * @param {object} currentIntentResult - Result from Intent Engine { intent, confidence, source }
 * @param {string|null} lastIntent - Intent from the last conversational exchange
 * @returns {object} Resolved intent result { intent, confidence, source, isFollowUp }
 */
const resolveFollowUpIntent = (currentIntentResult, lastIntent) => {
  if (!currentIntentResult || !lastIntent) {
    return currentIntentResult || { intent: 'UNKNOWN', confidence: 1.0, source: 'ROUTER' };
  }

  const current = currentIntentResult.intent ? currentIntentResult.intent.toUpperCase() : 'UNKNOWN';
  const domainIntents = [
    'ATTENDANCE_QUERY',
    'LEAVE_QUERY',
    'EMPLOYEE_QUERY',
    'PAYROLL_QUERY',
    'PROJECT_QUERY',
    'TASK_QUERY',
    'PERFORMANCE_QUERY',
    'RECRUITMENT_QUERY',
    'DOCUMENT_QUERY',
    'ASSET_QUERY',
    'HELPDESK_QUERY',
    'REPORT_QUERY',
  ];

  // If current query is ambiguous (UNKNOWN or low-confidence GENERAL_CHAT) and last exchange was a domain query
  if ((current === 'UNKNOWN' || (current === 'GENERAL_CHAT' && currentIntentResult.confidence < 0.85)) && domainIntents.includes(lastIntent)) {
    logDebug(`Follow-up detected: Inheriting domain intent '${lastIntent}' for ambiguous query.`);
    return {
      intent: lastIntent,
      confidence: 0.90,
      source: 'MEMORY_FOLLOW_UP',
      isFollowUp: true,
    };
  }

  return currentIntentResult;
};

/**
 * Enriches the prompt context payload with recent conversation exchanges.
 * Limits history size to the latest 5 exchanges (~1500 tokens max) to prevent excessive token consumption.
 *
 * @param {object|null} contextPayload - Verified context from Context Builder
 * @param {Array<object>} history - Full conversation history array
 * @returns {object} Enriched context payload with history attached
 */
const enrichPromptContext = (contextPayload = null, history = []) => {
  const payload = contextPayload ? { ...contextPayload } : { context: {}, metadata: {} };

  if (Array.isArray(history) && history.length > 0) {
    // Limit history size to avoid excessive token usage
    const recentHistory = history.slice(-5).map((ex) => ({
      userMessage: ex.userMessage,
      assistantResponse: ex.assistantResponse,
      intent: ex.intent,
    }));
    payload.history = recentHistory;
  } else {
    payload.history = [];
  }

  return payload;
};

/**
 * Saves a completed user/assistant exchange to the conversation store.
 *
 * @param {object} params - Exchange parameters
 * @param {string} params.conversationId - Conversation ID
 * @param {object} params.reqUser - Authenticated user object
 * @param {string} params.userMessage - User input query
 * @param {string} params.assistantResponse - Standardized AI output string
 * @param {string} params.intent - Classified intent
 * @returns {object} { conversationId, historyLength }
 */
const saveExchange = ({ conversationId, reqUser = {}, userMessage, assistantResponse, intent }) => {
  const userId = reqUser.userId || reqUser._id || 'anonymous';
  const organizationId = reqUser.organizationId || 'default';

  const updatedConv = conversationMemory.appendMessage({
    conversationId,
    userId,
    organizationId,
    userMessage,
    assistantResponse,
    intent,
  });

  return {
    conversationId: updatedConv.conversationId,
    historyLength: updatedConv.exchanges.length,
  };
};

/**
 * Retrieves summary list of conversations for a user.
 *
 * @param {object} reqUser - Authenticated user object
 * @returns {Array<object>} List of user conversations
 */
const listUserHistory = (reqUser = {}) => {
  const userId = reqUser.userId || reqUser._id || 'anonymous';
  const organizationId = reqUser.organizationId || 'default';
  return conversationMemory.getUserConversations(userId, organizationId);
};

/**
 * Retrieves detailed conversation history by ID.
 *
 * @param {string} conversationId - Conversation ID
 * @param {object} reqUser - Authenticated user object
 * @returns {object|null} Conversation object or null
 */
const getHistoryDetail = (conversationId, reqUser = {}) => {
  const userId = reqUser.userId || reqUser._id || 'anonymous';
  const organizationId = reqUser.organizationId || 'default';
  return conversationMemory.retrieveConversation(conversationId, userId, organizationId);
};

/**
 * Deletes a conversation from memory.
 *
 * @param {string} conversationId - Conversation ID
 * @param {object} reqUser - Authenticated user object
 * @returns {boolean} True if deleted
 */
const deleteUserHistory = (conversationId, reqUser = {}) => {
  const userId = reqUser.userId || reqUser._id || 'anonymous';
  const organizationId = reqUser.organizationId || 'default';
  return conversationMemory.clearConversation(conversationId, userId, organizationId);
};

module.exports = {
  prepareConversation,
  resolveFollowUpIntent,
  enrichPromptContext,
  saveExchange,
  listUserHistory,
  getHistoryDetail,
  deleteUserHistory,
};
