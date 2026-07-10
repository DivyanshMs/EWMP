/**
 * rbacMiddleware.js
 * Role-Based Access Control Middleware
 * Enforces role permissions after token verification.
 * Applied AFTER verifyToken on all role-restricted routes.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 9 (Authorization Architecture)
 *            API_SPECIFICATION.md Section 15.2 (Authorization Contract)
 *            PROJECT_MASTER.md (9 User Roles definition)
 *            DEVELOPMENT_ORDER.md ADR-302
 */

const AppError = require('../utils/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');

/**
 * Role check middleware factory.
 * Returns a middleware function that allows only the specified roles.
 *
 * Usage in routes:
 *   router.get('/', verifyToken, checkRole([ROLES.HR_MANAGER, ROLES.SUPER_ADMIN]), controller)
 *
 * @param {string[]} allowedRoles - Array of permitted role strings
 * @returns {function} Express middleware
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required.', ERROR_CODES.TOKEN_MISSING));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          'You do not have permission to perform this action.',
          ERROR_CODES.INSUFFICIENT_ROLE
        )
      );
    }

    next();
  };
};

module.exports = { checkRole, ROLES };
