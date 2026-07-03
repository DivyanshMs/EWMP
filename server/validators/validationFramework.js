/**
 * validationFramework.js
 * Shared Zod Validation Infrastructure
 * Exports reusable Zod primitive schemas and validation builders for common data types.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 6 (Validation Architecture)
 *            API_SPECIFICATION.md Section 11 (Request Validation Standards)
 *            DEVELOPMENT_ORDER.md ADR-306
 */

const { z } = require('zod');
const { PAGINATION, FILE_UPLOAD_LIMITS } = require('../config/constants');

/**
 * Reusable primitive schemas for common data formats.
 */

/** Validates a standard 24-character hex MongoDB ObjectId string */
const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid resource identifier format');

/** Validates email address format with automatic trimming and lowercase normalization */
const emailSchema = z.string().trim().email('Please provide a valid email address').toLowerCase();

/** Standard password policy: minimum 8 characters, at least 1 letter and 1 number */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/** Standard phone number string */
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please provide a valid phone number')
  .optional();

/** Validates an ISO date string (YYYY-MM-DD or full timestamp) */
const dateStringSchema = z
  .string()
  .trim()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please provide a valid ISO date string',
  });

/** Validates a URL string */
const urlSchema = z.string().trim().url('Please provide a valid URL string');

/** Validates a UUID v4 string */
const uuidSchema = z.string().trim().uuid('Please provide a valid UUID string');

/** Standard pagination query parameters schema */
const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default(String(PAGINATION.DEFAULT_PAGE))
    .transform((val) => parseInt(val, 10)),
  limit: z
    .string()
    .optional()
    .default(String(PAGINATION.DEFAULT_LIMIT))
    .transform((val) => Math.min(PAGINATION.MAX_LIMIT, parseInt(val, 10))),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc', '1', '-1']).optional().default('desc'),
  search: z.string().optional(),
});

/** Standard ObjectId URL parameter schema */
const idParamSchema = z.object({
  id: objectIdSchema,
});

/** Standard file upload validation schema */
const fileMetadataSchema = z.object({
  size: z
    .number()
    .max(FILE_UPLOAD_LIMITS.DOCUMENT_MAX_MB * 1024 * 1024, 'File size exceeds allowed limit'),
  mimetype: z.string().trim(),
});

module.exports = {
  z,
  objectIdSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  dateStringSchema,
  urlSchema,
  uuidSchema,
  paginationQuerySchema,
  idParamSchema,
  fileMetadataSchema,
};
