const Shift = require('../models/Shift');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

const createShift = async (data, reqUser) => {
  if (data.code) {
    let query = { code: data.code, organizationId: reqUser.organizationId };
    const existing = await Shift.findOne(query);
    if (existing) {
      throw new ConflictError('Shift with this code already exists.');
    }
  } else if ('Shift' === 'Holiday') {
    const existing = await Shift.findOne({ date: data.date, organizationId: reqUser.organizationId });
    if (existing) {
      throw new ConflictError('Shift with this date already exists.');
    }
  }

  const shift = await Shift.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'SHIFT_CREATED',
    entityType: 'Shift',
    entityId: shift._id,
    newValue: data,
    outcome: 'Success',
  });

  return shift;
};

const getShifts = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;

  let searchFields = ['name', 'code', 'title'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Shift.countDocuments(combinedQuery);
  const items = await Shift.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getShiftById = async (id, reqUser) => {
  const shift = await Shift.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!shift) throw new NotFoundError('Shift not found.');
  return shift;
};

const updateShift = async (id, data, reqUser) => {
  const shift = await Shift.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!shift) throw new NotFoundError('Shift not found.');

  const previousValue = shift.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) shift[key] = data[key];
  });
  await shift.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'SHIFT_UPDATED',
    entityType: 'Shift',
    entityId: shift._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return shift;
};

const deleteShift = async (id, reqUser) => {
  const shift = await Shift.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!shift) throw new NotFoundError('Shift not found.');

  if ('Shift' === 'Department') {
    const empCount = await Employee.countDocuments({ departmentId: id, status: { $ne: 'archived' } });
    if (empCount > 0) throw new BadRequestError('Cannot archive department with active employees.');
  }

  shift.status = 'archived';
  await shift.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'SHIFT_ARCHIVED',
    entityType: 'Shift',
    entityId: shift._id,
    outcome: 'Success',
  });

  return { message: 'Shift archived successfully.' };
};

module.exports = {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  deleteShift,
};
