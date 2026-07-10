const recruitmentService = require('../services/recruitmentService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * ------------------------------------------------------------------
 * JOB POSITION ENDPOINTS
 * ------------------------------------------------------------------
 */

const getJobs = async (req, res, next) => {
  try {
    const result = await recruitmentService.getJobs(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Job positions retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const result = await recruitmentService.createJob(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Job position created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const result = await recruitmentService.updateJob(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Job position updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await recruitmentService.deleteJob(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Job position deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * ------------------------------------------------------------------
 * CANDIDATE ENDPOINTS
 * ------------------------------------------------------------------
 */

const getCandidates = async (req, res, next) => {
  try {
    const result = await recruitmentService.getCandidates(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Candidates retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const createCandidate = async (req, res, next) => {
  try {
    const result = await recruitmentService.createCandidate(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Candidate created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const changeCandidateStatus = async (req, res, next) => {
  try {
    const result = await recruitmentService.changeCandidateStatus(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, `Candidate status changed to ${req.body.recruitmentStatus}`);
  } catch (error) {
    next(error);
  }
};

/**
 * ------------------------------------------------------------------
 * INTERVIEW ENDPOINTS
 * ------------------------------------------------------------------
 */

const getInterviewsForCandidate = async (req, res, next) => {
  try {
    const result = await recruitmentService.getInterviewsForCandidate(req.params.id, req.user.organizationId);
    sendSuccess(res, result, 'Interviews retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const scheduleInterview = async (req, res, next) => {
  try {
    const result = await recruitmentService.scheduleInterview(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Interview scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

const submitInterviewFeedback = async (req, res, next) => {
  try {
    const result = await recruitmentService.submitInterviewFeedback(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Interview feedback submitted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getCandidates,
  createCandidate,
  changeCandidateStatus,
  getInterviewsForCandidate,
  scheduleInterview,
  submitInterviewFeedback,
};
