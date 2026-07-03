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
const AppError = require('../utils/AppError');

/**
 * verifyToken middleware
 * Extracts JWT from Authorization header, verifies, and attaches decoded payload to req.user.
 * @throws {AppError} 401 if token is missing, invalid, or expired
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Authentication required. Please log in.', 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    // Attach decoded payload to req.user for downstream middleware and controllers
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyToken };
