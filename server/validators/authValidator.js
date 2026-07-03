/**
 * authValidator.js — Phase 3
 * Zod Request Validation Schemas for Authentication Endpoints
 *
 * Authority: API_SPECIFICATION.md Section 5
 *            ARCHITECTURE_REVISION.md Section 8.5 (Password Security)
 */

const { z, emailSchema } = require('./validationFramework');

const complexPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z
  .object({
    password: complexPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: complexPasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

module.exports = {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  complexPasswordSchema,
};
