/**
 * aiServiceRouter.js — Phase 7–13: AI Service Router with Optimization & Security Integration
 * Enterprise AI Service Router responsible for selecting the correct execution pipeline based on detected intent.
 * Intercepts intent classification from Intent Engine, manages conditional Context Builder invocation,
 * invokes Recommendation Engine exclusively for RECOMMENDATION_REQUEST, invokes Insight Engine exclusively for INSIGHT_REQUEST,
 * manages Context/Prompt/Response Caching, monitors Provider Health with fast fallback, enforces retry and timeout
 * boundaries, and collects production performance metrics.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 7, 8, 10, 11, 12 & 13
 */

const contextBuilder = require('../context/contextBuilder');
const promptBuilder = require('../builders/promptBuilder');
const providerFactory = require('../providers/providerFactory');
const memoryManager = require('../memory/memoryManager');
const recommendationEngine = require('../recommendation/recommendationEngine');
const insightEngine = require('../insights/insightEngine');
const actionPlanner = require('../planner/actionPlanner');
const toolRegistry = require('../planner/toolRegistry');
const workflowRegistry = require('../workflow/workflowRegistry');
const workflowPlanner = require('../workflow/workflowPlanner');
const pluginManager = require('../plugins/pluginManager');
const cacheManager = require('../optimization/cacheManager');
const retryManager = require('../optimization/retryManager');
const metricsCollector = require('../optimization/metricsCollector');
const providerHealthManager = require('../optimization/providerHealthManager');
const AppError = require('../../utils/AppError');
const { logInfo, logWarn, logDebug } = require('../../utils/loggerHelper');

const SUPPORTED_ROUTES = [
  'GENERAL_CHAT',
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
  'SUMMARY_REQUEST',
  'RECOMMENDATION_REQUEST',
  'INSIGHT_REQUEST',
  'UNKNOWN',
];

/**
 * Routes and executes an AI request pipeline based on intent classification with caching and retry resilience.
 *
 * @param {object} params - Request parameters
 * @param {object|string} params.intentResult - Intent detection result { intent, confidence, source } or string intent name
 * @param {object} params.user - Authenticated user context from authMiddleware { userId, role, organizationId, employeeId }
 * @param {string} params.message - Sanitized or raw user input query
 * @param {string} [params.organizationId] - Organization UUID
 * @param {string} [params.employeeId] - Employee UUID
 * @param {Array<object>} [params.history] - Conversation history array from memoryManager
 * @returns {Promise<object>} Structured AI response { intent, confidence, source, selectedRoute, contextMetadata, reply, error, latencyMs, providerName, recommendations, insights }
 */
const routeRequest = async ({ intentResult, user, message, organizationId, employeeId, history = [] }) => {
  const totalStartTime = Date.now();

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new AppError(400, 'A non-empty message is required for AI routing.', 'INVALID_PROMPT_MESSAGE');
  }

  const rawIntent = (intentResult && typeof intentResult === 'object' && intentResult.intent)
    ? intentResult.intent.toUpperCase()
    : (typeof intentResult === 'string' ? intentResult.toUpperCase() : 'UNKNOWN');

  const selectedRoute = SUPPORTED_ROUTES.includes(rawIntent) ? rawIntent : 'UNKNOWN';
  const confidence = (intentResult && typeof intentResult === 'object' && typeof intentResult.confidence === 'number')
    ? intentResult.confidence
    : 1.0;
  const source = (intentResult && typeof intentResult === 'object' && intentResult.source)
    ? intentResult.source
    : 'ROUTER';

  logDebug(`AI Service Router: Dispatching pipeline for route '${selectedRoute}' (Raw intent: '${rawIntent}')`);

  // Step 0: Check Response Cache for eligible queries (General Chat, Insights, Recommendations without sensitive data)
  const isCacheEligible = cacheManager.isCacheable(selectedRoute, message);
  const orgKey = user && user.organizationId ? user.organizationId : 'default';
  const cacheKeyBase = `${selectedRoute}:${orgKey}:${message.trim().toLowerCase()}`;

  if (isCacheEligible) {
    const cachedResponse = cacheManager.get(`resp:${cacheKeyBase}`, 'RESPONSE');
    if (cachedResponse) {
      const totalRequestTimeMs = Date.now() - totalStartTime;
      metricsCollector.recordRequest({
        latencyMs: totalRequestTimeMs,
        providerLatencyMs: 0,
        isCacheHit: true,
        isError: false,
      });
      logInfo('AI Service Router Execution (Served from Response Cache)', {
        intent: rawIntent,
        selectedRoute,
        totalRequestTimeMs,
      });
      return cachedResponse;
    }
  }

  let contextBuildTimeMs = 0;
  let promptBuildTimeMs = 0;
  let providerLatencyMs = 0;
  let contextPayload = null;

  // Step 1: Call Context Builder with Context Cache check (Skip for GENERAL_CHAT)
  const plugin = pluginManager.getPluginByIntent(selectedRoute);

  if (selectedRoute === 'GENERAL_CHAT') {
    contextPayload = {
      intent: 'GENERAL_CHAT',
      context: {},
      metadata: { recordsRetrieved: 0, buildTimeMs: 0, timestamp: new Date().toISOString() },
    };
  } else {
    const ctxStart = Date.now();
    const ctxKey = `ctx:${cacheKeyBase}`;
    const cachedCtx = isCacheEligible ? cacheManager.get(ctxKey, 'CONTEXT') : null;

    if (cachedCtx) {
      contextPayload = cachedCtx;
    } else {
      try {
        if (plugin) {
          contextPayload = await plugin.buildContext({ intent: selectedRoute, confidence, source }, message, user);
        } else {
          contextPayload = await contextBuilder.buildContext({ intent: selectedRoute, confidence, source }, message, user);
        }
        if (isCacheEligible && contextPayload) {
          cacheManager.set(ctxKey, contextPayload, 'CONTEXT');
        }
      } catch (err) {
        logWarn(`Context Builder failed during routing for ${selectedRoute}. Fallback to empty context: ${err.message}`);
        contextPayload = {
          intent: selectedRoute,
          context: {},
          metadata: { recordsRetrieved: 0, buildTimeMs: 0, timestamp: new Date().toISOString() },
        };
      }
    }
    contextBuildTimeMs = Date.now() - ctxStart;
  }

  // Step 1.5: Invoke Recommendation Engine ONLY for RECOMMENDATION_REQUEST (other routes bypass it)
  let generatedRecommendations = null;
  if (selectedRoute === 'RECOMMENDATION_REQUEST') {
    try {
      if (plugin) {
        generatedRecommendations = plugin.getRecommendations({ contextPayload, message, user });
      } else {
        generatedRecommendations = recommendationEngine.generateRecommendations({ contextPayload, message, user });
      }
      if (contextPayload) {
        contextPayload.recommendations = generatedRecommendations;
      }
    } catch (recErr) {
      logWarn(`Recommendation Engine failed during routing: ${recErr.message}`);
      generatedRecommendations = [];
    }
  }

  // Step 1.6: Invoke Insight Engine ONLY for INSIGHT_REQUEST (other routes bypass it)
  let generatedInsights = null;
  if (selectedRoute === 'INSIGHT_REQUEST') {
    try {
      if (plugin) {
        generatedInsights = plugin.getInsights({ contextPayload, message, user });
      } else {
        generatedInsights = insightEngine.generateInsights({ contextPayload, message, user });
      }
      if (contextPayload) {
        contextPayload.insights = generatedInsights;
      }
    } catch (insErr) {
      logWarn(`Insight Engine failed during routing: ${insErr.message}`);
      generatedInsights = [];
    }
  }

  // Step 1.7: Invoke Action Planner for ACTION_REQUEST or queries matching enterprise tools
  let generatedActionPlan = null;
  const matchedTool = toolRegistry.matchTool(message, rawIntent);
  if (selectedRoute === 'ACTION_REQUEST' || matchedTool) {
    try {
      const actionPlugin = plugin || (matchedTool ? pluginManager.getPluginByName(matchedTool.toolName.split('.')[0]) : null);
      if (actionPlugin) {
        generatedActionPlan = actionPlugin.getActions({ intent: rawIntent, contextPayload, history, user, message });
      } else {
        generatedActionPlan = actionPlanner.planAction({ intent: rawIntent, contextPayload, history, user, message });
      }
      if (contextPayload) {
        contextPayload.actionPlan = generatedActionPlan;
      }
    } catch (planErr) {
      logWarn(`Action Planner failed during routing: ${planErr.message}`);
    }
  }

  // Step 1.8: Invoke Workflow Planner if multi-step workflow matched
  let generatedWorkflowPlan = null;
  const matchedWorkflow = workflowRegistry.matchWorkflow(message, rawIntent, generatedActionPlan);
  if (matchedWorkflow) {
    try {
      generatedWorkflowPlan = workflowPlanner.planWorkflow({
        intent: rawIntent,
        conversation: { history },
        context: contextPayload,
        actionPlan: generatedActionPlan,
        user,
        message,
      });
      if (contextPayload && generatedWorkflowPlan && generatedWorkflowPlan.status !== 'UNSUPPORTED_WORKFLOW') {
        contextPayload.workflowPlan = generatedWorkflowPlan;
      }
    } catch (wfErr) {
      logWarn(`Workflow Planner failed during routing: ${wfErr.message}`);
    }
  }

  // Enrich contextPayload with conversation history before Prompt Builder execution
  contextPayload = memoryManager.enrichPromptContext(contextPayload, history);

  // Step 2: Call Prompt Builder with Prompt Cache check
  const prmStart = Date.now();
  const prmKey = `prm:${cacheKeyBase}:${history.length}`;
  const cachedPrompt = isCacheEligible ? cacheManager.get(prmKey, 'PROMPT') : null;
  let prompt = '';

  if (cachedPrompt) {
    prompt = cachedPrompt;
  } else {
    if (selectedRoute === 'SUMMARY_REQUEST') {
      prompt = promptBuilder.buildSummaryPrompt(message, contextPayload);
    } else if (selectedRoute === 'UNKNOWN') {
      prompt = promptBuilder.buildGenericPrompt('GENERIC', message, contextPayload);
    } else if (selectedRoute === 'INSIGHT_REQUEST') {
      prompt = promptBuilder.buildGenericPrompt('INSIGHTS', message, contextPayload);
    } else if (selectedRoute === 'RECOMMENDATION_REQUEST') {
      prompt = promptBuilder.buildGenericPrompt('RECOMMENDATIONS', message, contextPayload);
    } else {
      prompt = promptBuilder.buildChatPrompt(message, contextPayload);
    }
    if (isCacheEligible && prompt) {
      cacheManager.set(prmKey, prompt, 'PROMPT');
    }
  }
  promptBuildTimeMs = Date.now() - prmStart;

  // Step 3: Call Provider with Health Monitor Check and Retry Wrapper
  const provStart = Date.now();
  const provider = providerFactory.getProvider();
  const providerName = provider.name || 'gemini';
  let reply = '';
  let providerError = null;
  let wasRetry = false;
  let wasTimeout = false;

  if (!providerHealthManager.isProviderHealthy(providerName)) {
    providerError = `AI Provider '${providerName}' is currently marked UNHEALTHY. Fast fallback triggered.`;
    logWarn(`Provider health monitor fast fallback triggered for ${selectedRoute}: ${providerError}`);
  } else {
    try {
      const execFn = () => selectedRoute === 'SUMMARY_REQUEST' ? provider.summarize(prompt) : provider.chat(prompt);
      reply = await retryManager.executeWithRetry(execFn, {
        maxRetries: 2,
        delayMs: 500,
        timeoutMs: 5000,
        providerName,
        onRetry: () => { wasRetry = true; },
        onTimeout: () => { wasTimeout = true; },
      });
      providerHealthManager.recordSuccess(providerName);
    } catch (err) {
      providerError = err.message || 'AI Provider Execution Error';
      providerHealthManager.recordFailure(providerName, err);
      logWarn(`Provider execution failed for ${selectedRoute}: ${providerError}`);
    }
  }
  providerLatencyMs = Date.now() - provStart;

  // Step 4: Calculate total time & Log observability metrics
  const totalRequestTimeMs = Date.now() - totalStartTime;

  metricsCollector.recordRequest({
    latencyMs: totalRequestTimeMs,
    providerLatencyMs,
    isCacheHit: false,
    isError: Boolean(providerError),
    tokensUsed: null,
    wasRetry,
    wasTimeout,
  });

  logInfo('AI Service Router Execution', {
    intent: rawIntent,
    selectedRoute,
    contextBuildTimeMs,
    promptBuildTimeMs,
    providerLatencyMs,
    totalRequestTimeMs,
    hasRecommendations: Boolean(generatedRecommendations),
    hasInsights: Boolean(generatedInsights),
    wasRetry,
    wasTimeout,
  });

  // Step 5: Construct final response payload and store in Response Cache if successful
  const finalResponse = {
    intent: rawIntent,
    confidence,
    source,
    selectedRoute,
    contextMetadata: contextPayload ? contextPayload.metadata : {},
    reply,
    error: providerError,
    latencyMs: providerLatencyMs,
    providerName,
    recommendations: generatedRecommendations,
    insights: generatedInsights,
    actionPlan: generatedActionPlan,
    workflowPlan: generatedWorkflowPlan,
  };

  if (!providerError && isCacheEligible) {
    cacheManager.set(`resp:${cacheKeyBase}`, finalResponse, 'RESPONSE');
  }

  return finalResponse;
};

module.exports = {
  SUPPORTED_ROUTES,
  routeRequest,
};
