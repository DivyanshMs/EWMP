/**
 * config.js
 * Central Configuration Manager
 * Parses, types, and exports environment variables and system settings.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 */

const { logInfo, logError } = require('../utils/loggerHelper');

const DEFAULT_JWT_SECRET = 'ewmp_dev_jwt_secret_key_change_in_production_2026';
const DEFAULT_JWT_REFRESH_SECRET = 'ewmp_dev_refresh_secret_key_change_in_production_2026';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ewmp',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET || DEFAULT_JWT_REFRESH_SECRET,
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  ai: {
    provider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'noreply@ewmp.local',
  },
};

/**
 * Reusable configuration validation mechanism.
 * Enforces required environment variables and strict secret checks in production.
 */
const validateConfig = () => {
  const errors = [];
  const isProduction = config.env === 'production';

  // Core required variables
  if (!config.db.uri || config.db.uri.trim() === '') {
    errors.push('❌ MONGODB_URI is missing.');
  }
  if (!config.port) {
    errors.push('❌ PORT is missing.');
  }
  if (!config.clientUrl || config.clientUrl.trim() === '') {
    errors.push('❌ CLIENT_URL is missing.');
  }

  // Enforce JWT_SECRET security rules
  if (!config.jwt.secret || config.jwt.secret.trim() === '' || (isProduction && !process.env.JWT_SECRET)) {
    errors.push('❌ JWT_SECRET is missing.');
  } else if (isProduction && config.jwt.secret === DEFAULT_JWT_SECRET) {
    errors.push('❌ JWT_SECRET cannot use insecure default placeholder values in production.');
  }

  // Enforce JWT_REFRESH_SECRET security rules
  if (!config.jwt.refreshSecret || config.jwt.refreshSecret.trim() === '' || (isProduction && !process.env.JWT_REFRESH_SECRET)) {
    errors.push('❌ JWT_REFRESH_SECRET is missing.');
  } else if (isProduction && config.jwt.refreshSecret === DEFAULT_JWT_REFRESH_SECRET) {
    errors.push('❌ JWT_REFRESH_SECRET cannot use insecure default placeholder values in production.');
  }

  if (errors.length > 0) {
    errors.forEach((err) => {
      logError(err);
      console.error(err);
    });
    logError('Application terminated.');
    console.error('Application terminated.');
    process.exit(1);
  }

  logInfo('✅ Configuration validated successfully');
  return true;
};

config.validateConfig = validateConfig;
config.DEFAULT_JWT_SECRET = DEFAULT_JWT_SECRET;
config.DEFAULT_JWT_REFRESH_SECRET = DEFAULT_JWT_REFRESH_SECRET;

module.exports = config;
