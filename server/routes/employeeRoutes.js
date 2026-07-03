/**
 * employeeRoutes.js — Phase 4A: Employee Management
 * Enforces JWT authentication, role-based access control (RBAC), and Zod schema validation
 * across all 12 Employee Management REST API endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 6.6 & 7.13
 *            ARCHITECTURE_REVISION.md Section 5 & 9
 *            DEVELOPMENT_ORDER.md Step 21
 */

const router = require('express').Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest, validateQuery, validateParams } = require('../middleware/validationMiddleware');
const { uploadDocument, uploadPhoto } = require('../middleware/uploadMiddleware');
const {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateStatusSchema,
  uploadDocumentSchema,
  verifyDocumentSchema,
} = require('../validators/employeeValidator');
const { idParamSchema, paginationQuerySchema, z, objectIdSchema } = require('../validators/validationFramework');

const allRoles = Object.values(ROLES);
const adminAndHr = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER];
const readListRoles = [ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.MANAGER, ROLES.FINANCE, ROLES.AUDITOR];

const docParamSchema = z.object({
  id: objectIdSchema,
  docId: objectIdSchema,
});

// Enforce JWT verification across all employee endpoints
router.use(verifyToken);

// ─── Collection Routes (/api/employees) ─────────────────────────────────────

router
  .route('/')
  .get(
    checkRole(readListRoles),
    validateQuery(paginationQuerySchema),
    employeeController.getEmployees
  )
  .post(
    checkRole(adminAndHr),
    validateRequest(createEmployeeSchema),
    employeeController.createEmployee
  );

// ─── Document Routes (/api/employees/:id/documents) ─────────────────────────

router
  .route('/:id/documents')
  .get(
    checkRole(allRoles),
    validateParams(idParamSchema),
    employeeController.listEmployeeDocuments
  )
  .post(
    checkRole(allRoles),
    validateParams(idParamSchema),
    uploadDocument.single('file'),
    validateRequest(uploadDocumentSchema),
    employeeController.uploadEmployeeDocument
  );

router.patch(
  '/:id/documents/:docId/verify',
  checkRole(adminAndHr),
  validateParams(docParamSchema),
  validateRequest(verifyDocumentSchema),
  employeeController.verifyEmployeeDocument
);

router.delete(
  '/:id/documents/:docId',
  checkRole(adminAndHr),
  validateParams(docParamSchema),
  employeeController.deleteEmployeeDocument
);

// ─── Sub-resource Routes (/api/employees/:id/...) ───────────────────────────

router.patch(
  '/:id/status',
  checkRole(adminAndHr),
  validateParams(idParamSchema),
  validateRequest(updateStatusSchema),
  employeeController.updateEmploymentStatus
);

router.get(
  '/:id/timeline',
  checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN, ROLES.HR_MANAGER, ROLES.AUDITOR]),
  validateParams(idParamSchema),
  employeeController.getEmployeeTimeline
);

router.patch(
  '/:id/photo',
  checkRole(allRoles),
  validateParams(idParamSchema),
  uploadPhoto.single('file'),
  employeeController.updateProfilePhoto
);

// ─── Individual Resource Routes (/api/employees/:id) ────────────────────────

router
  .route('/:id')
  .get(
    checkRole(allRoles),
    validateParams(idParamSchema),
    employeeController.getEmployeeById
  )
  .put(
    checkRole(adminAndHr),
    validateParams(idParamSchema),
    validateRequest(updateEmployeeSchema),
    employeeController.updateEmployee
  )
  .delete(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    validateParams(idParamSchema),
    employeeController.archiveEmployee
  );

module.exports = router;
