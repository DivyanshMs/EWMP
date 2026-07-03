/**
 * fileUploadUtil.js
 * Cloudinary File Upload Utility
 * Streams Multer memory buffers to Cloudinary.
 * Returns { url, publicId } for storage in MongoDB documents.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            API_SPECIFICATION.md Section 14 (File Upload APIs)
 *            DATABASE_DESIGN.md ADR-308
 *            DEVELOPMENT_ORDER.md Section 10 (Step 22)
 */

const { cloudinary } = require('../config/cloudinary');

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from Multer memory storage
 * @param {string} folder - Cloudinary folder path (e.g. 'ewmp/employees/photos')
 * @param {string} publicId - Desired Cloudinary public ID
 * @param {object} [options] - Additional Cloudinary upload options
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = (buffer, folder, publicId, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary by its public ID.
 * @param {string} publicId - Cloudinary public ID stored in the database
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
