const Task = require('../models/Task');
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
 * Get paginated list of tasks
 */
const getTasks = async (queryParams, organizationId, employeeId = null) => {
  const { page = 1, limit = 10, search, projectId, taskStatus, priority, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (projectId) query.projectId = projectId;
  if (taskStatus) query.taskStatus = taskStatus;
  if (priority) query.priority = priority;

  // Data Scoping: If queried by an EMPLOYEE, they see tasks assigned to them or reported by them
  if (employeeId) {
    query.$or = [
      { assignedToId: employeeId },
      { reportedById: employeeId }
    ];
  }

  // Search by title or tags
  if (search) {
    Object.assign(query, buildSearchQuery(search, ['title', 'tags']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Task.find(query)
      .populate('projectId', 'name code')
      .populate('assignedToId', 'firstName lastName employeeCode')
      .populate('reportedById', 'firstName lastName employeeCode')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Task.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get task by ID
 */
const getTaskById = async (id, organizationId, employeeId = null) => {
  const query = { _id: id, organizationId, status: 'active' };

  if (employeeId) {
    query.$or = [
      { assignedToId: employeeId },
      { reportedById: employeeId }
    ];
  }

  const task = await Task.findOne(query)
    .populate('projectId', 'name code')
    .populate('assignedToId', 'firstName lastName employeeCode')
    .populate('reportedById', 'firstName lastName employeeCode')
    .populate('comments.authorId', 'firstName lastName profilePhotoUrl');

  if (!task) {
    throw new AppError(404, 'Task not found or unauthorized');
  }

  return task;
};

/**
 * Create a new task
 */
const createTask = async (data, organizationId, user) => {
  const task = await Task.create({
    ...data,
    organizationId,
    createdBy: user._id,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_TASK',
    entityType: 'Task',
    entityId: task._id,
    newValue: task,
  });

  logInfo(`Task created: ${task._id}`);
  return task;
};

/**
 * Update task details (including reassign)
 */
const updateTask = async (id, data, organizationId, user) => {
  const task = await Task.findOne({ _id: id, organizationId, status: 'active' });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  const previousValue = task.toObject();

  // If status is completed manually through updateTask instead of updateTaskStatus
  if (data.taskStatus === 'Completed' && task.taskStatus !== 'Completed') {
    data.completedAt = new Date();
  }

  Object.assign(task, data);
  await task.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_TASK',
    entityType: 'Task',
    entityId: task._id,
    previousValue,
    newValue: task,
  });

  logInfo(`Task updated: ${task._id}`);
  return task;
};

/**
 * Update task status
 */
const updateTaskStatus = async (id, data, organizationId, user) => {
  const task = await Task.findOne({ _id: id, organizationId, status: 'active' });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  const { taskStatus, blockedReason } = data;
  const previousValue = { taskStatus: task.taskStatus, blockedReason: task.blockedReason, completedAt: task.completedAt };

  task.taskStatus = taskStatus;
  
  if (taskStatus === 'Blocked') {
    task.blockedReason = blockedReason || 'No reason provided';
  } else {
    task.blockedReason = null;
  }

  if (taskStatus === 'Completed') {
    task.completedAt = new Date();
  } else {
    task.completedAt = null;
  }

  await task.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_TASK_STATUS',
    entityType: 'Task',
    entityId: task._id,
    previousValue,
    newValue: { taskStatus: task.taskStatus, blockedReason: task.blockedReason, completedAt: task.completedAt },
  });

  logInfo(`Task status updated to ${task.taskStatus}: ${task._id}`);
  return task;
};

/**
 * Add a comment to a task
 */
const addComment = async (id, text, organizationId, employeeId, user) => {
  const task = await Task.findOne({ _id: id, organizationId, status: 'active' });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  task.comments.push({
    authorId: employeeId,
    text,
    createdAt: new Date(),
  });

  await task.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'ADD_TASK_COMMENT',
    entityType: 'Task',
    entityId: task._id,
  });

  logInfo(`Comment added to task: ${task._id}`);
  return task;
};

/**
 * Delete (Archive) task
 */
const deleteTask = async (id, organizationId, user) => {
  const task = await Task.findOne({ _id: id, organizationId, status: 'active' });
  if (!task) {
    throw new AppError(404, 'Task not found');
  }

  task.status = 'archived';
  await task.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'DELETE_TASK',
    entityType: 'Task',
    entityId: task._id,
  });

  logInfo(`Task archived: ${task._id}`);
  return null;
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  addComment,
  deleteTask,
};
