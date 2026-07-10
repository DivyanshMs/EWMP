/**
 * workflowValidator.js — Phase 16: AI Workflow Orchestration Engine
 * Authoritative validator for multi-step enterprise workflow planning.
 * Verifies required user roles, tenant boundaries (organizationId), parameter completeness,
 * and AI module plugin availability before allowing simulation or plan preparation.
 * Never executes workflows, never bypasses RBAC or organizationId, and never elevates privileges.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 16
 */

const pluginManager = require('../plugins/pluginManager');
const { logDebug, logWarn } = require('../../utils/loggerHelper');

/**
 * Validates a workflow definition against authenticated user context, parameters, and system readiness.
 *
 * @param {object} workflow - Workflow definition object from registry
 * @param {object} [user={}] - Authenticated user context
 * @param {object} [parameters={}] - Extracted or supplied parameters
 * @param {object} [context={}] - Database context payload
 * @returns {object} Validation result { isValid, status, reason, missingParameters, blockedSteps, warnings }
 */
const validateWorkflow = (workflow, user = {}, parameters = {}, context = {}) => {
  const warnings = [];
  const blockedSteps = [];
  const missingParameters = [];

  if (!workflow || typeof workflow !== 'object') {
    return {
      isValid: false,
      status: 'UNSUPPORTED_WORKFLOW',
      reason: 'Requested workflow definition is invalid or unsupported.',
      missingParameters: [],
      blockedSteps: [],
      warnings: [],
    };
  }

  // 1. Verify Tenant Boundary (organizationId scope)
  const orgId = user.organizationId || user.orgId || user.tenantId;
  if (!orgId && user.role !== 'SUPER_ADMIN') {
    logWarn(`Workflow Validator: Tenant scope violation for user ${user.userId || 'unknown'}`);
    return {
      isValid: false,
      status: 'PERMISSION_DENIED',
      reason: 'Tenant Isolation Violation: Active organizationId scope is required to plan enterprise workflows.',
      missingParameters: [],
      blockedSteps: [],
      warnings: [],
    };
  }

  // 2. Verify RBAC Required Roles
  const userRole = (user.role && typeof user.role === 'string') ? user.role.toUpperCase() : 'EMPLOYEE';
  const requiredRoles = Array.isArray(workflow.requiredRoles) ? workflow.requiredRoles : [];
  const isAuthorizedRole = requiredRoles.includes(userRole) || userRole === 'SUPER_ADMIN' || userRole === 'ORG_ADMIN';

  if (!isAuthorizedRole && requiredRoles.length > 0) {
    logWarn(`Workflow Validator: RBAC mismatch. Role '${userRole}' not in [${requiredRoles.join(', ')}] for workflow '${workflow.workflowId}'`);
    return {
      isValid: false,
      status: 'PERMISSION_DENIED',
      reason: `RBAC Permission Mismatch: Your role '${userRole}' is not authorized to plan or initiate '${workflow.name}'. Required roles: ${requiredRoles.join(', ')}.`,
      missingParameters: [],
      blockedSteps: [],
      warnings: [],
    };
  }

  // 3. Verify Required Module Plugins Availability
  const requiredModules = Array.isArray(workflow.requiredModules) ? workflow.requiredModules : [];
  for (const mod of requiredModules) {
    const plugin = pluginManager.getPluginByName(mod);
    if (!plugin) {
      warnings.push(`Required AI Module Plugin '${mod}' is currently unregistered or degraded. Certain step capabilities may be simulated with generic fallbacks.`);
    }
  }

  // 4. Verify Required Parameters
  const requiredParams = Array.isArray(workflow.requiredParameters) ? workflow.requiredParameters : [];
  for (const paramName of requiredParams) {
    const val = parameters[paramName];
    if (val === null || val === undefined || val === '') {
      missingParameters.push(paramName);
    }
  }

  if (missingParameters.length > 0) {
    logDebug(`Workflow Validator: Missing parameters [${missingParameters.join(', ')}] for workflow '${workflow.workflowId}'`);
    return {
      isValid: false,
      status: 'MISSING_PARAMETERS',
      reason: `Mandatory workflow parameters missing: [${missingParameters.join(', ')}]. Please provide these details to proceed with workflow planning.`,
      missingParameters,
      blockedSteps: [],
      warnings,
    };
  }

  // 5. Check Step-Level Readiness
  if (Array.isArray(workflow.steps)) {
    for (const s of workflow.steps) {
      const plugin = pluginManager.getPluginByName(s.module);
      if (!plugin && !['SYSTEM', 'ORGANIZATION', 'DESIGNATION'].includes(s.module.toUpperCase())) {
        blockedSteps.push({
          step: s.step,
          module: s.module,
          action: s.action,
          reason: `Module plugin '${s.module}' unavailable for execution planning.`,
        });
      }
    }
  }

  logDebug(`Workflow Validator: Successfully validated '${workflow.workflowId}' for user ${user.userId || 'unknown'} (Role: ${userRole})`);
  return {
    isValid: true,
    status: 'VALIDATED',
    reason: 'Workflow validation passed successfully.',
    missingParameters: [],
    blockedSteps,
    warnings,
  };
};

module.exports = {
  validateWorkflow,
};
