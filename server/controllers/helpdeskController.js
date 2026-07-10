const helpDeskService = require('../services/helpDeskService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/tickets
 * List Tickets
 */
const getTickets = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await helpDeskService.getTickets(req.query, req.user.organizationId, employeeId, req.user.role);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Tickets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tickets/my
 * Get My Tickets
 */
const getMyTickets = async (req, res, next) => {
  try {
    req.query.raisedById = req.user.employeeId;
    const result = await helpDeskService.getTickets(req.query, req.user.organizationId, req.user.employeeId, 'EMPLOYEE');
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'My tickets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tickets/:id
 * Get Ticket by ID
 */
const getTicketById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await helpDeskService.getTicketById(req.params.id, req.user.organizationId, employeeId, req.user.role);
    sendSuccess(res, result, 'Ticket retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tickets
 * Create Ticket
 */
const createTicket = async (req, res, next) => {
  try {
    const result = await helpDeskService.createTicket(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Ticket created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tickets/:id
 * Update Ticket
 */
const updateTicket = async (req, res, next) => {
  try {
    const result = await helpDeskService.updateTicket(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Ticket updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tickets/:id/assign
 * Assign Ticket
 */
const assignTicket = async (req, res, next) => {
  try {
    const result = await helpDeskService.assignTicket(req.params.id, req.body.assignedToId, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Ticket assigned successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tickets/:id/status
 * Change Ticket Status
 */
const changeTicketStatus = async (req, res, next) => {
  try {
    const result = await helpDeskService.changeTicketStatus(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, `Ticket status changed to ${req.body.ticketStatus}`);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tickets/:id/comments
 * Add Comment
 */
const addComment = async (req, res, next) => {
  try {
    const result = await helpDeskService.addComment(req.params.id, req.body.text, req.user.organizationId, req.user.employeeId, req.user);
    sendSuccess(res, result, 'Comment added successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tickets/:id
 * Delete Ticket
 */
const deleteTicket = async (req, res, next) => {
  try {
    await helpDeskService.deleteTicket(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Ticket archived successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getMyTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignTicket,
  changeTicketStatus,
  addComment,
  deleteTicket,
};
