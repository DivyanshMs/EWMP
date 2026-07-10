/**
 * authService.js — Phase 3
 * Business logic for authentication, token management, password operations.
 *
 * Authority: API_SPECIFICATION.md Section 5
 *            ARCHITECTURE_REVISION.md Section 8 (Authentication Architecture)
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
require('../models/Organization'); // Ensure Organization model is registered for populate
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/generateToken');
const { UnauthorizedError, NotFoundError, AppError } = require('../utils/AppError');
const { ERROR_CODES } = require('../config/constants');
const config = require('../config/config');
const sendEmail = require('../utils/sendEmail');
const logger = require('../config/logger');

/**
 * Authenticate user credentials, handle login lockout rules, and issue JWT tokens.
 * @param {object} credentials { email, password }
 * @returns {Promise<{ accessToken: string, refreshToken: string, user: object }>}
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+passwordHash +refreshToken'
  );

  if (!user) {
    throw new UnauthorizedError('Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (user.isAccountLocked()) {
    throw new AppError(
      'Account is locked due to too many failed login attempts. Please try again later or contact IT support.',
      422,
      'ACCOUNT_LOCKED'
    );
  }

  if (!user.isActive || user.status !== 'active') {
    throw new AppError('Account is inactive or archived.', 422, 'ACCOUNT_INACTIVE');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      logger.warn(`User account locked due to 5 failed attempts: ${user.email}`);
    }
    await user.save();
    throw new UnauthorizedError('Invalid email or password.', ERROR_CODES.INVALID_CREDENTIALS);
  }

  // Success: Reset lockout state
  user.failedLoginAttempts = 0;
  user.isLocked = false;
  user.lockUntil = null;
  user.lastLoginAt = new Date();

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    organizationId: user.organizationId ? user.organizationId.toString() : null,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id.toString(),
  });

  user.refreshToken = hashToken(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      employeeId: user.employeeId || null,
    },
  };
};

/**
 * Log out user by clearing stored refresh token in DB.
 * @param {string} userId
 * @returns {Promise<void>}
 */
const logout = async (userId) => {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
};

/**
 * Validate incoming refresh token from cookie and issue new access token.
 * @param {string} incomingRefreshToken
 * @returns {Promise<{ accessToken: string }>}
 */
const refresh = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new UnauthorizedError('Refresh token is required.', ERROR_CODES.TOKEN_MISSING);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token.', ERROR_CODES.TOKEN_EXPIRED);
  }

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user || !user.isActive || user.status !== 'active' || user.isAccountLocked()) {
    throw new UnauthorizedError('User account is invalid or locked.', ERROR_CODES.TOKEN_INVALID);
  }

  const hashedIncoming = hashToken(incomingRefreshToken);
  if (user.refreshToken !== hashedIncoming) {
    // Possible token reuse attack or already logged out
    user.refreshToken = null;
    await user.save();
    logger.warn(`Refresh token mismatch for user ${user.email}. Tokens cleared.`);
    throw new UnauthorizedError('Invalid refresh token.', ERROR_CODES.TOKEN_INVALID);
  }

  const accessToken = generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
    organizationId: user.organizationId ? user.organizationId.toString() : null,
  });

  return { accessToken };
};

/**
 * Initiate password reset flow by sending a transactional email with token link.
 * Always returns true regardless of email existence to prevent user enumeration.
 * @param {string} email
 * @returns {Promise<boolean>}
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive || user.status !== 'active') {
    return true; // Return true silently for security
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
  await user.save();

  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
  const html = `
    <h3>Password Reset Request</h3>
    <p>You requested a password reset for your EWMP account.</p>
    <p>Click the link below to set a new password. This link is valid for 1 hour.</p>
    <a href="${resetUrl}" style="padding:10px 15px;background-color:#0066cc;color:#fff;text-decoration:none;border-radius:4px;">Reset Password</a>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'EWMP Password Reset Request',
    html,
  });

  return true;
};

/**
 * Complete password reset flow using valid token.
 * @param {string} token - Raw reset token from email link
 * @param {object} payload - { password }
 * @returns {Promise<boolean>}
 */
const resetPassword = async (token, { password }) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiry: { $gt: new Date() },
  }).select('+passwordHash +passwordResetToken +passwordResetExpiry');

  if (!user) {
    throw new AppError('Invalid or expired password reset token.', 422, 'TOKEN_INVALID');
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  user.passwordResetToken = null;
  user.passwordResetExpiry = null;
  user.isLocked = false;
  user.lockUntil = null;
  user.failedLoginAttempts = 0;
  user.refreshToken = null; // Invalidate all existing sessions

  await user.save();
  return true;
};

/**
 * Change authenticated user's password.
 * @param {string} userId
 * @param {object} payload - { currentPassword, newPassword }
 * @returns {Promise<boolean>}
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) {
    throw new NotFoundError('User not found.');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect.', ERROR_CODES.INVALID_CREDENTIALS);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.refreshToken = null; // Invalidate other sessions
  await user.save();
  return true;
};

/**
 * Retrieve current authenticated user profile and organization details.
 * @param {string} userId
 * @returns {Promise<object>}
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('organizationId');
  if (!user) {
    throw new NotFoundError('User profile not found.');
  }

  let employeeData = null;
  if (user.employeeId && mongoose.models.Employee) {
    try {
      const employee = await mongoose.model('Employee').findById(user.employeeId);
      if (employee) {
        employeeData = {
          _id: employee._id,
          employeeId: employee.employeeId,
          firstName: employee.firstName,
          lastName: employee.lastName,
          profilePhotoUrl: employee.profilePhotoUrl || null,
          departmentId: employee.departmentId,
          designationId: employee.designationId,
        };
      }
    } catch (err) {
      logger.warn(`Could not populate employee data for user ${userId}: ${err.message}`);
    }
  }

  return {
    _id: user._id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    employee: employeeData,
  };
};

module.exports = {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
};
