/**
 * cloudinary.js
 * Cloudinary SDK Configuration
 * Initializes the Cloudinary v2 SDK for file storage operations.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            API_SPECIFICATION.md Section 14 (File Upload Architecture)
 */

const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  console.log('✅ Cloudinary configured');
};

module.exports = { cloudinary, configureCloudinary };
