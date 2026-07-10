const JobPosition = require('../models/JobPosition');
const Candidate = require('../models/Candidate');
const InterviewSchedule = require('../models/InterviewSchedule');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { buildSearchQuery } = require('../utils/queryHelper');
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
 * JOB POSITION METHODS
 * ------------------------------------------------------------------
 */

const getJobs = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, departmentId, hiringManagerId, jobStatus, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };
  if (departmentId) query.departmentId = departmentId;
  if (hiringManagerId) query.hiringManagerId = hiringManagerId;
  if (jobStatus) query.jobStatus = jobStatus;

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    JobPosition.find(query)
      .populate('departmentId', 'name')
      .populate('hiringManagerId', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    JobPosition.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

const createJob = async (data, organizationId, user) => {
  const job = await JobPosition.create({
    ...data,
    organizationId,
    createdBy: user._id
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_JOB_POSITION',
    entityType: 'JobPosition',
    entityId: job._id
  });

  return job;
};

const updateJob = async (id, data, organizationId, user) => {
  const job = await JobPosition.findOne({ _id: id, organizationId, status: 'active' });
  if (!job) throw new AppError(404, 'Job position not found');

  Object.assign(job, data);
  await job.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_JOB_POSITION',
    entityType: 'JobPosition',
    entityId: job._id
  });

  return job;
};

const deleteJob = async (id, organizationId, user) => {
  const job = await JobPosition.findOne({ _id: id, organizationId, status: 'active' });
  if (!job) throw new AppError(404, 'Job position not found');

  job.status = 'archived';
  await job.save();
  return null;
};

/**
 * ------------------------------------------------------------------
 * CANDIDATE METHODS
 * ------------------------------------------------------------------
 */

const getCandidates = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, search, recruitmentStatus, appliedForDepartment, sourceChannel, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };
  if (recruitmentStatus) query.recruitmentStatus = recruitmentStatus;
  if (appliedForDepartment) query.appliedForDepartment = appliedForDepartment;
  if (sourceChannel) query.sourceChannel = sourceChannel;

  if (search) {
    Object.assign(query, buildSearchQuery(search, ['firstName', 'lastName', 'email', 'mobile']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Candidate.find(query)
      .populate('appliedForDepartment', 'name')
      .populate('appliedForDesignation', 'title')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Candidate.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

const createCandidate = async (data, organizationId, user) => {
  // Check for uniqueness within org
  const exists = await Candidate.exists({ email: data.email, organizationId, status: 'active' });
  if (exists) {
    throw new AppError(400, 'Candidate with this email already exists in the organization');
  }

  const candidate = await Candidate.create({
    ...data,
    organizationId,
    createdBy: user._id,
    hrOwner: user.employeeId
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_CANDIDATE',
    entityType: 'Candidate',
    entityId: candidate._id
  });

  return candidate;
};

const changeCandidateStatus = async (id, data, organizationId, user) => {
  const candidate = await Candidate.findOne({ _id: id, organizationId, status: 'active' });
  if (!candidate) throw new AppError(404, 'Candidate not found');

  // Prevent moving a rejected/withdrawn candidate back without explicit reactivation API? 
  // We'll allow it for now per simple workflow, assuming HR knows what they are doing.
  
  candidate.recruitmentStatus = data.recruitmentStatus;
  if (data.rejectionReason) candidate.rejectionReason = data.rejectionReason;
  if (data.offerLetterUrl) candidate.offerLetterUrl = data.offerLetterUrl;

  await candidate.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_CANDIDATE_STATUS',
    entityType: 'Candidate',
    entityId: candidate._id,
    newValue: { recruitmentStatus: candidate.recruitmentStatus }
  });

  return candidate;
};

/**
 * ------------------------------------------------------------------
 * INTERVIEW SCHEDULING METHODS
 * ------------------------------------------------------------------
 */

const scheduleInterview = async (data, organizationId, user) => {
  // Validate candidate
  const candidate = await Candidate.findOne({ _id: data.candidateId, organizationId, status: 'active' });
  if (!candidate) throw new AppError(404, 'Candidate not found');

  const interview = await InterviewSchedule.create({
    ...data,
    organizationId,
    createdBy: user._id
  });

  // Auto update candidate status based on round
  if (candidate.recruitmentStatus === 'Applied' || candidate.recruitmentStatus === 'Screening') {
    candidate.recruitmentStatus = data.round === 'HR' ? 'HR Interview' : 'Technical Interview';
    await candidate.save();
  }

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SCHEDULE_INTERVIEW',
    entityType: 'InterviewSchedule',
    entityId: interview._id
  });

  return interview;
};

const submitInterviewFeedback = async (id, data, organizationId, user) => {
  const query = { _id: id, organizationId, status: 'active' };
  
  // If the user is a normal manager/employee (interviewer), they can only submit feedback for their own interviews
  if (user.role === 'MANAGER' || user.role === 'EMPLOYEE' || user.role === 'TEAM_LEAD') {
    query.interviewerId = user.employeeId;
  }

  const interview = await InterviewSchedule.findOne(query);
  if (!interview) throw new AppError(404, 'Interview not found or unauthorized');

  if (interview.interviewStatus === 'Completed') {
    throw new AppError(400, 'Feedback already submitted for this interview');
  }

  interview.feedbackScore = data.feedbackScore;
  interview.feedbackNotes = data.feedbackNotes;
  interview.recommendation = data.recommendation;
  interview.interviewStatus = data.interviewStatus || 'Completed';

  await interview.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SUBMIT_INTERVIEW_FEEDBACK',
    entityType: 'InterviewSchedule',
    entityId: interview._id
  });

  return interview;
};

const getInterviewsForCandidate = async (candidateId, organizationId) => {
  return InterviewSchedule.find({ candidateId, organizationId, status: 'active' })
    .populate('interviewerId', 'firstName lastName')
    .sort('-scheduledAt');
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getCandidates,
  createCandidate,
  changeCandidateStatus,
  scheduleInterview,
  submitInterviewFeedback,
  getInterviewsForCandidate,
};
