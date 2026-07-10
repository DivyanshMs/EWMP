const express = require('express');
const router = express.Router();
const controller = require('../controllers/assetController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/assetValidator');

router.use(verifyToken);

router.get(
  '/',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.AUDITOR]),
  controller.getAssetAllocations
);

router.patch(
  '/:id/return',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
  validateRequest(validator.returnAssetSchema),
  controller.returnAsset
);

module.exports = router;
