/**
 * db.js
 * MongoDB Atlas Connection
 * Establishes and manages the Mongoose connection to MongoDB Atlas.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 7.3
 *            DATABASE_DESIGN.md Section 3
 */

const mongoose = require('mongoose');
const config = require('./config');
const { logInfo, logError, logWarn } = require('../utils/loggerHelper');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri, config.db.options);
    logInfo(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logError(`❌ MongoDB connection failed: ${error.message}`, { stack: error.stack });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logInfo('✅ MongoDB connection closed gracefully');
  } catch (error) {
    logError(`❌ Error closing MongoDB connection: ${error.message}`);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logWarn('⚠️  MongoDB disconnected. Attempting reconnection...');
});

mongoose.connection.on('reconnected', () => {
  logInfo('✅ MongoDB reconnected');
});

module.exports = { connectDB, disconnectDB };
