/**
 * leaveController.js — Phase 4B: Leave Management Module
 * Controller endpoints for Leave Types, Leave Balances, and Leave Requests.
 * Zero business logic — all logic is delegated to leaveService.
 *
 * Authority: API_SPECIFICATION.md Section 7.2, 7.4, 7.5
 */

const leaveService = require('../services/leaveService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

// ─── Leave Types ─────────────────────────────────────────────────────────────

const createType = async (req, res, next) => {
  try {
    const data = await leaveService.createLeaveType(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Leave type created successfully', data);
  } catch (error) { next(error); }
};

const getTypes = async (req, res, next) => {
  try {
    const data = await leaveService.getLeaveTypes(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Leave types retrieved successfully', data);
  } catch (error) { next(error); }
};

const getTypeById = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.getLeaveTypeById(id, req.user);
    sendSuccess(res, 200, 'Leave type retrieved successfully', data);
  } catch (error) { next(error); }
};

const updateType = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.updateLeaveType(id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Leave type updated successfully', data);
  } catch (error) { next(error); }
};

const archiveType = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    await leaveService.archiveLeaveType(id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

// ─── Leave Balances ──────────────────────────────────────────────────────────

const getBalances = async (req, res, next) => {
  try {
    const data = await leaveService.getLeaveBalances(req.query, req.user);
    sendSuccess(res, 200, 'Leave balances retrieved successfully', data);
  } catch (error) { next(error); }
};

const getMyBalances = async (req, res, next) => {
  try {
    const data = await leaveService.getMyLeaveBalances(req.query, req.user);
    sendSuccess(res, 200, 'My leave balances retrieved successfully', data);
  } catch (error) { next(error); }
};

// ─── Leave Requests ──────────────────────────────────────────────────────────

const submitRequest = async (req, res, next) => {
  try {
    const data = await leaveService.submitLeaveRequest(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Leave request submitted successfully', data);
  } catch (error) { next(error); }
};

const getRequests = async (req, res, next) => {
  try {
    const data = await leaveService.getLeaveRequests(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Leave requests retrieved successfully', data);
  } catch (error) { next(error); }
};

const getMyRequests = async (req, res, next) => {
  try {
    const data = await leaveService.getMyLeaveRequests(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'My leave requests retrieved successfully', data);
  } catch (error) { next(error); }
};

const getRequestById = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.getLeaveRequestById(id, req.user);
    sendSuccess(res, 200, 'Leave request retrieved successfully', data);
  } catch (error) { next(error); }
};

const approveRequest = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.approveLeaveRequest(id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Leave request approved successfully', data);
  } catch (error) { next(error); }
};

const rejectRequest = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.rejectLeaveRequest(id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Leave request rejected successfully', data);
  } catch (error) { next(error); }
};

const cancelRequest = async (req, res, next) => {
  try {
    const id = req.validatedParams?.id || req.params.id;
    const data = await leaveService.cancelLeaveRequest(id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Leave request cancelled successfully', data);
  } catch (error) { next(error); }
};

module.exports = {
  createType,
  getTypes,
  getTypeById,
  updateType,
  archiveType,
  getBalances,
  getMyBalances,
  submitRequest,
  getRequests,
  getMyRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  cancelRequest,
};
