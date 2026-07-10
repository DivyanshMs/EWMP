/**
 * workflowPlanner.js — Phase 16: AI Workflow Orchestration Engine
 * Authoritative planner for multi-step enterprise workflow orchestration.
 * Receives classified intents, conversation memory, database context, and action plans,
 * validates constraints via Workflow Validator, simulates step chains via Workflow Simulator,
 * and returns structured, multi-step execution plans with confirmationRequired: true and executionAllowed: false.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 16
 */

const workflowRegistry = require('./workflowRegistry');
const workflowValidator = require('./workflowValidator');
const workflowSimulator = require('./workflowSimulator');
const parameterResolver = require('../planner/parameterResolver');
const { logInfo, logDebug } = require('../../utils/loggerHelper');

/**
 * Plans a multi-step enterprise workflow based on intent, context, and user instructions.
 *
 * @param {object} params - Planning parameters
 * @param {string} [params.intent=''] - Classified intent
 * @param {object} [params.conversation={}] - Conversation memory session
 * @param {object} [params.context={}] - Database context payload from Context Builder
 * @param {object} [params.actionPlan=null] - Single-step action plan from Action Planner
 * @param {object} [params.user={}] - Authenticated user context
 * @param {string} [params.message=''] - User query string
 * @param {object} [params.parameters={}] - Explicitly supplied parameters
 * @param {string} [params.workflowId=null] - Explicit workflow identifier if supplied
 * @returns {object} Structured multi-step workflow plan
 */
const planWorkflow = ({
  intent = '',
  conversation = {},
  context = {},
  actionPlan = null,
  user = {},
  message = '',
  parameters = {},
  workflowId = null,
}) => {
  const start = Date.now();

  // 1. Match or retrieve workflow definition
  let workflow = null;
  if (workflowId && typeof workflowId === 'string') {
    workflow = workflowRegistry.getWorkflow(workflowId);
  } else {
    workflow = workflowRegistry.matchWorkflow(message, intent, actionPlan);
  }

  if (!workflow) {
    logDebug(`Workflow Planner: Unsupported workflow request for intent '${intent}'`);
    return {
      workflowId: null,
      name: null,
      status: 'UNSUPPORTED_WORKFLOW',
      reason: 'No matching multi-step enterprise workflow found for the requested operation.',
      estimatedDuration: null,
      steps: [],
      warnings: [],
      missingParameters: [],
      confirmationRequired: false,
      executionAllowed: false,
    };
  }

  logInfo('AI Workflow Selected', {
    workflowId: workflow.workflowId,
    name: workflow.name,
    steps: workflow.steps ? workflow.steps.length : 0,
  });

  // 2. Resolve Parameters across sources
  const resolvedParams = { ...parameters };
  if (actionPlan && actionPlan.parameters && typeof actionPlan.parameters === 'object') {
    Object.assign(resolvedParams, actionPlan.parameters);
  }
  if (conversation && conversation.metadata && conversation.metadata.parameters) {
    Object.assign(resolvedParams, conversation.metadata.parameters);
  }

  // Resolve required workflow parameters if still missing
  const requiredParams = Array.isArray(workflow.requiredParameters) ? workflow.requiredParameters : [];
  for (const paramName of requiredParams) {
    if (resolvedParams[paramName] === undefined || resolvedParams[paramName] === null || resolvedParams[paramName] === '') {
      const val = parameterResolver.extractSingleParameter(paramName, message, context, user, conversation.history || []);
      if (val !== null && val !== undefined && val !== '') {
        resolvedParams[paramName] = val;
      }
    }
  }

  // 3. Validate workflow constraints
  const valResult = workflowValidator.validateWorkflow(workflow, user, resolvedParams, context);
  if (!valResult.isValid) {
    const latencyMs = Date.now() - start;
    logInfo('AI Workflow Validation Failed', {
      workflowId: workflow.workflowId,
      status: valResult.status,
      latencyMs: `${latencyMs}ms`,
    });
    return {
      workflowId: workflow.workflowId,
      name: workflow.name,
      status: valResult.status,
      reason: valResult.reason,
      estimatedDuration: workflow.estimatedDuration,
      steps: [],
      warnings: valResult.warnings || [],
      missingParameters: valResult.missingParameters || [],
      confirmationRequired: true,
      executionAllowed: false,
    };
  }

  // 4. Simulate workflow step dependencies
  const simStart = Date.now();
  const simResult = workflowSimulator.simulateWorkflow(workflow, resolvedParams, user, context);
  const simDuration = Date.now() - simStart;

  // 5. Format Step-by-Step Plan
  const formattedSteps = (workflow.steps || []).map(s => {
    const isBlocked = simResult.blockedSteps.some(b => b.step === s.step) || valResult.blockedSteps.some(b => b.step === s.step);
    return {
      step: s.step,
      module: s.module,
      action: s.action,
      status: isBlocked ? 'BLOCKED' : 'READY',
    };
  });

  const totalLatencyMs = Date.now() - start;
  logInfo('AI Workflow Plan Prepared', {
    workflowId: workflow.workflowId,
    status: 'READY_FOR_CONFIRMATION',
    planningLatency: `${totalLatencyMs}ms`,
    simulationDuration: `${simDuration}ms`,
  });

  return {
    workflowId: workflow.workflowId,
    name: workflow.name,
    status: 'READY_FOR_CONFIRMATION',
    estimatedDuration: workflow.estimatedDuration,
    steps: formattedSteps,
    warnings: [...(valResult.warnings || []), ...(simResult.warnings || [])],
    missingParameters: [],
    confirmationRequired: true,
    executionAllowed: false,
  };
};

module.exports = {
  planWorkflow,
};
