/**
 * cloudinary.js
 * Cloudinary SDK Configuration
 * Initializes the Cloudinary v2 SDK for file storage operations.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            API_SPECIFICATION.md Section 14 (File Upload Architecture)
 */

const cloudinary = require('cloudinary').v2;
const config = require('./config');
const { logInfo } = require('../utils/loggerHelper');

const configureCloudinary = () => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    return;
  }
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });

  logInfo('✅ Cloudinary configured');
};

module.exports = { cloudinary, configureCloudinary };
