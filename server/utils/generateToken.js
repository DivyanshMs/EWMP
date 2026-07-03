/**
 * generateToken.js
 * JWT Token Generation and Verification Utilities
 *
 * Authority: ARCHITECTURE_REVISION.md Section 8 (Authentication Architecture)
 *            API_SPECIFICATION.md Section 15 (API Security Standards)
 *            DEVELOPMENT_ORDER.md ADR-302
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived JWT access token.
 * @param {object} payload - { userId, role, organizationId }
 * @returns {string} Signed JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

/**
 * Generate a long-lived refresh token.
 * Stored as an HTTP-only cookie on the client.
 * @param {object} payload - { userId }
 * @returns {string} Signed refresh JWT
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

/**
 * Verify an access token and return decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload { userId, role, organizationId, iat, exp }
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify a refresh token and return decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload { userId, iat, exp }
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
