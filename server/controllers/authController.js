/**
 * authController.js — Phase 3: Authentication
 * Implements: API_SPECIFICATION.md Section 5
 * Delegates all business logic to authService.
 */

const authService = require('../services/authService');
const formatResponse = require('../utils/formatResponse');
const asyncHandler = require('../middleware/asyncHandler');
const config = require('../config/config');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.env === 'production',
  sameSite: 'Strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * POST /api/auth/login
 * Authenticate user and issue tokens.
 */
const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body);

  res.cookie('refreshToken', refreshToken, getCookieOptions());

  return formatResponse(res, 200, 'Login successful', { accessToken, user });
});

/**
 * POST /api/auth/logout
 * Clear refresh token cookie and invalidate stored token.
 */
const logout = asyncHandler(async (req, res) => {
  const userId = req.user ? req.user.userId : null;
  await authService.logout(userId);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'Strict',
  });

  return formatResponse(res, 200, 'Logged out successfully', null);
});

/**
 * POST /api/auth/refresh
 * Refresh access token using HTTP-only cookie.
 */
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;
  const { accessToken } = await authService.refresh(refreshToken);

  return formatResponse(res, 200, 'Token refreshed', { accessToken });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset email link.
 */
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  return formatResponse(
    res,
    200,
    'If an account with this email exists, a reset link has been sent.',
    null
  );
});

/**
 * POST /api/auth/reset-password/:token
 * Reset password using valid token.
 */
const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body);

  return formatResponse(res, 200, 'Password reset successful. Please log in.', null);
});

/**
 * PUT /api/auth/change-password
 * Change password for authenticated user.
 */
const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.userId, req.body);

  return formatResponse(res, 200, 'Password changed successfully', null);
});

/**
 * GET /api/auth/me
 * Retrieve profile of currently authenticated user.
 */
const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.userId);

  return formatResponse(res, 200, 'User profile retrieved', profile);
});

module.exports = {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
};
