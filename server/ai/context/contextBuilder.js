/**
 * contextBuilder.js — Phase 6: Context Builder
 * Responsible for gathering ONLY the minimum business context required for the detected intent before LLM invocation.
 * Calls existing business services without duplicating queries or importing MongoDB models directly.
 * Enforces strict data minimization (stripping PII, passwords, tokens, audit logs, internal IDs).
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 9
 */

const attendanceService = require('../../services/attendanceService');
const leaveService = require('../../services/leaveService');
const employeeService = require('../../services/employeeService');
const payrollService = require('../../services/payrollService');
const performanceService = require('../../services/performanceService');
const projectService = require('../../services/projectService');
const taskService = require('../../services/taskService');
const recruitmentService = require('../../services/recruitmentService');
const assetService = require('../../services/assetService');
const documentService = require('../../services/documentService');
const helpdeskService = require('../../services/helpdeskService');
const notificationService = require('../../services/notificationService');
const reportService = require('../../services/reportService');

const AppError = require('../../utils/AppError');
const { logInfo, logError, logWarn, logDebug } = require('../../utils/loggerHelper');

/**
 * Recursively strips sensitive fields, audit logs, internal notes, tokens, and database IDs.
 *
 * @param {any} obj - Data structure to sanitize
 * @returns {any} Sanitized data structure
 */
const stripSensitiveFields = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(stripSensitiveFields);

  const cleanObj = {};
  const sensitiveKeys = /^(password|passwordHash|refreshToken|token|secret|jwt|internalNote|internalNotes|auditLog|auditLogs|deleted|isDeleted|deletedAt|deletedBy|__v|_id|organizationId|userId|createdBy|updatedBy|panNumber|pan|ssn|bankAccount|routingNumber|salaryHash)$/i;

  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveKeys.test(key)) {
      continue;
    }
    // Strip standalone 24-character hex ObjectIds representing database internal IDs
    if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value) && (key.endsWith('Id') || key === 'id' || key === '_id')) {
      continue;
    }
    cleanObj[key] = stripSensitiveFields(value);
  }
  return cleanObj;
};

/**
 * Counts the total number of records retrieved across an object or array.
 *
 * @param {any} data - Context data payload
 * @returns {number} Record count
 */
const countRetrievedRecords = (data) => {
  if (!data) return 0;
  if (Array.isArray(data)) return data.length;
  if (typeof data !== 'object') return 0;

  let total = 0;
  for (const val of Object.values(data)) {
    if (Array.isArray(val)) {
      total += val.length;
    } else if (val && typeof val === 'object' && Object.keys(val).length > 0) {
      total += countRetrievedRecords(val);
    } else if (val !== null && val !== undefined) {
      total += 1;
    }
  }
  return total === 0 && Object.keys(data).length > 0 ? 1 : total;
};

/**
 * Retrieves minimal domain context from existing business services based on intent.
 *
 * @param {string} intent - Detected intent string
 * @param {object} reqUser - Authenticated user context
 * @returns {Promise<object>} Raw business context object
 */
const _retrieveDomainContext = async (intent, reqUser) => {
  if (!reqUser || !reqUser.organizationId) {
    return {};
  }

  try {
    switch (intent) {
      case 'ATTENDANCE_QUERY': {
        if (reqUser.role === 'EMPLOYEE' || reqUser.employeeId) {
          try {
            const res = await attendanceService.getMyAttendance({ limit: 5, sortBy: 'date', sortOrder: 'desc' }, reqUser);
            return { recentAttendance: res.items || res };
          } catch (err) { /* fallback */ }
        }
        const res = await attendanceService.getAttendance({ limit: 5, sortBy: 'date', sortOrder: 'desc' }, reqUser);
        return { attendanceRecords: res.items || res };
      }

      case 'LEAVE_QUERY': {
        if (reqUser.role === 'EMPLOYEE' || reqUser.employeeId) {
          try {
            const [balances, requests] = await Promise.all([
              leaveService.getMyLeaveBalances({}, reqUser).catch(() => null),
              leaveService.getMyLeaveRequests({ limit: 5, status: 'Pending' }, reqUser).catch(() => null),
            ]);
            return { leaveBalances: balances?.items || balances, pendingRequests: requests?.items || requests };
          } catch (err) { /* fallback */ }
        }
        const [balances, requests] = await Promise.all([
          leaveService.getLeaveBalances({ limit: 5 }, reqUser).catch(() => null),
          leaveService.getLeaveRequests({ limit: 5, status: 'Pending' }, reqUser).catch(() => null),
        ]);
        return { leaveBalances: balances?.items || balances, pendingRequests: requests?.items || requests };
      }

      case 'EMPLOYEE_QUERY': {
        if (reqUser.role === 'EMPLOYEE' && reqUser.employeeId) {
          const profile = await employeeService.getEmployeeById(reqUser.employeeId, reqUser);
          return { myProfile: profile };
        }
        const employees = await employeeService.getEmployees({ limit: 5 }, reqUser);
        return { employeeDirectory: employees.items || employees };
      }

      case 'PAYROLL_QUERY': {
        if (reqUser.role === 'EMPLOYEE' || reqUser.employeeId) {
          try {
            const payslips = await payrollService.getPayslips({ limit: 3, sortBy: 'payPeriodEnd', sortOrder: 'desc' }, reqUser);
            return { recentPayslips: payslips.items || payslips };
          } catch (err) { /* fallback */ }
        }
        const payrolls = await payrollService.getPayrolls({ limit: 5 }, reqUser);
        return { payrollRuns: payrolls.items || payrolls };
      }

      case 'PERFORMANCE_QUERY': {
        const [reviews, goals] = await Promise.all([
          performanceService.getReviews({ limit: 3 }, reqUser).catch(() => null),
          performanceService.getGoals({ limit: 5 }, reqUser).catch(() => null),
        ]);
        return { performanceReviews: reviews?.items || reviews, goals: goals?.items || goals };
      }

      case 'PROJECT_QUERY': {
        const projects = await projectService.getProjects({ limit: 5 }, reqUser);
        return { projects: projects.items || projects };
      }

      case 'TASK_QUERY': {
        const tasks = await taskService.getTasks({ limit: 5 }, reqUser);
        return { tasks: tasks.items || tasks };
      }

      case 'RECRUITMENT_QUERY': {
        const [jobs, candidates] = await Promise.all([
          recruitmentService.getJobs({ limit: 5, status: 'Open' }, reqUser).catch(() => null),
          recruitmentService.getCandidates({ limit: 5 }, reqUser).catch(() => null),
        ]);
        return { openJobs: jobs?.items || jobs, recentCandidates: candidates?.items || candidates };
      }

      case 'ASSET_QUERY': {
        const assets = await assetService.getAssets({ limit: 5 }, reqUser);
        return { assets: assets.items || assets };
      }

      case 'DOCUMENT_QUERY': {
        const docs = await documentService.getDocuments({ limit: 5 }, reqUser);
        return { documents: docs.items || docs };
      }

      case 'HELPDESK_QUERY': {
        const tickets = await helpdeskService.getTickets({ limit: 5 }, reqUser);
        return { helpdeskTickets: tickets.items || tickets };
      }

      case 'NOTIFICATION_QUERY': {
        const notifs = await notificationService.getNotifications({ limit: 5 }, reqUser);
        return { notifications: notifs.items || notifs };
      }

      case 'REPORT_QUERY': {
        let reportStats = null;
        if (reqUser.role === 'EMPLOYEE' && reqUser.employeeId) {
          reportStats = await reportService.getEmployeeDashboard(reqUser.organizationId, reqUser.employeeId).catch(() => null);
        } else if (reqUser.role === 'MANAGER' && reqUser.employeeId) {
          reportStats = await reportService.getManagerDashboard(reqUser.organizationId, reqUser.employeeId, null).catch(() => null);
        } else if (reqUser.role === 'HR_MANAGER' || reqUser.role === 'HR_ADMIN') {
          reportStats = await reportService.getHRDashboard(reqUser.organizationId).catch(() => null);
        } else {
          reportStats = await reportService.getExecutiveDashboard(reqUser.organizationId).catch(() => null);
        }
        return { dashboardReport: reportStats };
      }

      case 'GENERAL_CHAT':
      case 'UNKNOWN':
      default:
        return {};
    }
  } catch (error) {
    logDebug(`Context Builder service query encountered fallback for intent ${intent}: ${error.message}`);
    return {};
  }
};

/**
 * Builds minimal, sanitized business context for a detected intent.
 *
 * @param {object} intentResult - Result from Intent Engine { intent, confidence, source }
 * @param {string} message - User query message
 * @param {object} reqUser - Authenticated user object from authMiddleware
 * @returns {Promise<object>} { intent, context, metadata }
 */
const buildContext = async (intentResult, message, reqUser) => {
  const startTime = Date.now();
  const intent = (intentResult && intentResult.intent) ? intentResult.intent : 'UNKNOWN';

  if (intent === 'GENERAL_CHAT' || intent === 'UNKNOWN' || !reqUser) {
    const latencyMs = Date.now() - startTime;
    logInfo('AI Context Built', {
      intent,
      contextType: intent,
      buildTimeMs: latencyMs,
      recordsRetrieved: 0,
    });
    return {
      intent,
      context: {},
      metadata: {
        recordsRetrieved: 0,
        buildTimeMs: latencyMs,
        timestamp: new Date().toISOString(),
      },
    };
  }

  const rawContext = await _retrieveDomainContext(intent, reqUser);
  const sanitizedContext = stripSensitiveFields(rawContext);
  const recordsRetrieved = countRetrievedRecords(sanitizedContext);
  const latencyMs = Date.now() - startTime;

  logInfo('AI Context Built', {
    intent,
    contextType: intent,
    buildTimeMs: latencyMs,
    recordsRetrieved,
  });

  return {
    intent,
    context: sanitizedContext,
    metadata: {
      recordsRetrieved,
      buildTimeMs: latencyMs,
      timestamp: new Date().toISOString(),
    },
  };
};

module.exports = {
  stripSensitiveFields,
  countRetrievedRecords,
  buildContext,
};
