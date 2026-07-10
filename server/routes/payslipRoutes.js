const express = require('express');
const router = express.Router();
const controller = require('../controllers/payrollController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');

router.use(verifyToken);

router.get(
  '/my',
  controller.getMyPayslips
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.FINANCE, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getPayslipById
);

module.exports = router;
