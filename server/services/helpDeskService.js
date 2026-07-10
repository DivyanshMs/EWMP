const HelpDeskTicket = require('../models/HelpDeskTicket');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { buildSearchQuery } = require('../utils/queryHelper');
const { logInfo, logError } = require('../utils/loggerHelper');

const createAuditLog = async (data) => {
  try {
    await AuditLog.create(data);
  } catch (err) {
    logError('Audit log creation failed', { error: err.message, data });
  }
};

const generateTicketNumber = async () => {
  let isUnique = false;
  let ticketNumber;
  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    ticketNumber = `TKT-${randomDigits}`;
    const exists = await HelpDeskTicket.exists({ ticketNumber });
    if (!exists) isUnique = true;
  }
  return ticketNumber;
};

/**
 * Get paginated list of tickets
 */
const getTickets = async (queryParams, organizationId, employeeId = null, role = null) => {
  const { page = 1, limit = 10, search, ticketStatus, category, priority, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (ticketStatus) query.ticketStatus = ticketStatus;
  if (category) query.category = category;
  if (priority) query.priority = priority;
  
  if (queryParams.raisedById) query.raisedById = queryParams.raisedById;
  if (queryParams.assignedToId) query.assignedToId = queryParams.assignedToId;

  // Data Scoping: If queried by an EMPLOYEE, they see only tickets they raised
  if (role === 'EMPLOYEE' && employeeId) {
    query.raisedById = employeeId;
  }
  // Data Scoping: If queried by a MANAGER/TEAM_LEAD, they might see tickets assigned to them or their department.
  // We'll enforce that they can see tickets raised by them or assigned to them explicitly if they aren't an admin.
  // But usually Help Desk managers see all tickets. We will assume Admins and Managers see all, employees see their own.

  if (search) {
    Object.assign(query, buildSearchQuery(search, ['ticketNumber', 'subject']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    HelpDeskTicket.find(query)
      .populate('raisedById', 'firstName lastName employeeCode')
      .populate('assignedToId', 'firstName lastName employeeCode')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    HelpDeskTicket.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get ticket by ID
 */
const getTicketById = async (id, organizationId, employeeId = null, role = null) => {
  const query = { _id: id, organizationId, status: 'active' };

  if (role === 'EMPLOYEE' && employeeId) {
    query.raisedById = employeeId;
  }

  const ticket = await HelpDeskTicket.findOne(query)
    .populate('raisedById', 'firstName lastName employeeCode profilePhotoUrl')
    .populate('assignedToId', 'firstName lastName employeeCode profilePhotoUrl')
    .populate('comments.authorId', 'firstName lastName profilePhotoUrl');

  if (!ticket) {
    throw new AppError(404, 'Ticket not found or unauthorized');
  }

  return ticket;
};

/**
 * Create a new ticket
 */
const createTicket = async (data, organizationId, user) => {
  const ticketNumber = await generateTicketNumber();

  const ticket = await HelpDeskTicket.create({
    ...data,
    ticketNumber,
    organizationId,
    raisedById: data.raisedById || user.employeeId,
    createdBy: user._id,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_TICKET',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
    newValue: ticket,
  });

  logInfo(`Ticket created: ${ticket.ticketNumber}`);
  return ticket;
};

/**
 * Update ticket
 */
const updateTicket = async (id, data, organizationId, user) => {
  // Allow creators/admins to update
  const query = { _id: id, organizationId, status: 'active' };
  if (user.role === 'EMPLOYEE') query.raisedById = user.employeeId;

  const ticket = await HelpDeskTicket.findOne(query);
  if (!ticket) {
    throw new AppError(404, 'Ticket not found or unauthorized');
  }

  const previousValue = ticket.toObject();
  Object.assign(ticket, data);
  await ticket.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_TICKET',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
    previousValue,
    newValue: ticket,
  });

  logInfo(`Ticket updated: ${ticket.ticketNumber}`);
  return ticket;
};

/**
 * Assign ticket
 */
const assignTicket = async (id, assignedToId, organizationId, user) => {
  const ticket = await HelpDeskTicket.findOne({ _id: id, organizationId, status: 'active' });
  if (!ticket) {
    throw new AppError(404, 'Ticket not found');
  }

  const previousValue = { assignedToId: ticket.assignedToId, ticketStatus: ticket.ticketStatus };
  
  ticket.assignedToId = assignedToId;
  if (ticket.ticketStatus === 'Open') {
    // If we only stick to the schema enums, 'Assigned' is missing. We leave it 'Open' or 'In Progress'.
    ticket.ticketStatus = 'In Progress';
  }

  await ticket.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'ASSIGN_TICKET',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
    previousValue,
    newValue: { assignedToId: ticket.assignedToId, ticketStatus: ticket.ticketStatus },
  });

  logInfo(`Ticket ${ticket.ticketNumber} assigned to ${assignedToId}`);
  return ticket;
};

/**
 * Change ticket status (Close, Resolve, Reopen)
 */
const changeTicketStatus = async (id, statusData, organizationId, user) => {
  const ticket = await HelpDeskTicket.findOne({ _id: id, organizationId, status: 'active' });
  if (!ticket) {
    throw new AppError(404, 'Ticket not found');
  }

  const previousValue = { 
    ticketStatus: ticket.ticketStatus, 
    resolutionNotes: ticket.resolutionNotes,
    resolvedAt: ticket.resolvedAt,
    closedAt: ticket.closedAt
  };

  ticket.ticketStatus = statusData.ticketStatus;

  if (statusData.ticketStatus === 'Resolved') {
    ticket.resolutionNotes = statusData.resolutionNotes || ticket.resolutionNotes;
    ticket.resolvedAt = new Date();
  } else if (statusData.ticketStatus === 'Closed') {
    ticket.closedAt = new Date();
  } else if (statusData.ticketStatus === 'Reopened') {
    ticket.resolvedAt = null;
    ticket.closedAt = null;
  }

  await ticket.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_TICKET_STATUS',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
    previousValue,
    newValue: { 
      ticketStatus: ticket.ticketStatus, 
      resolutionNotes: ticket.resolutionNotes,
      resolvedAt: ticket.resolvedAt,
      closedAt: ticket.closedAt
    },
  });

  logInfo(`Ticket ${ticket.ticketNumber} status changed to ${ticket.ticketStatus}`);
  return ticket;
};

/**
 * Add comment to ticket
 */
const addComment = async (id, text, organizationId, employeeId, user) => {
  const query = { _id: id, organizationId, status: 'active' };
  if (user.role === 'EMPLOYEE') {
    // Only allow commenting if they raised it (or are assigned to it if they had a technician role)
    query.raisedById = employeeId;
  }

  const ticket = await HelpDeskTicket.findOne(query);
  if (!ticket) {
    throw new AppError(404, 'Ticket not found or unauthorized');
  }

  ticket.comments.push({
    authorId: employeeId,
    text,
    createdAt: new Date(),
  });

  await ticket.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'ADD_TICKET_COMMENT',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
  });

  logInfo(`Comment added to ticket: ${ticket.ticketNumber}`);
  return ticket;
};

/**
 * Delete (Archive) Ticket
 */
const deleteTicket = async (id, organizationId, user) => {
  const ticket = await HelpDeskTicket.findOne({ _id: id, organizationId, status: 'active' });
  if (!ticket) {
    throw new AppError(404, 'Ticket not found');
  }

  ticket.status = 'archived';
  await ticket.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'DELETE_TICKET',
    entityType: 'HelpDeskTicket',
    entityId: ticket._id,
  });

  logInfo(`Ticket archived: ${ticket.ticketNumber}`);
  return null;
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  assignTicket,
  changeTicketStatus,
  addComment,
  deleteTicket,
};
