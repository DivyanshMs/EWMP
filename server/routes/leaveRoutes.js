/**
 * leaveRoutes.js — Phase 4B: Leave Management Module
 * Express routers for Leave Types, Leave Balances, and Leave Requests.
 *
 * Authority: API_SPECIFICATION.md Section 7.2, 7.4, 7.5
 */

const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest, validateQuery, validateParams } = require('../middleware/validationMiddleware');
const { idParamSchema, paginationQuerySchema } = require('../validators/validationFramework');
const {
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
  leaveBalanceQuerySchema,
  myLeaveBalanceQuerySchema,
  leaveRequestQuerySchema,
  myLeaveRequestQuerySchema,
  submitLeaveRequestSchema,
  approveLeaveRequestSchema,
  rejectLeaveRequestSchema,
  cancelLeaveRequestSchema,
} = require('../validators/leaveValidator');

// All leave endpoints require authentication
router.use(verifyToken);

// ─── Sub-router: Leave Types (/api/leave-types) ──────────────────────────────
const leaveTypeRouter = express.Router();

leaveTypeRouter.route('/')
  .get(
    validateQuery(paginationQuerySchema),
    leaveController.getTypes
  )
  .post(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
    validateRequest(createLeaveTypeSchema),
    leaveController.createType
  );

leaveTypeRouter.route('/:id')
  .get(
    validateParams(idParamSchema),
    leaveController.getTypeById
  )
  .put(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
    validateParams(idParamSchema),
    validateRequest(updateLeaveTypeSchema),
    leaveController.updateType
  )
  .delete(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    validateParams(idParamSchema),
    leaveController.archiveType
  );

// ─── Sub-router: Leave Balances (/api/leave-balances) ────────────────────────
const leaveBalanceRouter = express.Router();

leaveBalanceRouter.route('/my')
  .get(
    validateQuery(myLeaveBalanceQuerySchema),
    leaveController.getMyBalances
  );

leaveBalanceRouter.route('/')
  .get(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
    validateQuery(leaveBalanceQuerySchema),
    leaveController.getBalances
  );

// ─── Sub-router: Leave Requests (/api/leave-requests) ────────────────────────
const leaveRequestRouter = express.Router();

leaveRequestRouter.route('/my')
  .get(
    validateQuery(myLeaveRequestQuerySchema),
    leaveController.getMyRequests
  );

leaveRequestRouter.route('/')
  .get(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.FINANCE, ROLES.AUDITOR]),
    validateQuery(leaveRequestQuerySchema),
    leaveController.getRequests
  )
  .post(
    validateRequest(submitLeaveRequestSchema),
    leaveController.submitRequest
  );

leaveRequestRouter.route('/:id')
  .get(
    validateParams(idParamSchema),
    leaveController.getRequestById
  );

leaveRequestRouter.route('/:id/approve')
  .patch(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
    validateParams(idParamSchema),
    validateRequest(approveLeaveRequestSchema),
    leaveController.approveRequest
  );

leaveRequestRouter.route('/:id/reject')
  .patch(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
    validateParams(idParamSchema),
    validateRequest(rejectLeaveRequestSchema),
    leaveController.rejectRequest
  );

leaveRequestRouter.route('/:id/cancel')
  .patch(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
    validateParams(idParamSchema),
    validateRequest(cancelLeaveRequestSchema),
    leaveController.cancelRequest
  );

// ─── Router Dispatch based on Base URL ───────────────────────────────────────
router.use((req, res, next) => {
  if (req.baseUrl && req.baseUrl.includes('leave-types')) {
    return leaveTypeRouter(req, res, next);
  }
  if (req.baseUrl && req.baseUrl.includes('leave-balances')) {
    return leaveBalanceRouter(req, res, next);
  }
  return leaveRequestRouter(req, res, next);
});

module.exports = router;
