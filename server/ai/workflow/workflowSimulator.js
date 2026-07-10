/**
 * workflowSimulator.js — Phase 16: AI Workflow Orchestration Engine
 * Simulates multi-step enterprise workflow execution without executing real transactions,
 * modifying business modules, or creating schedulers. Calculates step dependencies,
 * estimates duration, and identifies blocked or prerequisite steps.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 16
 */

const { logDebug } = require('../../utils/loggerHelper');

/**
 * Simulates workflow execution and dependency chain resolution without real execution.
 *
 * @param {object} workflow - Workflow definition object from registry
 * @param {object} [parameters={}] - Supplied parameters
 * @param {object} [user={}] - Authenticated user context
 * @param {object} [context={}] - Database context payload
 * @returns {object} Simulation results { estimatedSteps, estimatedTime, dependencies, warnings, blockedSteps }
 */
const simulateWorkflow = (workflow, parameters = {}, user = {}, context = {}) => {
  const start = Date.now();
  const warnings = [];
  const blockedSteps = [];
  const dependencies = [];

  if (!workflow || !Array.isArray(workflow.steps)) {
    return {
      estimatedSteps: 0,
      estimatedTime: '0 minutes',
      dependencies: [],
      warnings: ['Invalid workflow definition provided for simulation.'],
      blockedSteps: [],
    };
  }

  const stepIds = new Set(workflow.steps.map(s => s.step));

  for (const step of workflow.steps) {
    const deps = Array.isArray(step.dependsOn) ? step.dependsOn : [];
    dependencies.push({
      step: step.step,
      module: step.module,
      action: step.action,
      dependsOn: deps,
    });

    // Check circular or missing dependencies
    for (const dep of deps) {
      if (!stepIds.has(dep)) {
        warnings.push(`Step ${step.step} (${step.action}) depends on non-existent step ${dep}.`);
      }
      if (dep === step.step) {
        warnings.push(`Step ${step.step} (${step.action}) has a circular dependency on itself.`);
        blockedSteps.push({ step: step.step, module: step.module, action: step.action, reason: 'Circular dependency detected.' });
      }
    }
  }

  const durationMs = Date.now() - start;
  logDebug(`Workflow Simulator: Completed simulation for '${workflow.workflowId}' in ${durationMs}ms`);

  return {
    estimatedSteps: workflow.steps.length,
    estimatedTime: workflow.estimatedDuration || `${workflow.steps.length * 3} minutes`,
    dependencies,
    warnings,
    blockedSteps,
  };
};

module.exports = {
  simulateWorkflow,
};
