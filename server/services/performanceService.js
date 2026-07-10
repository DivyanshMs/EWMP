const PerformanceReview = require('../models/PerformanceReview');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { logInfo, logError } = require('../utils/loggerHelper');

const createAuditLog = async (data) => {
  try {
    await AuditLog.create(data);
  } catch (err) {
    logError('Audit log creation failed', { error: err.message, data });
  }
};

/**
 * ------------------------------------------------------------------
 * PERFORMANCE REVIEW METHODS
 * ------------------------------------------------------------------
 */

const getReviews = async (queryParams, organizationId, user) => {
  const { page = 1, limit = 10, employeeId, reviewerId, quarter, year, reviewStatus, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (quarter) query.quarter = quarter;
  if (year) query.year = parseInt(year);
  if (reviewStatus) query.reviewStatus = reviewStatus;
  
  if (user.role === 'EMPLOYEE') {
    query.employeeId = user.employeeId;
  } else {
    if (employeeId) query.employeeId = employeeId;
    if (reviewerId) query.reviewerId = reviewerId;
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    PerformanceReview.find(query)
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('reviewerId', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    PerformanceReview.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

const getReviewById = async (id, organizationId, user) => {
  const query = { _id: id, organizationId, status: 'active' };
  if (user.role === 'EMPLOYEE') query.employeeId = user.employeeId;

  const review = await PerformanceReview.findOne(query)
    .populate('employeeId', 'firstName lastName employeeCode departmentId')
    .populate('reviewerId', 'firstName lastName')
    .populate('goalIds');

  if (!review) {
    throw new AppError(404, 'Performance review not found or unauthorized');
  }
  return review;
};

const createReview = async (data, organizationId, user) => {
  // Prevent duplicate review cycle for same employee
  const exists = await PerformanceReview.exists({
    employeeId: data.employeeId,
    year: data.year,
    quarter: data.quarter,
    organizationId,
    status: 'active'
  });

  if (exists) {
    throw new AppError(400, `An active review cycle already exists for ${data.quarter} ${data.year}`);
  }

  const review = await PerformanceReview.create({
    ...data,
    organizationId,
    createdBy: user._id,
    reviewStatus: 'Self-Assessment Pending'
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_PERFORMANCE_REVIEW',
    entityType: 'PerformanceReview',
    entityId: review._id,
    newValue: { quarter: review.quarter, year: review.year, employeeId: review.employeeId }
  });

  return review;
};

const submitSelfAssessment = async (id, data, organizationId, user) => {
  const review = await PerformanceReview.findOne({ _id: id, organizationId, employeeId: user.employeeId, status: 'active' });
  if (!review) throw new AppError(404, 'Review not found or unauthorized');
  
  if (review.reviewStatus !== 'Self-Assessment Pending' && review.reviewStatus !== 'Draft') {
    throw new AppError(400, `Cannot submit self-assessment in ${review.reviewStatus} state`);
  }

  review.selfAssessment = data.selfAssessment;
  review.selfRating = data.selfRating;
  review.reviewStatus = 'Manager Review Pending';
  await review.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SUBMIT_SELF_ASSESSMENT',
    entityType: 'PerformanceReview',
    entityId: review._id
  });

  return review;
};

const submitManagerAssessment = async (id, data, organizationId, user) => {
  const review = await PerformanceReview.findOne({ _id: id, organizationId, status: 'active' });
  if (!review) throw new AppError(404, 'Review not found');

  if (review.reviewStatus === 'Completed') {
    throw new AppError(400, 'Cannot edit a completed review');
  }

  review.managerFeedback = data.managerFeedback;
  review.managerRating = data.managerRating;
  if (data.kpiScore !== undefined) review.kpiScore = data.kpiScore;
  if (data.attendanceScore !== undefined) review.attendanceScore = data.attendanceScore;
  
  await review.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SUBMIT_MANAGER_ASSESSMENT',
    entityType: 'PerformanceReview',
    entityId: review._id
  });

  return review;
};

const finalizeReview = async (id, data, organizationId, user) => {
  const review = await PerformanceReview.findOne({ _id: id, organizationId, status: 'active' });
  if (!review) throw new AppError(404, 'Review not found');

  if (review.reviewStatus === 'Completed') {
    throw new AppError(400, 'Review is already completed');
  }

  Object.assign(review, data);
  review.reviewStatus = 'Completed';
  review.completedAt = new Date();
  await review.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'FINALIZE_PERFORMANCE_REVIEW',
    entityType: 'PerformanceReview',
    entityId: review._id,
    newValue: { finalRating: review.finalRating, overallLevel: review.overallLevel }
  });

  return review;
};

const deleteReview = async (id, organizationId, user) => {
  const review = await PerformanceReview.findOne({ _id: id, organizationId, status: 'active' });
  if (!review) throw new AppError(404, 'Review not found');

  review.status = 'archived';
  await review.save();
  return null;
};

/**
 * ------------------------------------------------------------------
 * GOAL METHODS
 * ------------------------------------------------------------------
 */

const getGoals = async (queryParams, organizationId, user) => {
  const { page = 1, limit = 10, employeeId, setByManagerId, quarter, year, goalStatus, sort = '-createdAt' } = queryParams;
  const query = { organizationId, status: 'active' };

  if (quarter) query.quarter = quarter;
  if (year) query.year = parseInt(year);
  if (goalStatus) query.goalStatus = goalStatus;

  if (user.role === 'EMPLOYEE') {
    query.employeeId = user.employeeId;
  } else {
    if (employeeId) query.employeeId = employeeId;
    if (setByManagerId) query.setByManagerId = setByManagerId;
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Goal.find(query)
      .populate('employeeId', 'firstName lastName')
      .populate('setByManagerId', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Goal.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

const createGoal = async (data, organizationId, user) => {
  const setByManagerId = user.role === 'EMPLOYEE' ? user.employeeId : user.employeeId || data.setByManagerId;
  
  const goal = await Goal.create({
    ...data,
    organizationId,
    setByManagerId,
    createdBy: user._id
  });

  // Automatically link to an active PerformanceReview if one exists
  const review = await PerformanceReview.findOne({
    employeeId: goal.employeeId,
    year: goal.year,
    quarter: goal.quarter,
    organizationId,
    status: 'active'
  });

  if (review) {
    review.goalIds.push(goal._id);
    await review.save();
  }

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_GOAL',
    entityType: 'Goal',
    entityId: goal._id
  });

  return goal;
};

const updateGoalProgress = async (id, data, organizationId, user) => {
  const query = { _id: id, organizationId, status: 'active' };
  if (user.role === 'EMPLOYEE') query.employeeId = user.employeeId;

  const goal = await Goal.findOne(query);
  if (!goal) throw new AppError(404, 'Goal not found or unauthorized');

  Object.assign(goal, data);
  if (goal.completionPercent === 100) goal.goalStatus = 'Completed';
  
  await goal.save();
  return goal;
};

const evaluateGoal = async (id, data, organizationId, user) => {
  const goal = await Goal.findOne({ _id: id, organizationId, status: 'active' });
  if (!goal) throw new AppError(404, 'Goal not found');

  goal.managerRating = data.managerRating;
  goal.managerNotes = data.managerNotes;
  await goal.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'EVALUATE_GOAL',
    entityType: 'Goal',
    entityId: goal._id
  });

  return goal;
};

const deleteGoal = async (id, organizationId, user) => {
  const goal = await Goal.findOne({ _id: id, organizationId, status: 'active' });
  if (!goal) throw new AppError(404, 'Goal not found');

  goal.status = 'archived';
  await goal.save();
  return null;
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
