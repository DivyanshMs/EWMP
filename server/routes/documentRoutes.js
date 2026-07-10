const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { uploadDocument } = require('../middleware/uploadMiddleware');
const validator = require('../validators/documentValidator');

router.use(verifyToken);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  validateRequest(validator.searchDocumentSchema),
  controller.getDocuments
);

router.post(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  uploadDocument.single('file'),
  validateRequest(validator.uploadDocumentSchema),
  controller.uploadDocument
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getDocumentById
);

router.put(
  '/:id/replace',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  uploadDocument.single('file'),
  controller.replaceDocument
);

router.patch(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  validateRequest(validator.updateDocumentSchema),
  controller.updateDocument
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.EMPLOYEE]),
  controller.softDeleteDocument
);

router.post(
  '/:id/restore',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER]),
  controller.restoreDocument
);

router.delete(
  '/:id/permanent',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
  controller.permanentDeleteDocument
);

module.exports = router;
