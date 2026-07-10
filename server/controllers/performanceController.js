const performanceService = require('../services/performanceService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * ------------------------------------------------------------------
 * PERFORMANCE REVIEW ENDPOINTS
 * ------------------------------------------------------------------
 */

const getReviews = async (req, res, next) => {
  try {
    const result = await performanceService.getReviews(req.query, req.user.organizationId, req.user);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Performance reviews retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const result = await performanceService.getReviewById(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Performance review retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const result = await performanceService.createReview(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Performance review initiated successfully', 201);
  } catch (error) {
    next(error);
  }
};

const submitSelfAssessment = async (req, res, next) => {
  try {
    const result = await performanceService.submitSelfAssessment(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Self assessment submitted successfully');
  } catch (error) {
    next(error);
  }
};

const submitManagerAssessment = async (req, res, next) => {
  try {
    const result = await performanceService.submitManagerAssessment(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Manager assessment submitted successfully');
  } catch (error) {
    next(error);
  }
};

const finalizeReview = async (req, res, next) => {
  try {
    const result = await performanceService.finalizeReview(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Performance review finalized successfully');
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await performanceService.deleteReview(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Performance review deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * ------------------------------------------------------------------
 * GOAL ENDPOINTS
 * ------------------------------------------------------------------
 */

const getGoals = async (req, res, next) => {
  try {
    const result = await performanceService.getGoals(req.query, req.user.organizationId, req.user);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Goals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const result = await performanceService.createGoal(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Goal created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateGoalProgress = async (req, res, next) => {
  try {
    const result = await performanceService.updateGoalProgress(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Goal progress updated successfully');
  } catch (error) {
    next(error);
  }
};

const evaluateGoal = async (req, res, next) => {
  try {
    const result = await performanceService.evaluateGoal(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Goal evaluated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    await performanceService.deleteGoal(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Goal deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  submitSelfAssessment,
  submitManagerAssessment,
  finalizeReview,
  deleteReview,
  getGoals,
  createGoal,
  updateGoalProgress,
  evaluateGoal,
  deleteGoal,
};
