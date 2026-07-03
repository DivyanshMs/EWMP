/**
 * organizationRoutes.js — Phase 4A: Organization Management Module
 * Routes for Organization and System Settings endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 6.1
 *            DEVELOPMENT_ORDER.md Step 21
 */

const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole, ROLES } = require('../middleware/rbacMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const { updateOrganizationSchema, updateSettingsSchema } = require('../validators/organizationValidator');

// Apply authentication to all organization routes
router.use(verifyToken);

// ─── Organization Settings Endpoints ─────────────────────────────────────────
router
  .route('/settings')
  .get(organizationController.getSettings)
  .put(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    validateRequest(updateSettingsSchema),
    organizationController.updateSettings
  );

// ─── Current Organization Endpoints ──────────────────────────────────────────
router
  .route('/current')
  .get(organizationController.getCurrentOrganization)
  .put(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    validateRequest(updateOrganizationSchema),
    organizationController.updateCurrentOrganization
  );

// ─── Support for root '/' when mounted at /api/settings or /api/organizations ──
router
  .route('/')
  .get((req, res, next) => {
    if (req.baseUrl && req.baseUrl.includes('settings')) {
      return organizationController.getSettings(req, res, next);
    }
    return organizationController.getCurrentOrganization(req, res, next);
  })
  .put((req, res, next) => {
    if (req.baseUrl && req.baseUrl.includes('settings')) {
      return checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN])(req, res, () =>
        validateRequest(updateSettingsSchema)(req, res, () =>
          organizationController.updateSettings(req, res, next)
        )
      );
    }
    return checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN])(req, res, () =>
      validateRequest(updateOrganizationSchema)(req, res, () =>
        organizationController.updateCurrentOrganization(req, res, next)
      )
    );
  });

// ─── ID-based Endpoints (e.g. /api/organizations/:id) ───────────────────────
router
  .route('/:id')
  .get(organizationController.getOrganizationById)
  .put(
    checkRole([ROLES.SUPER_ADMIN, ROLES.ORG_ADMIN]),
    validateRequest(updateOrganizationSchema),
    organizationController.updateOrganizationById
  );

module.exports = router;
