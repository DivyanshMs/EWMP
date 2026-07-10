const Project = require('../models/Project');
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

/**
 * Get paginated list of projects
 */
const getProjects = async (queryParams, organizationId, employeeId = null) => {
  const { page = 1, limit = 10, search, projectStatus, departmentId, priority, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (projectStatus) query.projectStatus = projectStatus;
  if (departmentId) query.departmentId = departmentId;
  if (priority) query.priority = priority;

  // Data Scoping: If queried by an EMPLOYEE, they can only see projects they manage or are a team member of
  if (employeeId) {
    query.$or = [
      { projectManagerId: employeeId },
      { teamMemberIds: employeeId }
    ];
  }

  // Search by name or code
  if (search) {
    Object.assign(query, buildSearchQuery(search, ['name', 'code']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Project.find(query)
      .populate('projectManagerId', 'firstName lastName employeeCode')
      .populate('departmentId', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Project.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get project by ID
 */
const getProjectById = async (id, organizationId, employeeId = null) => {
  const query = { _id: id, organizationId, status: 'active' };

  if (employeeId) {
    query.$or = [
      { projectManagerId: employeeId },
      { teamMemberIds: employeeId }
    ];
  }

  const project = await Project.findOne(query)
    .populate('projectManagerId', 'firstName lastName employeeCode')
    .populate('teamMemberIds', 'firstName lastName employeeCode')
    .populate('departmentId', 'name');

  if (!project) {
    throw new AppError(404, 'Project not found or unauthorized');
  }

  return project;
};

/**
 * Create a new project
 */
const createProject = async (data, organizationId, user) => {
  const existingProject = await Project.findOne({ organizationId, code: data.code });
  if (existingProject) {
    throw new AppError(400, 'Project code already exists in this organization');
  }

  const project = await Project.create({
    ...data,
    organizationId,
    createdBy: user._id,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_PROJECT',
    entityType: 'Project',
    entityId: project._id,
    newValue: project,
  });

  logInfo(`Project created: ${project.code}`);
  return project;
};

/**
 * Update project details
 */
const updateProject = async (id, data, organizationId, user) => {
  const project = await Project.findOne({ _id: id, organizationId, status: 'active' });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const previousValue = project.toObject();

  Object.assign(project, data);
  await project.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_PROJECT',
    entityType: 'Project',
    entityId: project._id,
    previousValue,
    newValue: project,
  });

  logInfo(`Project updated: ${project.code}`);
  return project;
};

/**
 * Update project status
 */
const updateProjectStatus = async (id, data, organizationId, user) => {
  const project = await Project.findOne({ _id: id, organizationId, status: 'active' });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  const { projectStatus, actualEndDate } = data;

  if (projectStatus === 'Completed' && !actualEndDate) {
    throw new AppError(400, 'actualEndDate is required when marking project as Completed');
  }

  const previousValue = { projectStatus: project.projectStatus, actualEndDate: project.actualEndDate };

  project.projectStatus = projectStatus;
  if (actualEndDate) {
    project.actualEndDate = actualEndDate;
  }

  await project.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_PROJECT_STATUS',
    entityType: 'Project',
    entityId: project._id,
    previousValue,
    newValue: { projectStatus: project.projectStatus, actualEndDate: project.actualEndDate },
  });

  logInfo(`Project status updated to ${project.projectStatus}: ${project.code}`);
  return project;
};

/**
 * Delete (Archive) project
 */
const deleteProject = async (id, organizationId, user) => {
  const project = await Project.findOne({ _id: id, organizationId, status: 'active' });
  if (!project) {
    throw new AppError(404, 'Project not found');
  }

  project.status = 'archived';
  await project.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'DELETE_PROJECT',
    entityType: 'Project',
    entityId: project._id,
  });

  logInfo(`Project archived: ${project.code}`);
  return null;
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};
