/**
 * employeeValidator.js — Phase 4A: Employee Management
 * Implements: API_SPECIFICATION.md Section 6.6 & 7.13
 * Delegates all business logic to employeeService and formats responses using formatResponse.
 */

const employeeService = require('../services/employeeService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { BadRequestError } = require('../utils/AppError');

/**
 * GET /api/employees
 * List employees with pagination, filtering, search, and role scoping.
 */
const getEmployees = asyncHandler(async (req, res) => {
  const result = await employeeService.getEmployees(req.query, req.user);
  return sendPaginatedSuccess(
    res,
    'Employees retrieved successfully',
    result.items,
    result.total,
    result.page,
    result.limit
  );
});

/**
 * POST /api/employees
 * Create a new employee and user account atomically.
 */
const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.validatedBody || req.body, req.user);
  return sendSuccess(res, 201, 'Employee created successfully', employee);
});

/**
 * GET /api/employees/:id
 * Get single employee profile with role-scoped PII access.
 */
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id, req.user);
  return sendSuccess(res, 200, 'Employee profile retrieved successfully', employee);
});

/**
 * PUT /api/employees/:id
 * Update an employee profile.
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(
    req.params.id,
    req.validatedBody || req.body,
    req.user
  );
  return sendSuccess(res, 200, 'Employee updated successfully', employee);
});

/**
 * PATCH /api/employees/:id/status
 * Update employment status (Probation, Permanent, Notice Period, Resigned, Terminated).
 */
const updateEmploymentStatus = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmploymentStatus(
    req.params.id,
    req.validatedBody || req.body,
    req.user
  );
  return sendSuccess(res, 200, 'Employment status updated successfully', employee);
});

/**
 * DELETE /api/employees/:id
 * Soft archive an employee and deactivate their user account.
 */
const archiveEmployee = asyncHandler(async (req, res) => {
  const result = await employeeService.archiveEmployee(req.params.id, req.user);
  return sendSuccess(res, 200, result.message, null);
});

/**
 * GET /api/employees/:id/timeline
 * Get audit log timeline events for an employee.
 */
const getEmployeeTimeline = asyncHandler(async (req, res) => {
  const timeline = await employeeService.getEmployeeTimeline(req.params.id, req.user);
  return sendSuccess(res, 200, 'Employee timeline retrieved successfully', timeline);
});

/**
 * PATCH /api/employees/:id/photo
 * Upload profile photo to Cloudinary and update profile.
 */
const updateProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Profile photo image file is required.');
  }
  const employee = await employeeService.updateProfilePhoto(
    req.params.id,
    req.file.buffer,
    req.user
  );
  return sendSuccess(res, 200, 'Profile photo updated successfully', employee);
});

/**
 * GET /api/employees/:id/documents
 * List documents belonging to an employee.
 */
const listEmployeeDocuments = asyncHandler(async (req, res) => {
  const documents = await employeeService.listEmployeeDocuments(
    req.params.id,
    req.query,
    req.user
  );
  return sendSuccess(res, 200, 'Employee documents retrieved successfully', documents);
});

/**
 * POST /api/employees/:id/documents
 * Upload a document for an employee to Cloudinary and save metadata.
 */
const uploadEmployeeDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('Document file is required.');
  }
  const document = await employeeService.uploadEmployeeDocument(
    req.params.id,
    req.validatedBody || req.body,
    req.file,
    req.user
  );
  return sendSuccess(res, 201, 'Employee document uploaded successfully', document);
});

/**
 * PATCH /api/employees/:id/documents/:docId/verify
 * Verify an uploaded employee document.
 */
const verifyEmployeeDocument = asyncHandler(async (req, res) => {
  const document = await employeeService.verifyEmployeeDocument(
    req.params.id,
    req.params.docId,
    req.validatedBody || req.body,
    req.user
  );
  return sendSuccess(res, 200, 'Employee document verified successfully', document);
});

/**
 * DELETE /api/employees/:id/documents/:docId
 * Soft delete an employee document and remove from Cloudinary.
 */
const deleteEmployeeDocument = asyncHandler(async (req, res) => {
  const result = await employeeService.deleteEmployeeDocument(
    req.params.id,
    req.params.docId,
    req.user
  );
  return sendSuccess(res, 200, result.message, null);
});

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  updateEmploymentStatus,
  archiveEmployee,
  getEmployeeTimeline,
  updateProfilePhoto,
  listEmployeeDocuments,
  uploadEmployeeDocument,
  verifyEmployeeDocument,
  deleteEmployeeDocument,
};
