const Department = require('../models/Department');
const Employee = require('../models/Employee');
const AuditLog = require('../models/AuditLog');
const { getPaginationParams, getPaginationMetadata } = require('../utils/paginationHelper');
const { buildFilterQuery, buildSearchQuery, buildSortQuery } = require('../utils/queryHelper');
const { NotFoundError, ConflictError, BadRequestError } = require('../utils/AppError');

const createDepartment = async (data, reqUser) => {
  if (data.code) {
    let query = { code: data.code, organizationId: reqUser.organizationId };
    const existing = await Department.findOne(query);
    if (existing) {
      throw new ConflictError('Department with this code already exists.');
    }
  } else if ('Department' === 'Holiday') {
    const existing = await Department.findOne({ date: data.date, organizationId: reqUser.organizationId });
    if (existing) {
      throw new ConflictError('Department with this date already exists.');
    }
  }

  const department = await Department.create({
    ...data,
    organizationId: reqUser.organizationId,
    createdBy: reqUser.userId,
    status: 'active',
  });

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DEPARTMENT_CREATED',
    entityType: 'Department',
    entityId: department._id,
    newValue: data,
    outcome: 'Success',
  });

  return department;
};

const getDepartments = async (query, reqUser) => {
  const { page, limit, skip, sortBy, sortOrder } = getPaginationParams(query);
  const filter = buildFilterQuery(query, ['status']);
  filter.organizationId = reqUser.organizationId;

  let searchFields = ['name', 'code', 'title'];
  const searchQuery = buildSearchQuery(query.search, searchFields);
  const combinedQuery = Object.keys(searchQuery).length > 0 ? { $and: [filter, searchQuery] } : filter;

  const total = await Department.countDocuments(combinedQuery);
  const items = await Department.find(combinedQuery)
    .sort(buildSortQuery(sortBy, sortOrder))
    .skip(skip)
    .limit(limit);

  return { items, ...getPaginationMetadata(total, page, limit) };
};

const getDepartmentById = async (id, reqUser) => {
  const department = await Department.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!department) throw new NotFoundError('Department not found.');
  return department;
};

const updateDepartment = async (id, data, reqUser) => {
  const department = await Department.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!department) throw new NotFoundError('Department not found.');

  const previousValue = department.toObject();
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) department[key] = data[key];
  });
  await department.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DEPARTMENT_UPDATED',
    entityType: 'Department',
    entityId: department._id,
    previousValue,
    newValue: data,
    outcome: 'Success',
  });

  return department;
};

const deleteDepartment = async (id, reqUser) => {
  const department = await Department.findOne({ _id: id, organizationId: reqUser.organizationId });
  if (!department) throw new NotFoundError('Department not found.');

  if ('Department' === 'Department') {
    const empCount = await Employee.countDocuments({ departmentId: id, status: { $ne: 'archived' } });
    if (empCount > 0) throw new BadRequestError('Cannot archive department with active employees.');
  }

  department.status = 'archived';
  await department.save();

  await AuditLog.create({
    organizationId: reqUser.organizationId,
    actorUserId: reqUser.userId,
    actorRole: reqUser.role,
    action: 'DEPARTMENT_ARCHIVED',
    entityType: 'Department',
    entityId: department._id,
    outcome: 'Success',
  });

  return { message: 'Department archived successfully.' };
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
