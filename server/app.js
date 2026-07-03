/**
 * app.js
 * Express Application Configuration and Middleware Pipeline
 * Configures global security, parsing, logging, rate limiting, and error handling middleware.
 * Registers API routes and exports the configured Express application.
 *
 * Authority: ARCHITECTURE_REVISION.md Section 5 (Middleware Pipeline)
 *            DEVELOPMENT_ORDER.md Section 10
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// ─── Config & Utilities ─────────────────────────────────────────────────────
const config = require('./config/config');
const { sendSuccess } = require('./utils/formatResponse');

// ─── Middleware ─────────────────────────────────────────────────────────────
const { apiRateLimiter } = require('./middleware/rateLimitMiddleware');
const requestLogger = require('./middleware/requestLogger');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// ─── Initialize Express Application ─────────────────────────────────────────
const app = express();

// ─── 1. Security & Performance Middleware ───────────────────────────────────
app.use(helmet());
app.use(compression());

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

// ─── 2. Request Parsing ─────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── 3. HTTP Request Logging ────────────────────────────────────────────────
app.use(requestLogger);

// ─── 4. Global Rate Limiting ────────────────────────────────────────────────
app.use('/api', apiRateLimiter);

// ─── 5. API Health Check Endpoints (/health and /api/health) ────────────────
const healthHandler = (req, res) => {
  sendSuccess(res, 200, 'EWMP API is running', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    version: '1.0.0',
    environment: config.env,
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// ─── 6. API Modular Route Registration (Stubs for future phases) ────────────
// Follow DEVELOPMENT_ORDER.md Section 10 for implementation sequence.

// Phase 3 — Authentication & User Management
// app.use('/api/auth', require('./routes/authRoutes'));

// Phase 4A — Organization & Employees
// app.use('/api/organizations', require('./routes/organizationRoutes'));
// app.use('/api/departments', require('./routes/organizationRoutes'));
// app.use('/api/designations', require('./routes/organizationRoutes'));
// app.use('/api/locations', require('./routes/organizationRoutes'));
// app.use('/api/shifts', require('./routes/organizationRoutes'));
// app.use('/api/employees', require('./routes/employeeRoutes'));

// Phase 4B — Attendance & Leave
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/leave-requests', require('./routes/leaveRoutes'));
// app.use('/api/leave-types', require('./routes/leaveRoutes'));
// app.use('/api/leave-balances', require('./routes/leaveRoutes'));
// app.use('/api/holidays', require('./routes/leaveRoutes'));

// Phase 4C — Payroll
// app.use('/api/payroll', require('./routes/payrollRoutes'));
// app.use('/api/payslips', require('./routes/payrollRoutes'));
// app.use('/api/salary-structures', require('./routes/payrollRoutes'));

// Phase 5A — Projects & Tasks
// app.use('/api/projects', require('./routes/projectRoutes'));
// app.use('/api/tasks', require('./routes/projectRoutes'));

// Phase 5B — Assets & Help Desk
// app.use('/api/assets', require('./routes/assetRoutes'));
// app.use('/api/asset-allocations', require('./routes/assetRoutes'));
// app.use('/api/tickets', require('./routes/helpdeskRoutes'));

// Phase 5C — Documents, Notifications, Announcements
// app.use('/api/notifications', require('./routes/notificationRoutes'));
// app.use('/api/announcements', require('./routes/notificationRoutes'));

// Phase 6A — AI Assistant
// app.use('/api/ai', require('./routes/aiRoutes'));

// Phase 6B — Dashboard & Reports
// app.use('/api/dashboard', require('./routes/reportRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));

// Phase 6C — Performance & Recruitment
// app.use('/api/goals', require('./routes/performanceRoutes'));
// app.use('/api/performance-reviews', require('./routes/performanceRoutes'));
// app.use('/api/candidates', require('./routes/recruitmentRoutes'));
// app.use('/api/interviews', require('./routes/recruitmentRoutes'));

// Cross-cutting
// app.use('/api/audit-logs', require('./routes/reportRoutes'));
// app.use('/api/settings', require('./routes/organizationRoutes'));

// ─── 7. 404 Handler for Unmatched Routes ────────────────────────────────────
app.use(notFoundMiddleware);

// ─── 8. Global Error Handler — MUST BE LAST ─────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
