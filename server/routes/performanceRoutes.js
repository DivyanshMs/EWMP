const express = require('express');
const router = express.Router();
const controller = require('../controllers/performanceController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/performanceValidator');

router.use(verifyToken);

/**
 * ------------------------------------------------------------------
 * GOAL ROUTES
 * ------------------------------------------------------------------
 */

router.get(
  '/goals',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.searchGoalSchema),
  controller.getGoals
);

router.post(
  '/goals',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.createGoalSchema),
  controller.createGoal
);

router.patch(
  '/goals/:id/progress',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.updateGoalProgressSchema),
  controller.updateGoalProgress
);

router.patch(
  '/goals/:id/evaluate',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.evaluateGoalSchema),
  controller.evaluateGoal
);

router.delete(
  '/goals/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  controller.deleteGoal
);

/**
 * ------------------------------------------------------------------
 * PERFORMANCE REVIEW ROUTES
 * ------------------------------------------------------------------
 */

router.get(
  '/reviews',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.searchReviewSchema),
  controller.getReviews
);

router.get(
  '/reviews/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  controller.getReviewById
);

router.post(
  '/reviews',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  validateRequest(validator.createReviewSchema),
  controller.createReview
);

router.patch(
  '/reviews/:id/self-assessment',
  checkRole([ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.selfAssessmentSchema),
  controller.submitSelfAssessment
);

router.patch(
  '/reviews/:id/manager-assessment',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.managerAssessmentSchema),
  controller.submitManagerAssessment
);

router.patch(
  '/reviews/:id/finalize',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.hrAssessmentSchema),
  controller.finalizeReview
);

router.delete(
  '/reviews/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  controller.deleteReview
);

module.exports = router;
