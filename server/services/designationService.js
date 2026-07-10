const Designation = require('../models/Designation');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

const createDesignation = async (data, reqUser) => {
  if (data.code) {
    let query = { code: data.code, organizationId: reqUser.organizationId };
    const existing = await Designation.findOne(query);
    if (existing) {
      throw new ConflictError('Designation with this code already exists.');
    }
  } else if ('Designation' === 'Holiday') {
    const existing = await Designation.findOne({ date: data.date, organizationId: reqUser.organizationId });
    if (existing) {
      throw new ConflictError('Designation with this date already exists.');
    }
  }

  const designation = await Designation.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DESIGNATION_CREATED',
    entityType: 'Designation',
    entityId: designation._id,
    newValue: data,
    outcome: 'Success',
  });

  return designation;
};

const getDesignations = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;

  let searchFields = ['name', 'code', 'title'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Designation.countDocuments(combinedQuery);
  const items = await Designation.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getDesignationById = async (id, reqUser) => {
  const designation = await Designation.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!designation) throw new NotFoundError('Designation not found.');
  return designation;
};

const updateDesignation = async (id, data, reqUser) => {
  const designation = await Designation.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!designation) throw new NotFoundError('Designation not found.');

  const previousValue = designation.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) designation[key] = data[key];
  });
  await designation.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DESIGNATION_UPDATED',
    entityType: 'Designation',
    entityId: designation._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return designation;
};

const deleteDesignation = async (id, reqUser) => {
  const designation = await Designation.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!designation) throw new NotFoundError('Designation not found.');

  if ('Designation' === 'Department') {
    const empCount = await Employee.countDocuments({ departmentId: id, status: { $ne: 'archived' } });
    if (empCount > 0) throw new BadRequestError('Cannot archive department with active employees.');
  }

  designation.status = 'archived';
  await designation.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DESIGNATION_ARCHIVED',
    entityType: 'Designation',
    entityId: designation._id,
    outcome: 'Success',
  });

  return { message: 'Designation archived successfully.' };
};

module.exports = {
  createDesignation,
  getDesignations,
  getDesignationById,
  updateDesignation,
  deleteDesignation,
};
