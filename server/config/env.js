/**
 * env.js
 * Environment Variable Validation
 * Validates all required environment variables at startup.
 * Server refuses to start if any required variable is missing.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 */

const { logInfo, logError } = require('../utils/loggerHelper');

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_ACCESS_EXPIRY',
  'JWT_REFRESH_EXPIRY',
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GEMINI_API_KEY',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logError('❌ Missing required environment variables:');
    missing.forEach((key) => logError(`   - ${key}`));
    logError('Please check your .env file against .env.example');
    process.exit(1);
  }

  logInfo('✅ Environment variables validated successfully');
};

module.exports = { validateEnv };
