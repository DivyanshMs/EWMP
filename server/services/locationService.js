const Location = require('../models/Location');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

const createLocation = async (data, reqUser) => {
  if (data.code) {
    let query = { code: data.code, organizationId: reqUser.organizationId };
    const existing = await Location.findOne(query);
    if (existing) {
      throw new ConflictError('Location with this code already exists.');
    }
  } else if ('Location' === 'Holiday') {
    const existing = await Location.findOne({ date: data.date, organizationId: reqUser.organizationId });
    if (existing) {
      throw new ConflictError('Location with this date already exists.');
    }
  }

  const location = await Location.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LOCATION_CREATED',
    entityType: 'Location',
    entityId: location._id,
    newValue: data,
    outcome: 'Success',
  });

  return location;
};

const getLocations = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;

  let searchFields = ['name', 'code', 'title'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Location.countDocuments(combinedQuery);
  const items = await Location.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getLocationById = async (id, reqUser) => {
  const location = await Location.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!location) throw new NotFoundError('Location not found.');
  return location;
};

const updateLocation = async (id, data, reqUser) => {
  const location = await Location.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!location) throw new NotFoundError('Location not found.');

  const previousValue = location.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) location[key] = data[key];
  });
  await location.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LOCATION_UPDATED',
    entityType: 'Location',
    entityId: location._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return location;
};

const deleteLocation = async (id, reqUser) => {
  const location = await Location.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!location) throw new NotFoundError('Location not found.');

  if ('Location' === 'Department') {
    const empCount = await Employee.countDocuments({ departmentId: id, status: { $ne: 'archived' } });
    if (empCount > 0) throw new BadRequestError('Cannot archive department with active employees.');
  }

  location.status = 'archived';
  await location.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'LOCATION_ARCHIVED',
    entityType: 'Location',
    entityId: location._id,
    outcome: 'Success',
  });

  return { message: 'Location archived successfully.' };
};

module.exports = {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};
