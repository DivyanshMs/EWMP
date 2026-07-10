const taskService = require('../services/taskService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/tasks
 * List Tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await taskService.getTasks(req.query, req.user.organizationId, employeeId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/my
 * Get My Tasks
 */
const getMyTasks = async (req, res, next) => {
  try {
    req.query.assignedToId = req.user.employeeId;
    const result = await taskService.getTasks(req.query, req.user.organizationId, null);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'My tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * Get Task by ID
 */
const getTaskById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await taskService.getTaskById(req.params.id, req.user.organizationId, employeeId);
    sendSuccess(res, result, 'Task retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create Task
 */
const createTask = async (req, res, next) => {
  try {
    // If reportedById is not provided, use the logged-in user's employee ID
    if (!req.body.reportedById) {
      req.body.reportedById = req.user.employeeId;
    }
    const result = await taskService.createTask(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Task created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update Task
 */
const updateTask = async (req, res, next) => {
  try {
    const result = await taskService.updateTask(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/status
 * Update Task Status
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const result = await taskService.updateTaskStatus(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Task status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks/:id/comments
 * Add Comment to Task
 */
const addComment = async (req, res, next) => {
  try {
    const result = await taskService.addComment(req.params.id, req.body.text, req.user.organizationId, req.user.employeeId, req.user);
    sendSuccess(res, result, 'Comment added successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Archive Task
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Task archived successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  addComment,
  deleteTask,
};
