const express = require('express');
const router = express.Router();
const controller = require('../controllers/helpDeskController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/helpDeskValidator');

router.use(verifyToken);

router.get(
  '/my',
  controller.getMyTickets
);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  validateRequest(validator.searchTicketSchema),
  controller.getTickets
);

router.post(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.createTicketSchema),
  controller.createTicket
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getTicketById
);

router.put(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.updateTicketSchema),
  controller.updateTicket
);

router.patch(
  '/:id/assign',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER]),
  validateRequest(validator.assignTicketSchema),
  controller.assignTicket
);

router.patch(
  '/:id/status',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.changeStatusSchema),
  controller.changeTicketStatus
);

router.post(
  '/:id/comments',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.addCommentSchema),
  controller.addComment
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN]),
  controller.deleteTicket
);

module.exports = router;
