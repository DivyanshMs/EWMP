/**
 * workflowEngine.js — Phase 16: AI Workflow Orchestration Engine
 * Authoritative orchestration engine for multi-step enterprise workflows.
 * Reuses Conversation Memory, Intent Engine, Context Builder, Recommendation Engine,
 * Action Planner, and AI Plugin Framework without duplicating business logic.
 * Authoritatively validates, plans, and simulates workflows without ever executing transactions,
 * modifying database schemas, or bypassing RBAC/tenant security boundaries.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 16
 */

const workflowRegistry = require('./workflowRegistry');
const workflowValidator = require('./workflowValidator');
const workflowSimulator = require('./workflowSimulator');
const workflowPlanner = require('./workflowPlanner');
const intentEngine = require('../engine/intentEngine');
const contextBuilder = require('../context/contextBuilder');
const actionPlanner = require('../planner/actionPlanner');
const memoryManager = require('../memory/memoryManager');
const pluginManager = require('../plugins/pluginManager');
const AppError = require('../../utils/AppError');
const { logInfo, logDebug } = require('../../utils/loggerHelper');

/**
 * Orchestrates multi-step workflow planning from user query or API request data.
 *
 * @param {object} data - Request payload { message, workflowId, parameters }
 * @param {object} reqUser - Authenticated user context
 * @returns {Promise<object>} Structured workflow execution plan
 */
const planWorkflow = async (data = {}, reqUser = {}) => {
  const start = Date.now();
  const message = data.message || '';

  // 1. Prepare conversation memory session
  const convContext = memoryManager.prepareConversation(data, reqUser);

  // 2. Classify intent
  let intentResult = await intentEngine.detectIntent(message);
  intentResult = memoryManager.resolveFollowUpIntent(intentResult, convContext.lastIntent);
  const rawIntent = intentResult && intentResult.intent ? intentResult.intent : 'UNKNOWN';

  // 3. Build context via responsible module plugin or Context Builder
  let contextPayload = null;
  try {
    const plugin = pluginManager.getPluginByIntent(rawIntent);
    if (plugin) {
      contextPayload = await plugin.buildContext(intentResult, message, reqUser);
    } else {
      contextPayload = await contextBuilder.buildContext(intentResult, message, reqUser);
    }
  } catch (err) {
    contextPayload = { intent: rawIntent, context: {}, metadata: {} };
  }

  // 4. Generate initial single-step action plan if applicable
  let actionPlan = null;
  try {
    actionPlan = actionPlanner.planAction({
      intent: rawIntent,
      contextPayload,
      history: convContext.history || [],
      user: reqUser,
      message,
    });
  } catch (planErr) {
    logDebug(`Workflow Engine: Single-step action planning skipped (${planErr.message})`);
  }

  // 5. Invoke Workflow Planner
  const workflowPlan = workflowPlanner.planWorkflow({
    intent: rawIntent,
    conversation: convContext,
    context: contextPayload,
    actionPlan,
    user: reqUser,
    message,
    parameters: data.parameters || {},
    workflowId: data.workflowId || null,
  });

  // 6. Save exchange to conversation memory
  memoryManager.saveExchange({
    userQuery: message || `Workflow request: ${workflowPlan.name || workflowPlan.workflowId || 'Unknown'}`,
    intentResult,
    aiResponse: `Prepared multi-step workflow plan: ${workflowPlan.name || 'Unknown'} (${workflowPlan.status})`,
    metadata: { workflowPlan, actionPlan },
  }, reqUser);

  const durationMs = Date.now() - start;
  logInfo('AI Workflow Orchestration Completed', {
    workflowId: workflowPlan.workflowId,
    status: workflowPlan.status,
    totalExecutionTimeMs: `${durationMs}ms`,
  });

  return workflowPlan;
};

/**
 * Simulates a multi-step workflow execution without executing real transactions or modifying business data.
 *
 * @param {object} data - Request payload { workflowId, parameters, message }
 * @param {object} reqUser - Authenticated user context
 * @returns {Promise<object>} Simulation report
 */
const simulateWorkflow = async (data = {}, reqUser = {}) => {
  const workflowId = data.workflowId || data.id;
  let workflow = null;

  if (workflowId) {
    workflow = workflowRegistry.getWorkflow(workflowId);
  } else if (data.message) {
    workflow = workflowRegistry.matchWorkflow(data.message);
  }

  if (!workflow) {
    throw new AppError(404, 'Workflow definition not found or unsupported.', 'WORKFLOW_NOT_FOUND');
  }

  // Validate tenant scope and basic role access before simulating
  const valResult = workflowValidator.validateWorkflow(workflow, reqUser, data.parameters || {}, {});
  if (!valResult.isValid && valResult.status === 'PERMISSION_DENIED') {
    throw new AppError(403, valResult.reason, 'PERMISSION_DENIED');
  }

  const simResult = workflowSimulator.simulateWorkflow(workflow, data.parameters || {}, reqUser, {});

  return {
    workflowId: workflow.workflowId,
    name: workflow.name,
    description: workflow.description,
    status: 'SIMULATED_SUCCESSFULLY',
    validationStatus: valResult.status,
    missingParameters: valResult.missingParameters || [],
    simulation: simResult,
    confirmationRequired: true,
    executionAllowed: false,
  };
};

/**
 * Retrieves all registered enterprise workflow definitions.
 *
 * @returns {Array<object>} Array of workflow definitions
 */
const getWorkflows = () => {
  return workflowRegistry.getAllWorkflows();
};

/**
 * Retrieves a specific workflow definition by identifier.
 *
 * @param {string} id - Workflow identifier
 * @returns {object} Workflow definition
 * @throws {AppError} 404 if not found
 */
const getWorkflowById = (id) => {
  const wf = workflowRegistry.getWorkflow(id);
  if (!wf) {
    throw new AppError(404, `Workflow definition '${id}' not found.`, 'WORKFLOW_NOT_FOUND');
  }
  return wf;
};

module.exports = {
  planWorkflow,
  simulateWorkflow,
  getWorkflows,
  getWorkflowById,
};
