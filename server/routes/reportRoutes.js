const express = require('express');
const router = express.Router();
const controller = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/reportValidator');

router.use(verifyToken);

// Dashboards
router.get(
  '/dashboard/executive',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.AUDITOR]),
  controller.getExecutiveDashboard
);

router.get(
  '/dashboard/hr',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.AUDITOR]),
  controller.getHRDashboard
);

router.get(
  '/dashboard/manager',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  controller.getManagerDashboard
);

router.get(
  '/dashboard/employee',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  controller.getEmployeeDashboard
);

// Reports
const reportRoles = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.AUDITOR, ROLES.MANAGER];

router.get(
  '/attendance',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getAttendanceReport
);

router.get(
  '/leave',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getLeaveReport
);

router.get(
  '/payroll',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.AUDITOR]), // More restricted
  validateRequest(validator.dateRangeSchema),
  controller.getPayrollReport
);

router.get(
  '/projects',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getProjectReport
);

router.get(
  '/tasks',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getTaskReport
);

router.get(
  '/helpdesk',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getHelpDeskReport
);

router.get(
  '/assets',
  checkRole(reportRoles),
  validateRequest(validator.dateRangeSchema),
  controller.getAssetReport
);

module.exports = router;
