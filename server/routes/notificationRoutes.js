const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/notificationValidator');

router.use(verifyToken);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  validateRequest(validator.searchNotificationSchema),
  controller.getMyNotifications
);

router.get(
  '/org',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.AUDITOR]),
  validateRequest(validator.searchNotificationSchema),
  controller.getOrgNotifications
);

router.get(
  '/announcements',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getAnnouncements
);

router.post(
  '/send',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  validateRequest(validator.sendNotificationSchema),
  controller.sendNotification
);

router.post(
  '/broadcast',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.broadcastNotificationSchema),
  controller.broadcastAnnouncement
);

router.patch(
  '/:id/read',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  controller.markAsRead
);

router.post(
  '/read-all',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  controller.markAllAsRead
);

router.post(
  '/bulk-delete',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.bulkDeleteSchema),
  controller.bulkDelete
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  controller.deleteNotification
);

router.get(
  '/preferences',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  controller.getPreferences
);

module.exports = router;
