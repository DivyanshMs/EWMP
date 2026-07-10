/**
 * toolRegistry.js — Phase 14: AI Action Planner & Tool Calling
 * Centralized enterprise tool registry defining supported business operations, required roles,
 * mandatory/optional parameters, confirmation requirements, and execution boundaries.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 14
 */

const { logDebug } = require('../../utils/loggerHelper');

const TOOLS = {
  'leave.approve': {
    actionType: 'LEAVE_APPROVAL',
    toolName: 'leave.approve',
    description: 'Approve an employee leave request.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    requiredParameters: ['leaveRequestId'],
    optionalParameters: ['comment', 'approverId'],
    supportedIntents: ['LEAVE_QUERY', 'ACTION_REQUEST', 'LEAVE_APPROVAL'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/approve.*leave/i, /leave.*approval/i, /grant.*leave/i, /confirm.*leave/i],
  },
  'leave.reject': {
    actionType: 'LEAVE_REJECTION',
    toolName: 'leave.reject',
    description: 'Reject an employee leave request.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    requiredParameters: ['leaveRequestId', 'rejectionReason'],
    optionalParameters: ['comment', 'approverId'],
    supportedIntents: ['LEAVE_QUERY', 'ACTION_REQUEST', 'LEAVE_REJECTION'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/reject.*leave/i, /deny.*leave/i, /decline.*leave/i],
  },
  'employee.create': {
    actionType: 'CREATE_EMPLOYEE',
    toolName: 'employee.create',
    description: 'Create a new employee profile in the organization.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredParameters: ['firstName', 'lastName', 'email', 'departmentId', 'role'],
    optionalParameters: ['designation', 'phone', 'managerId', 'salary'],
    supportedIntents: ['EMPLOYEE_QUERY', 'RECRUITMENT_QUERY', 'ACTION_REQUEST', 'CREATE_EMPLOYEE'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/create.*employee/i, /add.*employee/i, /onboard.*employee/i, /new.*employee/i, /hire.*employee/i],
  },
  'employee.update': {
    actionType: 'UPDATE_EMPLOYEE',
    toolName: 'employee.update',
    description: "Update an existing employee's profile or designation.",
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredParameters: ['employeeId'],
    optionalParameters: ['departmentId', 'designation', 'role', 'managerId', 'status', 'salary'],
    supportedIntents: ['EMPLOYEE_QUERY', 'ACTION_REQUEST', 'UPDATE_EMPLOYEE'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/update.*employee/i, /edit.*employee/i, /modify.*employee/i, /promote.*employee/i, /change.*designation/i],
  },
  'payroll.generate': {
    actionType: 'GENERATE_PAYROLL',
    toolName: 'payroll.generate',
    description: 'Generate monthly payroll cycle for an organization or employee.',
    requiredRole: ['FINANCE', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredParameters: ['month', 'year'],
    optionalParameters: ['employeeId', 'departmentId', 'includeBonuses', 'deductions'],
    supportedIntents: ['PAYROLL_QUERY', 'ACTION_REQUEST', 'GENERATE_PAYROLL'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/generate.*payroll/i, /run.*payroll/i, /process.*payroll/i, /calculate.*payroll/i, /payroll.*for\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i],
  },
  'project.assign': {
    actionType: 'ASSIGN_PROJECT',
    toolName: 'project.assign',
    description: 'Assign an employee or team member to a project.',
    requiredRole: ['MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_LEAD'],
    requiredParameters: ['employeeId', 'projectId'],
    optionalParameters: ['roleInProject', 'allocationPercentage', 'startDate', 'endDate'],
    supportedIntents: ['PROJECT_QUERY', 'TASK_QUERY', 'ACTION_REQUEST', 'ASSIGN_PROJECT'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/assign.*project/i, /allocate.*project/i, /add.*to.*project/i, /assign.*to.*project/i],
  },
  'task.create': {
    actionType: 'CREATE_TASK',
    toolName: 'task.create',
    description: 'Create and assign a new operational or project task.',
    requiredRole: ['MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_LEAD'],
    requiredParameters: ['title', 'assigneeId'],
    optionalParameters: ['projectId', 'description', 'dueDate', 'priority', 'status'],
    supportedIntents: ['TASK_QUERY', 'PROJECT_QUERY', 'ACTION_REQUEST', 'CREATE_TASK'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/create.*task/i, /assign.*task/i, /new.*task/i, /add.*task/i, /onboarding.*task/i],
  },
  'asset.allocate': {
    actionType: 'ALLOCATE_ASSET',
    toolName: 'asset.allocate',
    description: 'Allocate a hardware or software asset (e.g., laptop, monitor, license) to an employee.',
    requiredRole: ['MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_LEAD'],
    requiredParameters: ['assetType', 'employeeId'],
    optionalParameters: ['assetId', 'serialNumber', 'allocationDate', 'notes', 'condition'],
    supportedIntents: ['ASSET_QUERY', 'ACTION_REQUEST', 'ALLOCATE_ASSET'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/allocate.*asset/i, /assign.*asset/i, /allocate.*laptop/i, /assign.*laptop/i, /provide.*laptop/i, /give.*laptop/i, /allocate.*monitor/i],
  },
  'document.upload': {
    actionType: 'UPLOAD_DOCUMENT',
    toolName: 'document.upload',
    description: 'Upload or link an HR, compliance, or employee document.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER', 'EMPLOYEE'],
    requiredParameters: ['documentName', 'category'],
    optionalParameters: ['employeeId', 'fileUrl', 'expiryDate', 'description'],
    supportedIntents: ['DOCUMENT_QUERY', 'ACTION_REQUEST', 'UPLOAD_DOCUMENT'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/upload.*document/i, /add.*document/i, /attach.*document/i, /submit.*document/i],
  },
  'notification.create': {
    actionType: 'CREATE_NOTIFICATION',
    toolName: 'notification.create',
    description: 'Send an enterprise notification or broadcast message to employees.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    requiredParameters: ['title', 'message', 'targetAudience'],
    optionalParameters: ['priority', 'channel', 'scheduledTime', 'departmentId'],
    supportedIntents: ['HELPDESK_QUERY', 'ACTION_REQUEST', 'CREATE_NOTIFICATION', 'GENERAL_CHAT'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/create.*notification/i, /send.*notification/i, /broadcast.*message/i, /notify.*employees/i],
  },
  'report.generate': {
    actionType: 'GENERATE_REPORT',
    toolName: 'report.generate',
    description: 'Generate an enterprise workforce, attendance, or payroll report.',
    requiredRole: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'FINANCE', 'MANAGER', 'AUDITOR'],
    requiredParameters: ['reportType', 'format'],
    optionalParameters: ['startDate', 'endDate', 'departmentId', 'employeeId'],
    supportedIntents: ['REPORT_QUERY', 'ATTENDANCE_QUERY', 'PAYROLL_QUERY', 'ACTION_REQUEST', 'GENERATE_REPORT'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/generate.*report/i, /create.*report/i, /export.*report/i, /download.*report/i, /build.*report/i],
  },
  'attendance.regularize': {
    actionType: 'REGULARIZE_ATTENDANCE',
    toolName: 'attendance.regularize',
    description: 'Submit an attendance regularization request for missing punch times.',
    requiredRole: ['EMPLOYEE', 'MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredParameters: ['date', 'reason'],
    optionalParameters: ['checkInTime', 'checkOutTime', 'employeeId'],
    supportedIntents: ['ATTENDANCE_QUERY', 'ACTION_REQUEST', 'REGULARIZE_ATTENDANCE'],
    confirmationRequired: true,
    executionAllowed: false,
    keywords: [/regulariz.*attendance/i, /correct.*attendance/i, /fix.*attendance/i, /missed.*punch/i],
  },
};

/**
 * Retrieves a tool definition by exact name or action type.
 *
 * @param {string} nameOrAction - Tool name (e.g. 'leave.approve') or action type (e.g. 'LEAVE_APPROVAL')
 * @returns {object|null} Tool definition object or null
 */
const getToolByName = (nameOrAction) => {
  if (!nameOrAction || typeof nameOrAction !== 'string') {
    return null;
  }

  const cleanName = nameOrAction.trim().toLowerCase();
  const cleanAction = nameOrAction.trim().toUpperCase();

  if (TOOLS[cleanName]) {
    return TOOLS[cleanName];
  }

  for (const tool of Object.values(TOOLS)) {
    if (tool.actionType === cleanAction || tool.toolName === cleanName) {
      return tool;
    }
  }

  return null;
};

/**
 * Identifies the best matching enterprise tool based on user query keywords and classified intent.
 *
 * @param {string} message - Sanitized user input string
 * @param {string} [intent] - Classified intent name
 * @returns {object|null} Matched tool definition or null
 */
const matchTool = (message, intent) => {
  if (!message || typeof message !== 'string') {
    return null;
  }

  const cleanText = message.trim();

  // 1. Keyword matching against tool definitions
  for (const tool of Object.values(TOOLS)) {
    if (Array.isArray(tool.keywords)) {
      for (const regex of tool.keywords) {
        if (regex.test(cleanText)) {
          logDebug(`Tool Registry: Matched tool '${tool.toolName}' via keyword regex (${regex})`);
          return tool;
        }
      }
    }
  }

  // 2. Fallback matching via intent if explicit tool action intent was passed
  if (intent && typeof intent === 'string') {
    const cleanIntent = intent.toUpperCase();
    for (const tool of Object.values(TOOLS)) {
      if (tool.actionType === cleanIntent) {
        logDebug(`Tool Registry: Matched tool '${tool.toolName}' via intent '${cleanIntent}'`);
        return tool;
      }
    }
  }

  return null;
};

module.exports = {
  TOOLS,
  getToolByName,
  matchTool,
};
