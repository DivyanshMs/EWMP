/**
 * server.js
 * EWMP API Server — Entry Point
 * Bootstraps the Express application with the full middleware pipeline.
 * Registers all routes and starts the HTTP server.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5 (Middleware Pipeline)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 53 — Register all routes)
 *
 * Middleware Registration Order (must not be changed):
 *   1. dotenv config
 *   2. Environment validation
 *   3. External service config (DB, Cloudinary, Gemini)
 *   4. Security middleware (Helmet, CORS)
 *   5. Request parsing (JSON, cookies)
 *   6. HTTP logging (Morgan)
 *   7. Rate limiting
 *   8. API routes
 *   9. 404 handler
 *  10. Global error handler (MUST be last)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// ─── Config ────────────────────────────────────────────────────────────────
const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const { configureGemini } = require('./config/gemini');

// ─── Middleware ─────────────────────────────────────────────────────────────
const { apiRateLimiter } = require('./middleware/rateLimitMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// ─── Utilities ──────────────────────────────────────────────────────────────
const { sendSuccess, sendError } = require('./utils/formatResponse');
const AppError = require('./utils/AppError');

// ─── Validate environment FIRST — server exits if any var is missing ────────
validateEnv();

// ─── Initialize Express ─────────────────────────────────────────────────────
const app = express();

// ─── Connect to MongoDB Atlas ───────────────────────────────────────────────
connectDB();

// ─── Configure External Services ───────────────────────────────────────────
configureCloudinary();
configureGemini();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// ─── Request Parsing ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── HTTP Request Logging ───────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Global Rate Limiting ───────────────────────────────────────────────────
app.use('/api', apiRateLimiter);

// ─── API Health Check ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  sendSuccess(res, 200, 'EWMP API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
// Routes are registered here as they are implemented in each phase.
// Follow DEVELOPMENT_ORDER.md Section 10 for implementation sequence.
//
// Phase 3 — Authentication
// app.use('/api/auth', require('./routes/authRoutes'));
//
// Phase 4A — Organization & Employees
// app.use('/api/organizations', require('./routes/organizationRoutes'));
// app.use('/api/departments', require('./routes/organizationRoutes'));
// app.use('/api/designations', require('./routes/organizationRoutes'));
// app.use('/api/locations', require('./routes/organizationRoutes'));
// app.use('/api/shifts', require('./routes/organizationRoutes'));
// app.use('/api/employees', require('./routes/employeeRoutes'));
//
// Phase 4B — Attendance & Leave
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/leave-requests', require('./routes/leaveRoutes'));
// app.use('/api/leave-types', require('./routes/leaveRoutes'));
// app.use('/api/leave-balances', require('./routes/leaveRoutes'));
// app.use('/api/holidays', require('./routes/leaveRoutes'));
//
// Phase 4C — Payroll
// app.use('/api/payroll', require('./routes/payrollRoutes'));
// app.use('/api/payslips', require('./routes/payrollRoutes'));
// app.use('/api/salary-structures', require('./routes/payrollRoutes'));
//
// Phase 5A — Projects & Tasks
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/tasks', require('./routes/projectRoutes'));
//
// Phase 5B — Assets & Help Desk
// app.use('/api/assets', require('./routes/assetRoutes'));
// app.use('/api/asset-allocations', require('./routes/assetRoutes'));
// app.use('/api/tickets', require('./routes/helpdeskRoutes'));
//
// Phase 5C — Documents, Notifications, Announcements
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/announcements', require('./routes/notificationRoutes'));
//
// Phase 6A — AI Assistant
// app.use('/api/ai', require('./routes/aiRoutes'));
//
// Phase 6B — Dashboard & Reports
// app.use('/api/dashboard', require('./routes/reportRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
//
// Phase 6C — Performance & Recruitment
// app.use('/api/goals', require('./routes/performanceRoutes'));
// app.use('/api/performance-reviews', require('./routes/performanceRoutes'));
// app.use('/api/candidates', require('./routes/recruitmentRoutes'));
// app.use('/api/interviews', require('./routes/recruitmentRoutes'));
//
// Cross-cutting
// app.use('/api/audit-logs', require('./routes/reportRoutes'));
// app.use('/api/settings', require('./routes/organizationRoutes'));

// ─── 404 Handler — Unmatched Routes ────────────────────────────────────────
app.use((req, res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.path} not found.`, 'ROUTE_NOT_FOUND'));
});

// ─── Global Error Handler — MUST BE LAST ───────────────────────────────────
app.use(errorMiddleware);

// ─── Start Server ───────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT, 10) || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 EWMP Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Client origin: ${process.env.CLIENT_URL}\n`);
});

module.exports = app;
