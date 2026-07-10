const reportService = require('../services/reportService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/dashboard/executive
 */
const getExecutiveDashboard = async (req, res, next) => {
  try {
    const result = await reportService.getExecutiveDashboard(req.user.organizationId);
    sendSuccess(res, result, 'Executive dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/hr
 */
const getHRDashboard = async (req, res, next) => {
  try {
    const result = await reportService.getHRDashboard(req.user.organizationId);
    sendSuccess(res, result, 'HR dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/manager
 */
const getManagerDashboard = async (req, res, next) => {
  try {
    const result = await reportService.getManagerDashboard(req.user.organizationId, req.user.employeeId, req.query.departmentId);
    sendSuccess(res, result, 'Manager dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/employee
 */
const getEmployeeDashboard = async (req, res, next) => {
  try {
    const result = await reportService.getEmployeeDashboard(req.user.organizationId, req.user.employeeId);
    sendSuccess(res, result, 'Employee dashboard retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Generic Report Handler wrapper
 */
const handleReportRequest = (serviceMethod, successMessage) => async (req, res, next) => {
  try {
    const result = await serviceMethod(req.query, req.user.organizationId);
    if (req.query.export === 'true') {
      sendSuccess(res, result.data, successMessage);
    } else {
      sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, successMessage);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExecutiveDashboard,
  getHRDashboard,
  getManagerDashboard,
  getEmployeeDashboard,
  
  getAttendanceReport: handleReportRequest(reportService.getAttendanceReport, 'Attendance report retrieved successfully'),
  getLeaveReport: handleReportRequest(reportService.getLeaveReport, 'Leave report retrieved successfully'),
  getPayrollReport: handleReportRequest(reportService.getPayrollReport, 'Payroll report retrieved successfully'),
  getProjectReport: handleReportRequest(reportService.getProjectReport, 'Project report retrieved successfully'),
  getTaskReport: handleReportRequest(reportService.getTaskReport, 'Task report retrieved successfully'),
  getHelpDeskReport: handleReportRequest(reportService.getHelpDeskReport, 'Help Desk report retrieved successfully'),
  getAssetReport: handleReportRequest(reportService.getAssetReport, 'Asset report retrieved successfully'),
};
