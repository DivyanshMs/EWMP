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

// ─── MIME Type Whitelists ──────────────────────────────────────────────────

const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];

const RESUME_MIME_TYPES = ['application/pdf'];

// ─── Multer Factory ────────────────────────────────────────────────────────

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
          'INVALID_FILE_TYPE'
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
const uploadDocument = createUploader(DOCUMENT_MIME_TYPES, 10);

/** For profile photos and asset images (5MB, images only) */
const uploadPhoto = createUploader(IMAGE_MIME_TYPES, 5);

/** For candidate resumes (10MB, PDF only) */
const uploadResume = createUploader(RESUME_MIME_TYPES, 10);

module.exports = { uploadDocument, uploadPhoto, uploadResume };
