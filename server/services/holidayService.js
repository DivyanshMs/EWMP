const Holiday = require('../models/Holiday');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

const createHoliday = async (data, reqUser) => {
  if (data.code) {
    let query = { code: data.code, organizationId: reqUser.organizationId };
    const existing = await Holiday.findOne(query);
    if (existing) {
      throw new ConflictError('Holiday with this code already exists.');
    }
  } else if ('Holiday' === 'Holiday') {
    const existing = await Holiday.findOne({ date: data.date, organizationId: reqUser.organizationId });
    if (existing) {
      throw new ConflictError('Holiday with this date already exists.');
    }
  }

  const holiday = await Holiday.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'HOLIDAY_CREATED',
    entityType: 'Holiday',
    entityId: holiday._id,
    newValue: data,
    outcome: 'Success',
  });

  return holiday;
};

const getHolidays = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;

  let searchFields = ['name', 'code', 'title'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Holiday.countDocuments(combinedQuery);
  const items = await Holiday.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getHolidayById = async (id, reqUser) => {
  const holiday = await Holiday.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!holiday) throw new NotFoundError('Holiday not found.');
  return holiday;
};

const updateHoliday = async (id, data, reqUser) => {
  const holiday = await Holiday.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!holiday) throw new NotFoundError('Holiday not found.');

  const previousValue = holiday.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) holiday[key] = data[key];
  });
  await holiday.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'HOLIDAY_UPDATED',
    entityType: 'Holiday',
    entityId: holiday._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return holiday;
};

const deleteHoliday = async (id, reqUser) => {
  const holiday = await Holiday.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!holiday) throw new NotFoundError('Holiday not found.');

  if ('Holiday' === 'Department') {
    const empCount = await Employee.countDocuments({ departmentId: id, status: { $ne: 'archived' } });
    if (empCount > 0) throw new BadRequestError('Cannot archive department with active employees.');
  }

  holiday.status = 'archived';
  await holiday.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'HOLIDAY_ARCHIVED',
    entityType: 'Holiday',
    entityId: holiday._id,
    outcome: 'Success',
  });

  return { message: 'Holiday archived successfully.' };
};

module.exports = {
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
};
