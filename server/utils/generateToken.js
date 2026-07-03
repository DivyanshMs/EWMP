/**
 * generateToken.js
 * JWT Token Generation, Verification, and Hashing Utilities
 *
 * Authority: ARCHITECTURE_REVISION.md Section 8 (Authentication Architecture)
 *            API_SPECIFICATION.md Section 15 (API Security Standards)
 *            DEVELOPMENT_ORDER.md ADR-302
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');

/**
 * Generate a short-lived JWT access token.
 * @param {object} payload - { userId, role, organizationId }
 * @returns {string} Signed JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessExpiry,
  });
};

/**
 * Generate a long-lived refresh token.
 * Stored as an HTTP-only cookie on the client.
 * @param {object} payload - { userId }
 * @returns {string} Signed refresh JWT
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });
};

/**
 * Verify an access token and return decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload { userId, role, organizationId, iat, exp }
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Verify a refresh token and return decoded payload.
 * @param {string} token
 * @returns {object} Decoded payload { userId, iat, exp }
 * @throws {JsonWebTokenError | TokenExpiredError}
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret);
};

/**
 * Hash a sensitive string (such as a refresh token or password reset token) using SHA-256.
 * Used before storing tokens in MongoDB for secure comparison.
 * @param {string} token
 * @returns {string} SHA-256 hex hash
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
