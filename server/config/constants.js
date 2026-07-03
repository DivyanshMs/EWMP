/**
 * constants.js
 * Global System Constants and Enumerations
 * Centralizes system-wide constants to avoid magic numbers and strings.
 *
 * Authority: PROJECT_MASTER.md (User Roles)
 *            API_SPECIFICATION.md Section 12 (Response Standards)
 *            ARCHITECTURE_REVISION.md
 */

/**
 * 9 Valid EWMP User Roles per PROJECT_MASTER.md
 */
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  FINANCE: 'FINANCE',
  MANAGER: 'MANAGER',
  TEAM_LEAD: 'TEAM_LEAD',
  EMPLOYEE: 'EMPLOYEE',
  IT_ADMIN: 'IT_ADMIN',
  AUDITOR: 'AUDITOR',
};

/**
 * Standard HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Standard Machine-Readable Error Codes
 */
const ERROR_CODES = {
  OPERATIONAL_ERROR: 'OPERATIONAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  TOKEN_MISSING: 'TOKEN_MISSING',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  INVALID_ID: 'INVALID_ID',
  INSUFFICIENT_ROLE: 'INSUFFICIENT_ROLE',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
};

/**
 * Pagination Defaults and Limits
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * File Upload Size Limits (in MB)
 */
const FILE_UPLOAD_LIMITS = {
  DOCUMENT_MAX_MB: 10,
  PHOTO_MAX_MB: 5,
  RESUME_MAX_MB: 10,
};

/**
 * Allowed MIME Types for Uploads
 */
const ALLOWED_MIME_TYPES = {
  DOCUMENTS: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  IMAGES: ['image/jpeg', 'image/png'],
  RESUMES: ['application/pdf'],
};

module.exports = {
  ROLES,
  HTTP_STATUS,
  ERROR_CODES,
  PAGINATION,
  FILE_UPLOAD_LIMITS,
  ALLOWED_MIME_TYPES,
};
