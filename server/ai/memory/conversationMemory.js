/**
 * conversationMemory.js — Phase 9: Conversation Memory Store
 * In-memory short-term conversational memory store.
 * Maintains conversation history per conversationId, scoped strictly by userId and organizationId.
 * Enforces automatic trimming to retain only the latest 10 exchanges.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 11
 */

const crypto = require('crypto');
const AppError = require('../../utils/AppError');
const { logInfo, logWarn, logDebug } = require('../../utils/loggerHelper');

// In-memory store: Map<conversationId, ConversationObject>
const memoryStore = new Map();

const MAX_EXCHANGES = 10;

/**
 * Generates a unique 24-character hexadecimal identifier for new conversations.
 * @returns {string} 24-char hex string
 */
const generateConversationId = () => {
  return crypto.randomBytes(12).toString('hex');
};

/**
 * Trims old history from a conversation object to enforce the MAX_EXCHANGES limit.
 *
 * @param {object} conversation - The conversation object to trim
 * @returns {object} Trimmed conversation object
 */
const trimOldHistory = (conversation) => {
  if (!conversation || !Array.isArray(conversation.exchanges)) {
    return conversation;
  }

  if (conversation.exchanges.length > MAX_EXCHANGES) {
    const discardedCount = conversation.exchanges.length - MAX_EXCHANGES;
    conversation.exchanges = conversation.exchanges.slice(-MAX_EXCHANGES);
    logDebug(`Trimmed ${discardedCount} old exchanges from conversation ${conversation.conversationId}`);
  }

  return conversation;
};

/**
 * Creates a new conversation entry in memory.
 *
 * @param {object} params - Creation parameters
 * @param {string} [params.conversationId] - Optional provided conversationId
 * @param {string} params.userId - Owner user ID
 * @param {string} params.organizationId - Tenant organization ID
 * @returns {object} Initialized conversation object
 */
const createConversation = ({ conversationId, userId, organizationId }) => {
  if (!userId || !organizationId) {
    throw new AppError(400, 'User ID and Organization ID are required to initialize conversation memory.', 'MISSING_MEMORY_SCOPE');
  }

  const id = (conversationId && typeof conversationId === 'string' && conversationId.trim())
    ? conversationId.trim()
    : generateConversationId();

  if (memoryStore.has(id)) {
    const existing = memoryStore.get(id);
    if (existing.userId !== userId || existing.organizationId !== organizationId) {
      throw new AppError(403, 'Access denied: Conversation belongs to another user or organization.', 'CONVERSATION_ACCESS_DENIED');
    }
    return existing;
  }

  const newConversation = {
    conversationId: id,
    userId,
    organizationId,
    timestamp: Date.now(),
    exchanges: [],
  };

  memoryStore.set(id, newConversation);
  logDebug(`Created new conversation memory store: ${id}`);
  return newConversation;
};

/**
 * Retrieves an existing conversation by ID with strict tenant and user ownership verification.
 *
 * @param {string} conversationId - Conversation identifier
 * @param {string} userId - Requesting user ID
 * @param {string} organizationId - Requesting organization ID
 * @returns {object|null} The conversation object or null if not found
 */
const retrieveConversation = (conversationId, userId, organizationId) => {
  if (!conversationId || typeof conversationId !== 'string') {
    return null;
  }

  const id = conversationId.trim();
  if (!memoryStore.has(id)) {
    return null;
  }

  const conversation = memoryStore.get(id);

  // Strict security isolation: One user must never access another user's history
  if (conversation.userId !== userId || conversation.organizationId !== organizationId) {
    logWarn(`🚨 Security violation: User ${userId} (${organizationId}) attempted to access conversation ${id} owned by ${conversation.userId} (${conversation.organizationId})`);
    throw new AppError(403, 'Access denied: You do not have permission to access this conversation history.', 'CONVERSATION_ACCESS_DENIED');
  }

  return conversation;
};

/**
 * Appends a new message exchange to an existing or new conversation.
 *
 * @param {object} params - Append parameters
 * @param {string} params.conversationId - Conversation ID
 * @param {string} params.userId - User ID
 * @param {string} params.organizationId - Organization ID
 * @param {string} params.userMessage - User query string
 * @param {string} params.assistantResponse - AI assistant response string
 * @param {string} params.intent - Classified intent category
 * @returns {object} Updated conversation object
 */
const appendMessage = ({ conversationId, userId, organizationId, userMessage, assistantResponse, intent }) => {
  let conversation = retrieveConversation(conversationId, userId, organizationId);
  if (!conversation) {
    conversation = createConversation({ conversationId, userId, organizationId });
  }

  const exchange = {
    userMessage: (userMessage || '').trim(),
    assistantResponse: (assistantResponse || '').trim(),
    intent: (intent || 'UNKNOWN').toUpperCase(),
    timestamp: Date.now(),
  };

  conversation.exchanges.push(exchange);
  conversation.timestamp = Date.now();

  trimOldHistory(conversation);
  memoryStore.set(conversation.conversationId, conversation);

  return conversation;
};

/**
 * Clears and deletes a conversation from memory store.
 *
 * @param {string} conversationId - Conversation ID to clear
 * @param {string} userId - Requesting user ID
 * @param {string} organizationId - Requesting organization ID
 * @returns {boolean} True if deleted, false if not found
 */
const clearConversation = (conversationId, userId, organizationId) => {
  const conversation = retrieveConversation(conversationId, userId, organizationId);
  if (!conversation) {
    return false;
  }

  memoryStore.delete(conversation.conversationId);
  logInfo(`Cleared conversation memory: ${conversation.conversationId}`);
  return true;
};

/**
 * Retrieves all active conversations belonging to a specific user and organization.
 *
 * @param {string} userId - Owner user ID
 * @param {string} organizationId - Tenant organization ID
 * @returns {Array<object>} List of summary conversation objects
 */
const getUserConversations = (userId, organizationId) => {
  const userConversations = [];
  for (const [id, conv] of memoryStore.entries()) {
    if (conv.userId === userId && conv.organizationId === organizationId) {
      userConversations.push({
        conversationId: conv.conversationId,
        timestamp: conv.timestamp,
        historyLength: conv.exchanges.length,
        lastIntent: conv.exchanges.length > 0 ? conv.exchanges[conv.exchanges.length - 1].intent : null,
      });
    }
  }
  return userConversations.sort((a, b) => b.timestamp - a.timestamp);
};

module.exports = {
  memoryStore,
  MAX_EXCHANGES,
  generateConversationId,
  createConversation,
  retrieveConversation,
  appendMessage,
  clearConversation,
  trimOldHistory,
  getUserConversations,
};
