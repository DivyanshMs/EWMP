/**
 * aiController.js — Phase 6: Gemini Provider & Context Builder Integration
 * Controller layer for AI endpoints. Delegates to aiService passing body and authenticated user context.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const aiService = require('../services/aiService');
const { sendSuccess } = require('../../utils/formatResponse');

const getHealthStatus = async (req, res, next) => {
  try {
    const status = await aiService.getHealthStatus();
    return sendSuccess(res, 200, 'AI Infrastructure Ready', status);
  } catch (error) {
    next(error);
  }
};

const chat = async (req, res, next) => {
  try {
    const result = await aiService.chat(req.body, req.user);
    return sendSuccess(res, 200, 'AI response generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const summarize = async (req, res, next) => {
  try {
    const result = await aiService.summarize(req.body, req.user);
    return sendSuccess(res, 200, 'Summary generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const insights = async (req, res, next) => {
  try {
    const result = await aiService.insights(req.body, req.user);
    return sendSuccess(res, 200, 'AI insights generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const recommendations = async (req, res, next) => {
  try {
    const result = await aiService.recommendations(req.body, req.user);
    return sendSuccess(res, 200, 'AI recommendations generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await aiService.getHistory(req.query, req.user);
    return sendSuccess(res, 200, 'AI conversation history retrieved successfully.', history);
  } catch (error) {
    next(error);
  }
};

const getHistoryById = async (req, res, next) => {
  try {
    const conversation = await aiService.getHistoryById(req.params.id, req.user);
    return sendSuccess(res, 200, 'AI conversation retrieved successfully.', conversation);
  } catch (error) {
    next(error);
  }
};

const deleteHistory = async (req, res, next) => {
  try {
    await aiService.deleteHistory(req.params.id, req.user);
    return sendSuccess(res, 200, 'AI conversation archived successfully.');
  } catch (error) {
    next(error);
  }
};

const actionPlan = async (req, res, next) => {
  try {
    const result = await aiService.actionPlan(req.body, req.user);
    return sendSuccess(res, 200, 'AI execution plan generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getPlugins = async (req, res, next) => {
  try {
    const result = await aiService.getPlugins();
    return sendSuccess(res, 200, 'Registered AI module plugins retrieved successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getPluginsHealth = async (req, res, next) => {
  try {
    const result = await aiService.getPluginsHealth();
    return sendSuccess(res, 200, 'AI module plugins health status retrieved successfully.', result);
  } catch (error) {
    next(error);
  }
};

const planWorkflow = async (req, res, next) => {
  try {
    const result = await aiService.planWorkflow(req.body, req.user);
    return sendSuccess(res, 200, 'AI workflow plan generated successfully.', result);
  } catch (error) {
    next(error);
  }
};

const simulateWorkflow = async (req, res, next) => {
  try {
    const result = await aiService.simulateWorkflow(req.body, req.user);
    return sendSuccess(res, 200, 'AI workflow simulation completed successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getWorkflows = async (req, res, next) => {
  try {
    const result = await aiService.getWorkflows();
    return sendSuccess(res, 200, 'Registered enterprise workflows retrieved successfully.', result);
  } catch (error) {
    next(error);
  }
};

const getWorkflowById = async (req, res, next) => {
  try {
    const result = await aiService.getWorkflowById(req.params.id);
    return sendSuccess(res, 200, 'Enterprise workflow definition retrieved successfully.', result);
  } catch (error) {
    next(error);
  }
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
