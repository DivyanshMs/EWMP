const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/attendanceValidator');

router.use(verifyToken);

router.post(
  '/clock-in',
  checkRole([ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.clockInSchema),
  controller.clockIn
);

router.patch(
  '/clock-out',
  checkRole([ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.clockOutSchema),
  controller.clockOut
);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.FINANCE, ROLES.AUDITOR]),
  controller.getAttendance
);

router.get(
  '/my',
  controller.getMyAttendance
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.AUDITOR]),
  controller.getAttendanceById
);

router.post(
  '/:id/correction',
  checkRole([ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.correctionRequestSchema),
  controller.requestCorrection
);

router.patch(
  '/:id/correction/approve',
  checkRole([ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  validateRequest(validator.correctionApproveSchema),
  controller.approveCorrection
);

module.exports = router;
