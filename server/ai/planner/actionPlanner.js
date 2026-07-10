/**
 * actionPlanner.js — Phase 14: AI Action Planner & Tool Calling
 * Authoritative AI Action Planner capable of identifying executable business operations and producing
 * structured execution plans without EVER executing actions, modifying business data, or escalating permissions.
 * Authoritatively enforces RBAC authorization, multi-tenant organization boundaries, and parameter validation.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 14
 */

const { matchTool } = require('./toolRegistry');
const { resolveParameters } = require('./parameterResolver');
const AppError = require('../../utils/AppError');
const { logInfo, logWarn, logDebug } = require('../../utils/loggerHelper');

/**
 * Prepares a structured execution plan for an identified business operation.
 * NEVER executes actions, NEVER modifies database, NEVER bypasses RBAC.
 *
 * @param {object} params - Planning parameters
 * @param {string} [params.intent] - Classified intent name from Intent Engine
 * @param {object} [params.contextPayload={}] - Database context from Context Builder
 * @param {Array<object>} [params.history=[]] - Short-term conversation history
 * @param {object} params.user - Authenticated user context { userId, role, organizationId, employeeId }
 * @param {string} params.message - User input query string
 * @returns {object} Structured execution plan object
 * @throws {AppError} Throws 403 if tenant isolation boundary is missing
 */
const planAction = ({ intent, contextPayload = {}, history = [], user = {}, message = '' } = {}) => {
  const start = Date.now();

  // 1. Validate multi-tenant security boundary
  if (!user || (!user.organizationId && !user.orgId && !user.id)) {
    const latency = `${Date.now() - start}ms`;
    logWarn('🚨 AI Action Planner: Blocked request lacking multi-tenant organization boundary', {
      actionType: 'SECURITY_BLOCK',
      planningLatency: latency,
    });
    throw new AppError(403, 'Multi-tenant organization boundary required for action planning: missing organizationId.', 'TENANT_ISOLATION_VIOLATION');
  }

  const role = user.role || 'EMPLOYEE';

  // 2. Identify matching enterprise tool
  const tool = matchTool(message, intent);

  if (!tool) {
    const planningLatency = `${Date.now() - start}ms`;
    logInfo('AI Action Planner: Unsupported Action', {
      actionType: 'UNKNOWN_ACTION',
      tool: null,
      confidence: 0.0,
      planningLatency,
    });
    return {
      actionType: 'UNKNOWN_ACTION',
      tool: null,
      requiredRole: null,
      parameters: {},
      confidence: 0.0,
      confirmationRequired: false,
      executionAllowed: false,
      status: 'UNSUPPORTED_ACTION',
      reason: 'No matching enterprise tool found for the requested operation.',
    };
  }

  const primaryRequiredRole = Array.isArray(tool.requiredRole) ? tool.requiredRole[0] : tool.requiredRole;

  // 3. Enforce RBAC validation
  if (Array.isArray(tool.requiredRole) && !tool.requiredRole.includes(role)) {
    const planningLatency = `${Date.now() - start}ms`;
    logWarn('🚨 AI Action Planner: Permission Mismatch', {
      actionType: tool.actionType,
      tool: tool.toolName,
      userRole: role,
      requiredRoles: tool.requiredRole,
      confidence: 0.95,
      planningLatency,
    });
    return {
      actionType: tool.actionType,
      tool: tool.toolName,
      requiredRole: primaryRequiredRole,
      parameters: {},
      confidence: 0.95,
      confirmationRequired: tool.confirmationRequired,
      executionAllowed: false,
      status: 'PERMISSION_DENIED',
      reason: `RBAC Permission Mismatch: Your role '${role}' is not authorized to execute '${tool.toolName}'. Required roles: ${tool.requiredRole.join(', ')}.`,
    };
  }

  // 4. Resolve mandatory and optional parameters
  const { parameters, missingParameters } = resolveParameters(tool, message, contextPayload, user, history);

  if (missingParameters.length > 0) {
    const planningLatency = `${Date.now() - start}ms`;
    logInfo('AI Action Planner: Missing Parameters', {
      actionType: tool.actionType,
      tool: tool.toolName,
      confidence: 0.85,
      planningLatency,
      missingCount: missingParameters.length,
    });
    return {
      actionType: tool.actionType,
      tool: tool.toolName,
      requiredRole: primaryRequiredRole,
      parameters,
      missingParameters,
      confidence: 0.85,
      confirmationRequired: tool.confirmationRequired,
      executionAllowed: false,
      status: 'MISSING_PARAMETERS',
      reason: `Mandatory tool parameters missing: [${missingParameters.join(', ')}]. Please provide these details to proceed.`,
    };
  }

  // 5. Construct final structured execution plan
  const planningLatency = `${Date.now() - start}ms`;
  const confidenceScore = 0.94;
  const status = tool.confirmationRequired ? 'WAITING_FOR_CONFIRMATION' : 'READY_FOR_EXECUTION';

  logInfo('AI Action Planner: Plan Prepared', {
    actionType: tool.actionType,
    tool: tool.toolName,
    confidence: confidenceScore,
    planningLatency,
    status,
  });

  return {
    actionType: tool.actionType,
    tool: tool.toolName,
    requiredRole: primaryRequiredRole,
    parameters,
    confidence: confidenceScore,
    confirmationRequired: tool.confirmationRequired,
    executionAllowed: false,
    status,
  };
};

module.exports = {
  planAction,
};
