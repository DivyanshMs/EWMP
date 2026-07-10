/**
 * authMiddleware.js
 * JWT Token Verification Middleware
 * Verifies Bearer token, decodes payload, attaches req.user.
 * Applied to all protected routes before the controller.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 8 (Authentication Architecture)
 *            API_SPECIFICATION.md Section 15.1 (Authentication Contract)
 *            DEVELOPMENT_ORDER.md ADR-302
 */

const { verifyAccessToken } = require('../utils/generateToken');
const { UnauthorizedError } = require('../utils/AppError');
const { ERROR_CODES } = require('../config/constants');

/**
 * verifyToken middleware
 * Extracts JWT from Authorization header, verifies, and attaches decoded payload to req.user.
 * @throws {UnauthorizedError} 401 if token is missing, invalid, or expired
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(
        'Authentication required. Please log in.',
        ERROR_CODES.TOKEN_MISSING
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Attach decoded payload to req.user for downstream middleware and controllers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      organizationId: decoded.organizationId,
      employeeId: decoded.employeeId || null,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken };
