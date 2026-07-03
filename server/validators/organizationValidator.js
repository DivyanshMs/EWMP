/**
 * organizationValidator.js — Phase 4A: Organization Management Module
 * Zod schemas for Organization and SystemSettings endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 6.1
 *            DEVELOPMENT_ORDER.md Step 20
 */

const { z, emailSchema, urlSchema } = require('./validationFramework');

const addressSchema = z.union([
  z.string().trim().max(500),
  z.object({
    street: z.string().trim().max(200).optional(),
    city: z.string().trim().max(100).optional(),
    state: z.string().trim().max(100).optional(),
    country: z.string().trim().max(100).optional(),
    pincode: z.string().trim().max(10).optional(),
    postalCode: z.string().trim().max(10).optional(),
  })
]).optional();

const updateOrganizationSchema = z.object({
  name: z.string().trim().min(2, 'Organization name must be at least 2 characters').max(100, 'Organization name cannot exceed 100 characters').optional(),
  phone: z.string().trim().min(3, 'Phone number must be valid length').max(25, 'Phone number must be valid length').optional().nullable(),
  email: z.union([emailSchema, z.literal('')]).optional().nullable(),
  website: z.union([urlSchema, z.literal('')]).optional().nullable(),
  logoUrl: z.string().trim().optional().nullable(),
  logo: z.string().trim().optional().nullable(),
  address: addressSchema,
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  postalCode: z.string().trim().max(10).optional(),
  pincode: z.string().trim().max(10).optional(),
  timezone: z.string().trim().min(1, 'Timezone is required').optional(),
  currency: z.string().trim().min(1, 'Currency is required').uppercase().optional(),
  industry: z.string().trim().max(100).optional(),
});

const updateSettingsSchema = z.object({
  timezone: z.string().trim().min(1, 'Timezone is required').optional(),
  currency: z.string().trim().min(1, 'Currency is required').uppercase().optional(),
  dateFormat: z.string().trim().min(1, 'Date format is required').optional(),
  language: z.string().trim().min(1, 'Language is required').optional(),
  workingDays: z.array(z.string()).optional(),
  workingDaysPerWeek: z.number().min(1).max(7).optional(),
  defaultShift: z.string().trim().min(1).optional(),
  payrollCycle: z.string().trim().min(1).optional(),
  attendanceSettings: z.any().optional(),
  leaveSettings: z.any().optional(),
  payrollSettings: z.any().optional(),
  notificationSettings: z.any().optional(),
  aiSettings: z.any().optional(),
  fiscalYearStart: z.number().min(1).max(12).optional(),
});

module.exports = {
  updateOrganizationSchema,
  updateSettingsSchema,
};
