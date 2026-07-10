const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/assetValidator');

router.use(verifyToken);

router.get(
  '/my',
  controller.getMyAssets
);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getAssets
);

router.post(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN]),
  validateRequest(validator.createAssetSchema),
  controller.createAsset
);

router.get(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.AUDITOR]),
  controller.getAssetById
);

router.put(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN]),
  validateRequest(validator.updateAssetSchema),
  controller.updateAsset
);

router.post(
  '/:id/allocate',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN]),
  validateRequest(validator.allocateAssetSchema),
  controller.allocateAsset
);

router.delete(
  '/:id',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.IT_ADMIN]),
  controller.deleteAsset
);

module.exports = router;
