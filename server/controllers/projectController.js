const projectService = require('../services/projectService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/projects
 * List Projects
 */
const getProjects = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await projectService.getProjects(req.query, req.user.organizationId, employeeId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Projects retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * Get Project by ID
 */
const getProjectById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await projectService.getProjectById(req.params.id, req.user.organizationId, employeeId);
    sendSuccess(res, result, 'Project retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects
 * Create Project
 */
const createProject = async (req, res, next) => {
  try {
    const result = await projectService.createProject(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Project created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 * Update Project
 */
const updateProject = async (req, res, next) => {
  try {
    const result = await projectService.updateProject(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/projects/:id/status
 * Update Project Status
 */
const updateProjectStatus = async (req, res, next) => {
  try {
    const result = await projectService.updateProjectStatus(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Project status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Archive Project
 */
const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteProject(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Project archived successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};
