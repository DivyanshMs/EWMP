const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/projectValidator');

router.use(verifyToken);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getProjects
);

router.post(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER]),
  validateRequest(validator.createProjectSchema),
  controller.createProject
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getProjectById
);

router.put(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER]),
  validateRequest(validator.updateProjectSchema),
  controller.updateProject
);

router.patch(
  '/:id/status',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER]),
  validateRequest(validator.updateStatusSchema),
  controller.updateProjectStatus
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER]),
  controller.deleteProject
);

module.exports = router;
