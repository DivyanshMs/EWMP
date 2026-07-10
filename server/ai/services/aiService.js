/**
 * aiService.js — Phase 8/9: AI Service Orchestrator with Response Builder & Conversation Memory
 * Pure orchestration service for AI features. Contains ZERO routing or response formatting logic.
 * Prepares short-term conversation memory, triggers Intent Engine classification with follow-up inheritance,
 * delegates execution pipeline selection to AI Service Router with injected history,
 * passes raw results through Response Builder, and saves exchanges back to Conversation Memory.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 8, 10 & 11
 */

const providerFactory = require('../providers/providerFactory');
const intentEngine = require('../engine/intentEngine');
const aiServiceRouter = require('../router/aiServiceRouter');
const responseBuilder = require('../response/responseBuilder');
const memoryManager = require('../memory/memoryManager');
const metricsCollector = require('../optimization/metricsCollector');
const cacheManager = require('../optimization/cacheManager');
const providerHealthManager = require('../optimization/providerHealthManager');
const contextBuilder = require('../context/contextBuilder');
const actionPlanner = require('../planner/actionPlanner');
const pluginManager = require('../plugins/pluginManager');
const workflowEngine = require('../workflow/workflowEngine');
const AppError = require('../../utils/AppError');

const getHealthStatus = async () => {
  const provider = providerFactory.getProvider();
  const providerHealth = await provider.health();
  const metrics = metricsCollector.getMetrics();
  const cacheStatus = cacheManager.getStats();
  const healthState = providerHealthManager.getStatus(provider.name || 'gemini');
  const pluginsHealth = pluginManager.getHealth();

  return {
    ...providerHealth,
    optimization: {
      metrics,
      cache: cacheStatus,
      healthMonitor: healthState,
    },
    plugins: pluginsHealth,
  };
};

const chat = async (data = {}, reqUser = {}) => {
  const convContext = memoryManager.prepareConversation(data, reqUser);
  let intentResult = await intentEngine.detectIntent(data.message);
  intentResult = memoryManager.resolveFollowUpIntent(intentResult, convContext.lastIntent);

  try {
    const routed = await aiServiceRouter.routeRequest({
      intentResult,
      user: reqUser,
      message: data.message,
      organizationId: reqUser.organizationId || null,
      employeeId: reqUser.employeeId || null,
      history: convContext.history,
    });

    if (routed.error) {
      const errResponse = responseBuilder.buildErrorResponse({
        error: routed.error,
        intent: routed.intent,
        confidence: routed.confidence,
        provider: routed.providerName || 'gemini',
        contextMetadata: routed.contextMetadata,
        latencyMs: routed.latencyMs,
        recommendations: routed.recommendations || null,
        insights: routed.insights || null,
      });
      errResponse.conversationId = convContext.conversationId;
      errResponse.historyLength = convContext.historyLength;
      return errResponse;
    }

    const builtResponse = responseBuilder.buildResponse({
      rawResponse: routed.reply,
      intent: routed.intent,
      confidence: routed.confidence,
      provider: routed.providerName || 'gemini',
      contextMetadata: routed.contextMetadata,
      latencyMs: routed.latencyMs,
      tokensUsed: routed.tokensUsed || null,
      recommendations: routed.recommendations || null,
      insights: routed.insights || null,
    });

    const saved = memoryManager.saveExchange({
      conversationId: convContext.conversationId,
      reqUser,
      userMessage: data.message,
      assistantResponse: builtResponse.response,
      intent: builtResponse.intent,
    });

    builtResponse.conversationId = saved.conversationId;
    builtResponse.historyLength = saved.historyLength;
    return builtResponse;
  } catch (error) {
    const errResponse = responseBuilder.buildErrorResponse({
      error,
      intent: (intentResult && intentResult.intent) ? intentResult.intent : 'UNKNOWN',
      confidence: (intentResult && typeof intentResult.confidence === 'number') ? intentResult.confidence : 0.0,
      provider: 'gemini',
      contextMetadata: { recordsRetrieved: 0 },
      latencyMs: 0,
    });
    errResponse.conversationId = convContext.conversationId;
    errResponse.historyLength = convContext.historyLength;
    return errResponse;
  }
};

const summarize = async (data = {}, reqUser = {}) => {
  const convContext = memoryManager.prepareConversation(data, reqUser);
  const intentResult = { intent: 'SUMMARY_REQUEST', confidence: 1.0, source: 'RULE' };

  try {
    const routed = await aiServiceRouter.routeRequest({
      intentResult,
      user: reqUser,
      message: data.message || 'Please summarize this record.',
      organizationId: reqUser.organizationId || null,
      employeeId: reqUser.employeeId || null,
      history: convContext.history,
    });

    if (routed.error) {
      const errResponse = responseBuilder.buildErrorResponse({
        error: routed.error,
        intent: routed.intent,
        confidence: routed.confidence,
        provider: routed.providerName || 'gemini',
        contextMetadata: routed.contextMetadata,
        latencyMs: routed.latencyMs,
        recommendations: routed.recommendations || null,
        insights: routed.insights || null,
      });
      errResponse.conversationId = convContext.conversationId;
      errResponse.historyLength = convContext.historyLength;
      return errResponse;
    }

    const builtResponse = responseBuilder.buildResponse({
      rawResponse: routed.reply,
      intent: routed.intent,
      confidence: routed.confidence,
      provider: routed.providerName || 'gemini',
      contextMetadata: routed.contextMetadata,
      latencyMs: routed.latencyMs,
      tokensUsed: routed.tokensUsed || null,
      recommendations: routed.recommendations || null,
      insights: routed.insights || null,
    });

    const saved = memoryManager.saveExchange({
      conversationId: convContext.conversationId,
      reqUser,
      userMessage: data.message || 'Please summarize this record.',
      assistantResponse: builtResponse.response,
      intent: builtResponse.intent,
    });

    builtResponse.conversationId = saved.conversationId;
    builtResponse.historyLength = saved.historyLength;
    return builtResponse;
  } catch (error) {
    const errResponse = responseBuilder.buildErrorResponse({
      error,
      intent: 'SUMMARY_REQUEST',
      confidence: 1.0,
      provider: 'gemini',
      contextMetadata: { recordsRetrieved: 0 },
      latencyMs: 0,
    });
    errResponse.conversationId = convContext.conversationId;
    errResponse.historyLength = convContext.historyLength;
    return errResponse;
  }
};

const insights = async (data = {}, reqUser = {}) => {
  const convContext = memoryManager.prepareConversation(data, reqUser);
  const intentResult = { intent: 'INSIGHT_REQUEST', confidence: 1.0, source: 'RULE' };

  try {
    const routed = await aiServiceRouter.routeRequest({
      intentResult,
      user: reqUser,
      message: data.message || 'Please generate analytical insights for this domain.',
      organizationId: reqUser.organizationId || null,
      employeeId: reqUser.employeeId || null,
      history: convContext.history,
    });

    if (routed.error) {
      const errResponse = responseBuilder.buildErrorResponse({
        error: routed.error,
        intent: routed.intent,
        confidence: routed.confidence,
        provider: routed.providerName || 'gemini',
        contextMetadata: routed.contextMetadata,
        latencyMs: routed.latencyMs,
        recommendations: routed.recommendations || null,
        insights: routed.insights || null,
      });
      errResponse.conversationId = convContext.conversationId;
      errResponse.historyLength = convContext.historyLength;
      return errResponse;
    }

    const builtResponse = responseBuilder.buildResponse({
      rawResponse: routed.reply,
      intent: routed.intent,
      confidence: routed.confidence,
      provider: routed.providerName || 'gemini',
      contextMetadata: routed.contextMetadata,
      latencyMs: routed.latencyMs,
      tokensUsed: routed.tokensUsed || null,
      recommendations: routed.recommendations || null,
      insights: routed.insights || null,
    });

    const saved = memoryManager.saveExchange({
      conversationId: convContext.conversationId,
      reqUser,
      userMessage: data.message || 'Please generate analytical insights for this domain.',
      assistantResponse: builtResponse.response,
      intent: builtResponse.intent,
    });

    builtResponse.conversationId = saved.conversationId;
    builtResponse.historyLength = saved.historyLength;
    return builtResponse;
  } catch (error) {
    const errResponse = responseBuilder.buildErrorResponse({
      error,
      intent: 'INSIGHT_REQUEST',
      confidence: 1.0,
      provider: 'gemini',
      contextMetadata: { recordsRetrieved: 0 },
      latencyMs: 0,
    });
    errResponse.conversationId = convContext.conversationId;
    errResponse.historyLength = convContext.historyLength;
    return errResponse;
  }
};

const recommendations = async (data = {}, reqUser = {}) => {
  const convContext = memoryManager.prepareConversation(data, reqUser);
  const intentResult = { intent: 'RECOMMENDATION_REQUEST', confidence: 1.0, source: 'RULE' };

  try {
    const routed = await aiServiceRouter.routeRequest({
      intentResult,
      user: reqUser,
      message: data.message || 'Please provide actionable recommendations.',
      organizationId: reqUser.organizationId || null,
      employeeId: reqUser.employeeId || null,
      history: convContext.history,
    });

    if (routed.error) {
      const errResponse = responseBuilder.buildErrorResponse({
        error: routed.error,
        intent: routed.intent,
        confidence: routed.confidence,
        provider: routed.providerName || 'gemini',
        contextMetadata: routed.contextMetadata,
        latencyMs: routed.latencyMs,
        recommendations: routed.recommendations || null,
        insights: routed.insights || null,
      });
      errResponse.conversationId = convContext.conversationId;
      errResponse.historyLength = convContext.historyLength;
      return errResponse;
    }

    const builtResponse = responseBuilder.buildResponse({
      rawResponse: routed.reply,
      intent: routed.intent,
      confidence: routed.confidence,
      provider: routed.providerName || 'gemini',
      contextMetadata: routed.contextMetadata,
      latencyMs: routed.latencyMs,
      tokensUsed: routed.tokensUsed || null,
      recommendations: routed.recommendations || null,
      insights: routed.insights || null,
    });

    const saved = memoryManager.saveExchange({
      conversationId: convContext.conversationId,
      reqUser,
      userMessage: data.message || 'Please provide actionable recommendations.',
      assistantResponse: builtResponse.response,
      intent: builtResponse.intent,
    });

    builtResponse.conversationId = saved.conversationId;
    builtResponse.historyLength = saved.historyLength;
    return builtResponse;
  } catch (error) {
    const errResponse = responseBuilder.buildErrorResponse({
      error,
      intent: 'RECOMMENDATION_REQUEST',
      confidence: 1.0,
      provider: 'gemini',
      contextMetadata: { recordsRetrieved: 0 },
      latencyMs: 0,
    });
    errResponse.conversationId = convContext.conversationId;
    errResponse.historyLength = convContext.historyLength;
    return errResponse;
  }
};

const getHistory = async (query = {}, reqUser = {}) => {
  return memoryManager.listUserHistory(reqUser);
};

const getHistoryById = async (id, reqUser = {}) => {
  const detail = memoryManager.getHistoryDetail(id, reqUser);
  if (!detail) {
    throw new AppError(404, 'Conversation history not found or access denied.', 'CONVERSATION_NOT_FOUND');
  }
  return detail;
};

const deleteHistory = async (id, reqUser = {}) => {
  const deleted = memoryManager.deleteUserHistory(id, reqUser);
  if (!deleted) {
    throw new AppError(404, 'Conversation history not found or already deleted.', 'CONVERSATION_NOT_FOUND');
  }
  return { success: true, message: 'Conversation cleared successfully.' };
};

const actionPlan = async (data = {}, reqUser = {}) => {
  const convContext = memoryManager.prepareConversation(data, reqUser);
  let intentResult = await intentEngine.detectIntent(data.message);
  intentResult = memoryManager.resolveFollowUpIntent(intentResult, convContext.lastIntent);

  let contextPayload = null;
  try {
    contextPayload = await contextBuilder.buildContext(intentResult, data.message, reqUser);
  } catch (err) {
    contextPayload = { context: {}, metadata: {} };
  }

  const plan = actionPlanner.planAction({
    intent: intentResult && intentResult.intent ? intentResult.intent : 'UNKNOWN',
    contextPayload,
    history: convContext.history || [],
    user: reqUser,
    message: data.message,
  });

  memoryManager.saveExchange({
    userQuery: data.message,
    intentResult,
    aiResponse: `Prepared execution plan: ${plan.actionType} (${plan.status})`,
    metadata: { actionPlan: plan },
  }, reqUser);

  return plan;
};

const getPlugins = async () => {
  return pluginManager.getAllPlugins();
};

const getPluginsHealth = async () => {
  return pluginManager.getHealth();
};

const planWorkflow = async (data = {}, reqUser = {}) => {
  return workflowEngine.planWorkflow(data, reqUser);
};

const simulateWorkflow = async (data = {}, reqUser = {}) => {
  return workflowEngine.simulateWorkflow(data, reqUser);
};

const getWorkflows = async () => {
  return workflowEngine.getWorkflows();
};

const getWorkflowById = async (id) => {
  return workflowEngine.getWorkflowById(id);
};

module.exports = {
  getHealthStatus,
  chat,
  summarize,
  insights,
  recommendations,
  actionPlan,
  planWorkflow,
  simulateWorkflow,
  getWorkflows,
  getWorkflowById,
  getPlugins,
  getPluginsHealth,
  getHistory,
  getHistoryById,
  deleteHistory,
};
