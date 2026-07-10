const express = require('express');
const router = express.Router();
const controller = require('../controllers/recruitmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/recruitmentValidator');

router.use(verifyToken);

/**
 * ------------------------------------------------------------------
 * JOB POSITION ROUTES
 * ------------------------------------------------------------------
 */

router.get(
  '/jobs',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.searchJobSchema),
  controller.getJobs
);

router.post(
  '/jobs',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.createJobSchema),
  controller.createJob
);

router.put(
  '/jobs/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.updateJobSchema),
  controller.updateJob
);

router.delete(
  '/jobs/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  controller.deleteJob
);

/**
 * ------------------------------------------------------------------
 * CANDIDATE ROUTES
 * ------------------------------------------------------------------
 */

router.get(
  '/candidates',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  validateRequest(validator.searchCandidateSchema),
  controller.getCandidates
);

router.post(
  '/candidates',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.createCandidateSchema),
  controller.createCandidate
);

router.patch(
  '/candidates/:id/status',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.changeCandidateStatusSchema),
  controller.changeCandidateStatus
);

/**
 * ------------------------------------------------------------------
 * INTERVIEW SCHEDULING ROUTES
 * ------------------------------------------------------------------
 */

router.get(
  '/candidates/:id/interviews',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  controller.getInterviewsForCandidate
);

router.post(
  '/interviews',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.scheduleInterviewSchema),
  controller.scheduleInterview
);

router.patch(
  '/interviews/:id/feedback',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.interviewFeedbackSchema),
  controller.submitInterviewFeedback
);

module.exports = router;
