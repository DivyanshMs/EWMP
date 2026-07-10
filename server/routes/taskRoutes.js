const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/taskValidator');

router.use(verifyToken);

router.get(
  '/my',
  controller.getMyTasks
);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getTasks
);

router.post(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  validateRequest(validator.createTaskSchema),
  controller.createTask
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getTaskById
);

router.put(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.updateTaskSchema),
  controller.updateTask
);

router.patch(
  '/:id/status',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.updateTaskStatusSchema),
  controller.updateTaskStatus
);

router.post(
  '/:id/comments',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.TEAM_LEAD, ROLES.EMPLOYEE]),
  validateRequest(validator.addCommentSchema),
  controller.addComment
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.MANAGER, ROLES.TEAM_LEAD]),
  controller.deleteTask
);

module.exports = router;
