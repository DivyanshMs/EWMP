/**
 * aiRoutes.js — Phase 1: AI Infrastructure Skeleton
 * Express routers for AI Assistant endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../../middleware/authMiddleware');
const { checkRole, ROLES } = require('../../middleware/rbacMiddleware');
const { validateRequest, validateQuery, validateParams } = require('../../middleware/validationMiddleware');
const { validateAiRequest, sanitizeAiResponse } = require('../security/securityMiddleware');
const {
  chatRequestSchema,
  summarizeRequestSchema,
  insightsRequestSchema,
  recommendationsRequestSchema,
  actionPlanRequestSchema,
  idParamSchema,
  paginationQuerySchema,
} = require('../validators/aiValidator');

const ALL_ROLES = Object.values(ROLES);
const LEADERSHIP_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ORG_ADMIN,
  ROLES.HR_MANAGER,
  ROLES.MANAGER,
  ROLES.FINANCE,
  ROLES.TEAM_LEAD,
  ROLES.AUDITOR,
];

// Health Check Endpoint
router.get(
  '/health',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.getHealthStatus
);

// Registered AI Plugins Endpoint
router.get(
  '/plugins',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.getPlugins
);

// AI Plugins Health Check Endpoint
router.get(
  '/plugins/health',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.getPluginsHealth
);

// AI Workflow Planning Endpoint
router.post(
  '/workflow',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.planWorkflow
);

// AI Workflow Simulation Endpoint
router.post(
  '/workflow/simulate',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.simulateWorkflow
);

// Get All Registered Workflows
router.get(
  '/workflows',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.getWorkflows
);

// Get Workflow Definition by ID
router.get(
  '/workflows/:id',
  verifyToken,
  checkRole(ALL_ROLES),
  aiController.getWorkflowById
);

// Conversational AI Chat Endpoint
router.post(
  '/chat',
  verifyToken,
  checkRole(ALL_ROLES),
  validateRequest(chatRequestSchema),
  validateAiRequest,
  sanitizeAiResponse,
  aiController.chat
);

// Summarization Endpoint
router.post(
  '/summarize',
  verifyToken,
  checkRole(ALL_ROLES),
  validateRequest(summarizeRequestSchema),
  validateAiRequest,
  sanitizeAiResponse,
  aiController.summarize
);

// Analytical Insights Endpoint
router.post(
  '/insights',
  verifyToken,
  checkRole(ALL_ROLES),
  validateRequest(insightsRequestSchema),
  validateAiRequest,
  sanitizeAiResponse,
  aiController.insights
);

// Predictive Recommendations Endpoint
router.post(
  '/recommendations',
  verifyToken,
  checkRole(ALL_ROLES),
  validateRequest(recommendationsRequestSchema),
  validateAiRequest,
  sanitizeAiResponse,
  aiController.recommendations
);

// AI Action Plan Preparation Endpoint
router.post(
  '/action-plan',
  verifyToken,
  checkRole(ALL_ROLES),
  validateRequest(actionPlanRequestSchema),
  validateAiRequest,
  sanitizeAiResponse,
  aiController.actionPlan
);

// Get Conversation History List
router.get(
  '/history',
  verifyToken,
  checkRole(ALL_ROLES),
  validateQuery(paginationQuerySchema),
  aiController.getHistory
);

// Get Single Conversation by ID
router.get(
  '/history/:id',
  verifyToken,
  checkRole(ALL_ROLES),
  validateParams(idParamSchema),
  aiController.getHistoryById
);

// Archive/Delete Conversation by ID
router.delete(
  '/history/:id',
  verifyToken,
  checkRole(ALL_ROLES),
  validateParams(idParamSchema),
  aiController.deleteHistory
);

module.exports = router;
