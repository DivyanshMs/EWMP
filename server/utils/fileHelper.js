/**
 * fileHelper.js
 * Standardized File and Attachment Management Utility
 * Wraps cloud upload functionality and provides file inspection helpers.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            API_SPECIFICATION.md Section 14 (File Upload APIs)
 */

const { uploadToCloudinary, deleteFromCloudinary } = require('./fileUploadUtil');
const { ALLOWED_MIME_TYPES } = require('../config/constants');

/**
 * Extract extension from a filename.
 * @param {string} filename
 * @returns {string}
 */
const getFileExtension = (filename = '') => {
  return filename.split('.').pop().toLowerCase();
};

/**
 * Formats bytes into human-readable size (KB, MB).
 * @param {number} bytes
 * @returns {string}
 */
const formatFileSize = (bytes = 0) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Checks if a MIME type belongs to a specific category.
 * @param {string} mimetype
 * @param {'DOCUMENTS'|'IMAGES'|'RESUMES'} category
 * @returns {boolean}
 */
const isValidMimeType = (mimetype, category = 'DOCUMENTS') => {
  const allowedList = ALLOWED_MIME_TYPES[category] || [];
  return allowedList.includes(mimetype);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getFileExtension,
  formatFileSize,
  isValidMimeType,
};
