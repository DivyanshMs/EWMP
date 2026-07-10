const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Payroll = require('../models/Payroll');
const Project = require('../models/Project');
const Task = require('../models/Task');
const HelpDeskTicket = require('../models/HelpDeskTicket');
const Asset = require('../models/Asset');
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { logInfo, logError } = require('../utils/loggerHelper');

/**
 * Helper to get date boundaries
 */
const getDateQuery = (startDate, endDate, dateField = 'createdAt') => {
  const query = {};
  if (startDate || endDate) {
    query[dateField] = {};
    if (startDate) query[dateField].$gte = new Date(startDate);
    if (endDate) query[dateField].$lte = new Date(endDate);
  }
  return query;
};

/**
 * 1. Executive Dashboard Statistics (Organization Wide)
 */
const getExecutiveDashboard = async (organizationId) => {
  const [
    totalEmployees,
    totalProjects,
    activeProjects,
    totalTickets,
    openTickets,
    totalAssets,
    allocatedAssets
  ] = await Promise.all([
    Employee.countDocuments({ organizationId, employmentStatus: 'Active' }),
    Project.countDocuments({ organizationId, status: 'active' }),
    Project.countDocuments({ organizationId, projectStatus: 'Active', status: 'active' }),
    HelpDeskTicket.countDocuments({ organizationId, status: 'active' }),
    HelpDeskTicket.countDocuments({ organizationId, ticketStatus: 'Open', status: 'active' }),
    Asset.countDocuments({ organizationId, status: 'active' }),
    Asset.countDocuments({ organizationId, assetStatus: 'Allocated', status: 'active' })
  ]);

  return {
    kpi: {
      employees: { total: totalEmployees },
      projects: { total: totalProjects, active: activeProjects },
      helpdesk: { total: totalTickets, open: openTickets },
      assets: { total: totalAssets, allocated: allocatedAssets }
    }
  };
};

/**
 * 2. HR Dashboard Statistics
 */
const getHRDashboard = async (organizationId) => {
  const [
    totalEmployees,
    pendingLeaves,
    todayAttendance,
    payrollProcessed
  ] = await Promise.all([
    Employee.countDocuments({ organizationId, employmentStatus: 'Active' }),
    LeaveRequest.countDocuments({ organizationId, status: 'Pending' }),
    Attendance.countDocuments({ 
      organizationId, 
      date: { $gte: new Date().setHours(0,0,0,0), $lt: new Date().setHours(23,59,59,999) },
      status: 'Present'
    }),
    Payroll.countDocuments({ organizationId, payrollStatus: 'Processed' })
  ]);

  return {
    employees: totalEmployees,
    pendingLeaves,
    todayPresent: todayAttendance,
    payrollProcessedCount: payrollProcessed
  };
};

/**
 * 3. Manager Dashboard Statistics (Scoped to their department/projects)
 */
const getManagerDashboard = async (organizationId, managerId, departmentId) => {
  const queryScope = { organizationId };
  if (departmentId) queryScope.departmentId = departmentId;

  const [
    teamSize,
    teamLeaves,
    projectCount,
    taskCount
  ] = await Promise.all([
    Employee.countDocuments({ ...queryScope, employmentStatus: 'Active' }),
    LeaveRequest.countDocuments({ organizationId, status: 'Pending' }), // Assuming manager approves some
    Project.countDocuments({ organizationId, projectManagerId: managerId, status: 'active' }),
    Task.countDocuments({ organizationId, 'status': 'active' }) // Ideal: Tasks where projectManager = managerId
  ]);

  return {
    teamSize,
    pendingTeamLeaves: teamLeaves,
    managedProjects: projectCount,
    totalTasks: taskCount
  };
};

/**
 * 4. Employee Dashboard Statistics
 */
const getEmployeeDashboard = async (organizationId, employeeId) => {
  const [
    myLeaves,
    myTasks,
    myTickets,
    unreadNotifications
  ] = await Promise.all([
    LeaveRequest.countDocuments({ organizationId, employeeId, status: 'Pending' }),
    Task.countDocuments({ organizationId, assignedToId: employeeId, taskStatus: { $ne: 'Completed' }, status: 'active' }),
    HelpDeskTicket.countDocuments({ organizationId, raisedById: employeeId, ticketStatus: { $ne: 'Closed' }, status: 'active' }),
    Notification.countDocuments({ organizationId, recipientId: employeeId, isRead: false, status: 'active' })
  ]);

  return {
    pendingLeaves: myLeaves,
    activeTasks: myTasks,
    openTickets: myTickets,
    unreadNotifications
  };
};

/**
 * Generic Report Generator
 */
const getEntityReport = async (Model, queryParams, organizationId, populateConfig, searchFields = []) => {
  const { page = 1, limit = 10, startDate, endDate, sort = '-createdAt', search, export: isExport } = queryParams;
  
  const query = { organizationId, status: 'active', ...getDateQuery(startDate, endDate) };

  // Apply extra filters dynamically
  for (const key of ['departmentId', 'employeeId', 'projectId', 'category', 'priority']) {
    if (queryParams[key]) query[key] = queryParams[key];
  }

  if (search && searchFields.length > 0) {
    query.$or = searchFields.map(field => ({ [field]: { $regex: search, $options: 'i' } }));
  }

  // If export is requested, we bypass pagination (or set high limit)
  let parsedLimit = parseInt(limit);
  if (isExport === 'true') {
    parsedLimit = 10000; 
  }

  const { skip, sortObj } = buildPaginationAndSort({ page, limit: parsedLimit, sort });

  let mongoQuery = Model.find(query).sort(sortObj).skip(skip).limit(parsedLimit);
  
  if (populateConfig) {
    if (Array.isArray(populateConfig)) {
      populateConfig.forEach(p => mongoQuery = mongoQuery.populate(p));
    } else {
      mongoQuery = mongoQuery.populate(populateConfig);
    }
  }

  const [data, total] = await Promise.all([
    mongoQuery.exec(),
    Model.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Detailed Reports Wrappers
 */
const getAttendanceReport = (queryParams, organizationId) => 
  getEntityReport(Attendance, queryParams, organizationId, { path: 'employeeId', select: 'firstName lastName employeeCode' });

const getLeaveReport = (queryParams, organizationId) => 
  getEntityReport(LeaveRequest, queryParams, organizationId, { path: 'employeeId', select: 'firstName lastName employeeCode' });

const getPayrollReport = (queryParams, organizationId) => 
  getEntityReport(Payroll, queryParams, organizationId, { path: 'employeeId', select: 'firstName lastName employeeCode' });

const getProjectReport = (queryParams, organizationId) => 
  getEntityReport(Project, queryParams, organizationId, { path: 'projectManagerId', select: 'firstName lastName' }, ['name', 'code']);

const getTaskReport = (queryParams, organizationId) => 
  getEntityReport(Task, queryParams, organizationId, [
    { path: 'projectId', select: 'name code' },
    { path: 'assignedToId', select: 'firstName lastName' }
  ], ['title']);

const getHelpDeskReport = (queryParams, organizationId) => 
  getEntityReport(HelpDeskTicket, queryParams, organizationId, { path: 'raisedById', select: 'firstName lastName' }, ['ticketNumber', 'subject']);

const getAssetReport = (queryParams, organizationId) => 
  getEntityReport(Asset, queryParams, organizationId, null, ['name', 'assetTag']);


module.exports = {
  getExecutiveDashboard,
  getHRDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
  getAttendanceReport,
  getLeaveReport,
  getPayrollReport,
  getProjectReport,
  getTaskReport,
  getHelpDeskReport,
  getAssetReport
};
