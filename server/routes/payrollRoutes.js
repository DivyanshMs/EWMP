const express = require('express');
const router = express.Router();
const controller = require('../controllers/payrollController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/payrollValidator');

router.use(verifyToken);

router.post(
  '/process',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.FINANCE]),
  validateRequest(validator.processPayrollSchema),
  controller.processPayroll
);

router.get(
  '/my',
  controller.getMyPayrolls
);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.FINANCE, ROLES.AUDITOR]),
  controller.getPayrolls
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.FINANCE, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getPayrollById
);

router.patch(
  '/:id/approve',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.FINANCE]),
  controller.approvePayroll
);

router.patch(
  '/:id/mark-paid',
  checkRole([ROLES.SUPER_ADMIN, ROLES.FINANCE]),
  controller.markPaid
);

module.exports = router;
