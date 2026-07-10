/**
 * workflowRegistry.js — Phase 16: AI Workflow Orchestration Engine
 * Authoritative registry of supported enterprise multi-step workflows across EWMP business modules.
 * Authoritatively defines workflow structures, step dependencies, required roles, required modules,
 * estimated durations, and immutably sets executionAllowed: false.
 *
 * Authority: API_SPECIFICATION.md Section 10
 *            AI Architecture Blueprint Section 16
 */

const { logDebug } = require('../../utils/loggerHelper');

const WORKFLOWS = {
  employee_onboarding: {
    workflowId: 'employee_onboarding',
    name: 'Employee Onboarding Workflow',
    description: 'End-to-end multi-step enterprise onboarding for new hires across HR, IT, and Department management.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredModules: ['EMPLOYEE', 'DEPARTMENT', 'SHIFT', 'ASSET', 'NOTIFICATION'],
    requiredPermissions: ['EMPLOYEE_CREATE', 'ASSET_ALLOCATE', 'NOTIFICATION_SEND'],
    estimatedDuration: '15 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['firstName', 'lastName', 'email', 'departmentId', 'role'],
    steps: [
      { step: 1, module: 'Employee', action: 'Create Employee Record', tool: 'employee.create', dependsOn: [] },
      { step: 2, module: 'Department', action: 'Assign Department', tool: 'department.assign', dependsOn: [1] },
      { step: 3, module: 'Designation', action: 'Assign Designation & Role', tool: 'employee.update', dependsOn: [1] },
      { step: 4, module: 'Shift', action: 'Assign Working Shift', tool: 'attendance.assignShift', dependsOn: [1] },
      { step: 5, module: 'Asset', action: 'Allocate Hardware & Software Assets', tool: 'asset.allocate', dependsOn: [1, 2] },
      { step: 6, module: 'System', action: 'Create System Login Credentials', tool: 'auth.createLogin', dependsOn: [1] },
      { step: 7, module: 'Notification', action: 'Send Welcome Email & Orientation Guide', tool: 'notification.create', dependsOn: [6] },
      { step: 8, module: 'Notification', action: 'Notify Department Manager & Team Lead', tool: 'notification.create', dependsOn: [2, 7] },
    ],
  },

  employee_offboarding: {
    workflowId: 'employee_offboarding',
    name: 'Employee Offboarding Workflow',
    description: 'Systematic exit workflow covering asset recovery, access revocation, final payroll settlement, and exit documentation.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredModules: ['EMPLOYEE', 'ASSET', 'PAYROLL', 'DOCUMENT', 'NOTIFICATION'],
    requiredPermissions: ['EMPLOYEE_UPDATE', 'ASSET_RECOVER', 'PAYROLL_SETTLE'],
    estimatedDuration: '30 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['employeeId'],
    steps: [
      { step: 1, module: 'Employee', action: 'Initiate Offboarding Request', tool: 'employee.update', dependsOn: [] },
      { step: 2, module: 'Asset', action: 'Trigger Hardware & Software Asset Recovery', tool: 'asset.recover', dependsOn: [1] },
      { step: 3, module: 'System', action: 'Schedule System Access & Login Revocation', tool: 'auth.revokeAccess', dependsOn: [1] },
      { step: 4, module: 'Payroll', action: 'Calculate & Prepare Final Settlement Payroll', tool: 'payroll.generate', dependsOn: [1, 2] },
      { step: 5, module: 'Document', action: 'Generate Experience Letter & Relieving Document', tool: 'document.upload', dependsOn: [4] },
      { step: 6, module: 'Notification', action: 'Send Exit Completion Notification to Stakeholders', tool: 'notification.create', dependsOn: [2, 3, 4, 5] },
    ],
  },

  leave_approval_process: {
    workflowId: 'leave_approval_process',
    name: 'Leave Approval & Coverage Workflow',
    description: 'Comprehensive leave processing workflow verifying balances, arranging project shift coverage, and notifying teams.',
    requiredRoles: ['HR_MANAGER', 'MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredModules: ['LEAVE', 'ATTENDANCE', 'PROJECT', 'NOTIFICATION'],
    requiredPermissions: ['LEAVE_APPROVE', 'SHIFT_REASSIGN'],
    estimatedDuration: '5 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['leaveRequestId'],
    steps: [
      { step: 1, module: 'Leave', action: 'Verify Leave Balance & Policy Compliance', tool: 'leave.verify', dependsOn: [] },
      { step: 2, module: 'Project', action: 'Check Active Project Allocations & Deadlines', tool: 'project.checkWorkload', dependsOn: [1] },
      { step: 3, module: 'Leave', action: 'Approve Leave Request in System', tool: 'leave.approve', dependsOn: [1, 2] },
      { step: 4, module: 'Attendance', action: 'Update Shift Roster & Attendance Calendar', tool: 'attendance.updateCalendar', dependsOn: [3] },
      { step: 5, module: 'Notification', action: 'Notify Applicant & Project Team Members', tool: 'notification.create', dependsOn: [3, 4] },
    ],
  },

  payroll_run: {
    workflowId: 'payroll_run',
    name: 'Monthly Payroll Run Workflow',
    description: 'End-to-end salary cycle processing including attendance aggregation, tax calculations, payslip generation, and disbursement approval.',
    requiredRoles: ['FINANCE', 'ORG_ADMIN', 'SUPER_ADMIN'],
    requiredModules: ['PAYROLL', 'ATTENDANCE', 'LEAVE', 'DOCUMENT', 'NOTIFICATION'],
    requiredPermissions: ['PAYROLL_GENERATE', 'PAYSLIP_PUBLISH'],
    estimatedDuration: '45 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['month', 'year'],
    steps: [
      { step: 1, module: 'Attendance', action: 'Aggregate Monthly Attendance & Loss of Pay (LOP) Days', tool: 'attendance.aggregate', dependsOn: [] },
      { step: 2, module: 'Leave', action: 'Reconcile Approved Leaves & Unpaid Absences', tool: 'leave.reconcile', dependsOn: [1] },
      { step: 3, module: 'Payroll', action: 'Compute Gross Salary, Tax Deductions & Net Payable', tool: 'payroll.generate', dependsOn: [1, 2] },
      { step: 4, module: 'Finance', action: 'Generate Payroll Audit Report for Leadership Review', tool: 'report.generate', dependsOn: [3] },
      { step: 5, module: 'Document', action: 'Generate & Archive Employee Payslips PDF', tool: 'document.upload', dependsOn: [3, 4] },
      { step: 6, module: 'Notification', action: 'Send Payslip Availability Broadcast Notification', tool: 'notification.create', dependsOn: [5] },
    ],
  },

  project_assignment: {
    workflowId: 'project_assignment',
    name: 'Project Resource Allocation Workflow',
    description: 'Structured resource allocation workflow matching skillsets, checking capacity, assigning tasks, and initializing collaboration.',
    requiredRoles: ['MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_LEAD'],
    requiredModules: ['PROJECT', 'TASK', 'EMPLOYEE', 'NOTIFICATION'],
    requiredPermissions: ['PROJECT_ASSIGN', 'TASK_CREATE'],
    estimatedDuration: '10 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['employeeId', 'projectId'],
    steps: [
      { step: 1, module: 'Employee', action: 'Evaluate Employee Skillset & Current Workload Capacity', tool: 'employee.checkCapacity', dependsOn: [] },
      { step: 2, module: 'Project', action: 'Allocate Employee to Project Roster', tool: 'project.assign', dependsOn: [1] },
      { step: 3, module: 'Task', action: 'Create Initial Milestone Onboarding Tasks', tool: 'task.create', dependsOn: [2] },
      { step: 4, module: 'Notification', action: 'Send Project Brief & Repository Access Links', tool: 'notification.create', dependsOn: [2, 3] },
    ],
  },

  asset_allocation: {
    workflowId: 'asset_allocation',
    name: 'Hardware & Software Asset Allocation Workflow',
    description: 'Systematic hardware and software provisioning workflow checking inventory availability, assigning licenses, and logging handover.',
    requiredRoles: ['MANAGER', 'HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'TEAM_LEAD'],
    requiredModules: ['ASSET', 'EMPLOYEE', 'DOCUMENT', 'NOTIFICATION'],
    requiredPermissions: ['ASSET_ALLOCATE'],
    estimatedDuration: '15 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['assetType', 'employeeId'],
    steps: [
      { step: 1, module: 'Asset', action: 'Check Inventory Stock & License Availability', tool: 'asset.checkStock', dependsOn: [] },
      { step: 2, module: 'Asset', action: 'Assign Asset Tag & Serial Number to Employee', tool: 'asset.allocate', dependsOn: [1] },
      { step: 3, module: 'Document', action: 'Generate Digital Asset Handover Agreement', tool: 'document.upload', dependsOn: [2] },
      { step: 4, module: 'Notification', action: 'Notify IT Support & Employee for Pickup/Setup', tool: 'notification.create', dependsOn: [2, 3] },
    ],
  },

  recruitment_hiring_flow: {
    workflowId: 'recruitment_hiring_flow',
    name: 'Recruitment & Candidate Hiring Workflow',
    description: 'End-to-end hiring pipeline orchestrating resume screening, interview scheduling, evaluation scoring, and offer letter generation.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    requiredModules: ['RECRUITMENT', 'EMPLOYEE', 'DOCUMENT', 'NOTIFICATION'],
    requiredPermissions: ['RECRUITMENT_MANAGE', 'OFFER_GENERATE'],
    estimatedDuration: '20 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['jobId', 'candidateName'],
    steps: [
      { step: 1, module: 'Recruitment', action: 'Screen Candidate Profile against Vacancy Criteria', tool: 'recruitment.screen', dependsOn: [] },
      { step: 2, module: 'Recruitment', action: 'Schedule Technical & HR Interview Rounds', tool: 'recruitment.schedule', dependsOn: [1] },
      { step: 3, module: 'Recruitment', action: 'Aggregate Interview Evaluation Scores & Feedback', tool: 'recruitment.evaluate', dependsOn: [2] },
      { step: 4, module: 'Document', action: 'Generate Formal Offer Letter Document', tool: 'document.upload', dependsOn: [3] },
      { step: 5, module: 'Notification', action: 'Dispatch Offer Letter & Background Verification Link', tool: 'notification.create', dependsOn: [4] },
    ],
  },

  performance_review_cycle: {
    workflowId: 'performance_review_cycle',
    name: 'Annual Performance Review Cycle Workflow',
    description: 'Structured appraisal workflow launching self-assessments, managerial reviews, KPI normalization, and rating calibration.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER'],
    requiredModules: ['PERFORMANCE', 'EMPLOYEE', 'REPORT', 'NOTIFICATION'],
    requiredPermissions: ['PERFORMANCE_MANAGE'],
    estimatedDuration: '30 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['cycleName'],
    steps: [
      { step: 1, module: 'Performance', action: 'Initialize Performance Appraisal Cycle & Timeline', tool: 'performance.initCycle', dependsOn: [] },
      { step: 2, module: 'Notification', action: 'Broadcast Self-Assessment Submission Reminder', tool: 'notification.create', dependsOn: [1] },
      { step: 3, module: 'Performance', action: 'Aggregate Self-Assessments & Open Managerial Evaluation', tool: 'performance.openReview', dependsOn: [2] },
      { step: 4, module: 'Performance', action: 'Execute Bell Curve Normalization & Rating Calibration', tool: 'performance.calibrate', dependsOn: [3] },
      { step: 5, module: 'Report', action: 'Generate Executive Appraisal Distribution Scorecard', tool: 'report.generate', dependsOn: [4] },
      { step: 6, module: 'Notification', action: 'Notify Employees of Final Appraisal Discussion Schedule', tool: 'notification.create', dependsOn: [5] },
    ],
  },

  help_desk_resolution: {
    workflowId: 'help_desk_resolution',
    name: 'Help Desk Ticket Escalation & Resolution Workflow',
    description: 'Support ticket resolution workflow classifying severity, assigning support engineers, querying knowledge bases, and logging resolution.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER', 'EMPLOYEE'],
    requiredModules: ['HELPDESK', 'TASK', 'NOTIFICATION'],
    requiredPermissions: ['HELPDESK_RESOLVE'],
    estimatedDuration: '10 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['ticketId'],
    steps: [
      { step: 1, module: 'Helpdesk', action: 'Analyze Ticket Category, Urgency & SLA Deadline', tool: 'helpdesk.analyze', dependsOn: [] },
      { step: 2, module: 'Helpdesk', action: 'Query Knowledge Base for Deflection Articles', tool: 'helpdesk.queryKB', dependsOn: [1] },
      { step: 3, module: 'Task', action: 'Assign Investigation Task to Level-2 Support Engineer', tool: 'task.create', dependsOn: [1, 2] },
      { step: 4, module: 'Helpdesk', action: 'Log Resolution Summary & Close Support Ticket', tool: 'helpdesk.close', dependsOn: [3] },
      { step: 5, module: 'Notification', action: 'Send Resolution Confirmation & CSAT Survey to Employee', tool: 'notification.create', dependsOn: [4] },
    ],
  },

  document_approval: {
    workflowId: 'document_approval',
    name: 'Enterprise Document Approval Workflow',
    description: 'Multi-stage document verification workflow routing policies or contracts through legal review, compliance audit, and publishing.',
    requiredRoles: ['HR_MANAGER', 'ORG_ADMIN', 'SUPER_ADMIN', 'MANAGER', 'AUDITOR'],
    requiredModules: ['DOCUMENT', 'TASK', 'NOTIFICATION'],
    requiredPermissions: ['DOCUMENT_APPROVE'],
    estimatedDuration: '15 minutes',
    confirmationRequired: true,
    executionAllowed: false,
    requiredParameters: ['documentId'],
    steps: [
      { step: 1, module: 'Document', action: 'Verify Document Formatting, Metadata & Versioning', tool: 'document.verify', dependsOn: [] },
      { step: 2, module: 'Task', action: 'Assign Compliance Review Task to Legal/HR Auditor', tool: 'task.create', dependsOn: [1] },
      { step: 3, module: 'Document', action: 'Record Sign-Off & Mark Document as Approved/Active', tool: 'document.approve', dependsOn: [2] },
      { step: 4, module: 'Notification', action: 'Broadcast Document Publication Notice to Target Audience', tool: 'notification.create', dependsOn: [3] },
    ],
  },
};

/**
 * Retrieves a registered workflow definition by ID.
 *
 * @param {string} id - Workflow identifier (e.g., 'employee_onboarding')
 * @returns {object|null} Workflow definition object or null
 */
const getWorkflow = (id) => {
  if (!id || typeof id !== 'string') return null;
  return WORKFLOWS[id.toLowerCase().trim()] || null;
};

/**
 * Returns all registered workflow definitions.
 *
 * @returns {Array<object>} Array of all workflow definitions
 */
const getAllWorkflows = () => {
  return Object.values(WORKFLOWS);
};

/**
 * Matches a user query or intent against registered workflows using keyword analysis and intent classification.
 *
 * @param {string} message - User query text
 * @param {string} [intent=''] - Classified intent category
 * @param {object} [actionPlan=null] - Prepared action plan from Action Planner
 * @returns {object|null} Matched workflow definition or null
 */
const matchWorkflow = (message = '', intent = '', actionPlan = null) => {
  const text = message.toLowerCase().trim();
  const upperIntent = intent ? intent.toUpperCase() : '';

  // 1. Direct keywords in message text
  if (text.includes('onboard') || text.includes('hiring flow') || text.includes('new hire workflow')) {
    return WORKFLOWS.employee_onboarding;
  }
  if (text.includes('offboard') || text.includes('exit workflow') || text.includes('relieve employee') || text.includes('resignation workflow')) {
    return WORKFLOWS.employee_offboarding;
  }
  if (text.includes('leave approval workflow') || text.includes('leave process') || text.includes('leave workflow')) {
    return WORKFLOWS.leave_approval_process;
  }
  if (text.includes('payroll run') || text.includes('payroll workflow') || text.includes('monthly payroll process') || text.includes('salary run')) {
    return WORKFLOWS.payroll_run;
  }
  if (text.includes('project assignment workflow') || text.includes('resource allocation workflow') || text.includes('project staffing workflow')) {
    return WORKFLOWS.project_assignment;
  }
  if (text.includes('asset allocation workflow') || text.includes('hardware provisioning workflow') || text.includes('asset assignment workflow')) {
    return WORKFLOWS.asset_allocation;
  }
  if (text.includes('recruitment workflow') || text.includes('hiring pipeline') || text.includes('interview workflow')) {
    return WORKFLOWS.recruitment_hiring_flow;
  }
  if (text.includes('performance review cycle') || text.includes('appraisal workflow') || text.includes('annual review workflow') || text.includes('bell curve workflow')) {
    return WORKFLOWS.performance_review_cycle;
  }
  if (text.includes('help desk workflow') || text.includes('ticket escalation workflow') || text.includes('support resolution workflow')) {
    return WORKFLOWS.help_desk_resolution;
  }
  if (text.includes('document approval workflow') || text.includes('policy verification workflow') || text.includes('contract approval workflow')) {
    return WORKFLOWS.document_approval;
  }

  // 2. Intent matching if explicit action plan requested multi-step workflow
  if (actionPlan && actionPlan.actionType === 'CREATE_EMPLOYEE' && text.includes('workflow')) {
    return WORKFLOWS.employee_onboarding;
  }
  if (actionPlan && actionPlan.actionType === 'GENERATE_PAYROLL' && text.includes('workflow')) {
    return WORKFLOWS.payroll_run;
  }

  logDebug(`Workflow Registry: No matching multi-step workflow found for query "${text}"`);
  return null;
};

module.exports = {
  WORKFLOWS,
  getWorkflow,
  getAllWorkflows,
  matchWorkflow,
};
