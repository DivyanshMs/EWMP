/**
 * authRoutes.js — Phase 3
 * Defines all authentication routes and attaches validation, rate-limiting, and security middleware.
 *
 * Authority: API_SPECIFICATION.md Section 5
 *            ARCHITECTURE_REVISION.md Section 8
 */

const router = require('express').Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimitMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');
const {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/authValidator');

// Public Routes (Rate limited)
router.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
router.post(
  '/forgot-password',
  authRateLimiter,
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  '/reset-password/:token',
  validateRequest(resetPasswordSchema),
  authController.resetPassword
);

// Token Management (Public / Refresh Token via Cookie)
router.post('/refresh', authController.refresh);

// Protected Routes (Require Access Token)
router.post('/logout', verifyToken, authController.logout);
router.put(
  '/change-password',
  verifyToken,
  validateRequest(changePasswordSchema),
  authController.changePassword
);
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
