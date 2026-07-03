/**
 * server.js
 * EWMP API Server — Entry Point
 * Bootstraps configuration, database connection, and starts the HTTP server.
 * Manages process lifecycle and graceful shutdown.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5
 *            DEVELOPMENT_ORDER.md Section 10
 */

require('dotenv').config();

const { validateEnv } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const { configureGemini } = require('./config/gemini');
const config = require('./config/config');
const { logInfo, logError } = require('./utils/loggerHelper');

// ─── 1. Validate environment FIRST — server exits if any var is missing ──────
validateEnv();

// ─── 2. Handle Uncaught Exceptions early ─────────────────────────────────────
process.on('uncaughtException', (err) => {
  logError(`UNCAUGHT EXCEPTION! 💥 Shutting down...: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

// ─── 3. Connect Database and External Services ───────────────────────────────
connectDB();
configureCloudinary();
configureGemini();

// ─── 4. Import Configured Express Application ───────────────────────────────
const app = require('./app');

// ─── 5. Start HTTP Server ───────────────────────────────────────────────────
const PORT = config.port;

const server = app.listen(PORT, () => {
  logInfo(`\n🚀 EWMP Server running on port ${PORT}`);
  logInfo(`   Environment: ${config.env}`);
  logInfo(`   Health check: http://localhost:${PORT}/api/health`);
  logInfo(`   Client origin: ${config.clientUrl}\n`);
});

// ─── 6. Handle Unhandled Promise Rejections ─────────────────────────────────
process.on('unhandledRejection', (err) => {
  logError(`UNHANDLED REJECTION! 💥 Shutting down...: ${err.message}`, { stack: err.stack });
  server.close(() => {
    process.exit(1);
  });
});

// ─── 7. Graceful Shutdown (SIGTERM / SIGINT) ────────────────────────────────
const gracefulShutdown = async (signal) => {
  logInfo(`\n⚠️  ${signal} received. Initiating graceful shutdown...`);

  server.close(async () => {
    logInfo('HTTP server closed. Terminating remaining connections...');
    await disconnectDB();
    logInfo('Graceful shutdown completed. Exiting process.');
    process.exit(0);
  });

  // Force close after 10 seconds if hanging
  setTimeout(() => {
    logError('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
