const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const validator = require('../validators/departmentValidator');

router.use(verifyToken);

router.route('/')
  .get(controller.getAll)
  .post(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
    validateRequest(validator.createDepartmentSchema),
    controller.create
  );

router.route('/:id')
  .get(controller.getById)
  .put(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER]),
    validateRequest(validator.updateDepartmentSchema),
    controller.update
  )
  .delete(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    controller.remove
  );

module.exports = router;
