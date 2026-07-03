/**
 * uploadMiddleware.js
 * Multer File Upload Configuration
 * Configures memory storage, MIME type whitelists, and file size limits.
 * Files are staged in memory and streamed to Cloudinary — never written to disk.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            API_SPECIFICATION.md Section 14.3 (Supported File Types and Limits)
 *            DEVELOPMENT_ORDER.md ADR-308
 */

const multer = require('multer');
const AppError = require('../utils/AppError');
const { ALLOWED_MIME_TYPES, FILE_UPLOAD_LIMITS, ERROR_CODES } = require('../config/constants');

/**
 * Create a configured Multer middleware instance.
 * @param {string[]} allowedMimes - Array of permitted MIME types
 * @param {number} maxSizeMB - Maximum file size in megabytes
 * @returns {multer.Multer}
 */
const createUploader = (allowedMimes, maxSizeMB) => {
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          400,
          `Invalid file type. Allowed types: ${allowedMimes.join(', ')}`,
          ERROR_CODES.INVALID_FILE_TYPE
        ),
        false
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
  });
};

// ─── Pre-configured Upload Middleware Instances ────────────────────────────

/** For employee documents and ticket attachments (10MB, all document types) */
const uploadDocument = createUploader(
  ALLOWED_MIME_TYPES.DOCUMENTS,
  FILE_UPLOAD_LIMITS.DOCUMENT_MAX_MB
);

/** For profile photos and asset images (5MB, images only) */
const uploadPhoto = createUploader(ALLOWED_MIME_TYPES.IMAGES, FILE_UPLOAD_LIMITS.PHOTO_MAX_MB);

/** For candidate resumes (10MB, PDF only) */
const uploadResume = createUploader(ALLOWED_MIME_TYPES.RESUMES, FILE_UPLOAD_LIMITS.RESUME_MAX_MB);

module.exports = { uploadDocument, uploadPhoto, uploadResume, createUploader };
