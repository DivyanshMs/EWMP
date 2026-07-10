const payrollService = require('../services/payrollService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/payroll
 * List Payroll Records
 */
const getPayrolls = async (req, res, next) => {
  try {
    const result = await payrollService.getPayrolls(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Payroll records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payroll/my
 * Get My Payroll Records
 */
const getMyPayrolls = async (req, res, next) => {
  try {
    req.query.employeeId = req.user.employeeId;
    const result = await payrollService.getPayrolls(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'My payroll records retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payroll/process
 * Process Payroll Run
 */
const processPayroll = async (req, res, next) => {
  try {
    const result = await payrollService.processPayrollRun(req.body, req.user.organizationId, req.user._id);
    sendSuccess(res, 201, 'Payroll run processed successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payroll/:id
 * Get Payroll Record by ID
 */
const getPayrollById = async (req, res, next) => {
  try {
    // If role is EMPLOYEE, they can only view their own payroll
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await payrollService.getPayrollById(req.params.id, req.user.organizationId, employeeId);
    sendSuccess(res, 200, 'Payroll record retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/payroll/:id/approve
 * Approve Payroll
 */
const approvePayroll = async (req, res, next) => {
  try {
    const result = await payrollService.approvePayroll(req.params.id, req.user.organizationId, req.user._id);
    sendSuccess(res, 200, 'Payroll approved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/payroll/:id/mark-paid
 * Mark Payroll as Paid
 */
const markPaid = async (req, res, next) => {
  try {
    const result = await payrollService.markPaid(req.params.id, req.user.organizationId);
    sendSuccess(res, 200, 'Payroll marked as paid successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payslips/my
 * Get My Payslips
 */
const getMyPayslips = async (req, res, next) => {
  try {
    req.query.employeeId = req.user.employeeId;
    const result = await payrollService.getPayslips(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'My payslips retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payslips/:id
 * Get Payslip by ID
 */
const getPayslipById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await payrollService.getPayslipById(req.params.id, req.user.organizationId, employeeId);
    sendSuccess(res, 200, 'Payslip retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPayrolls,
  getMyPayrolls,
  processPayroll,
  getPayrollById,
  approvePayroll,
  markPaid,
  getMyPayslips,
  getPayslipById,
};
