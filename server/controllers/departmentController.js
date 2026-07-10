const departmentService = require('../services/departmentService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const create = async (req, res, next) => {
  try {
    const data = await departmentService.createDepartment(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Department created successfully', data);
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await departmentService.getDepartments(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Departments retrieved successfully', data);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const data = await departmentService.getDepartmentById(req.validatedParams?.id || req.params.id, req.user);
    sendSuccess(res, 200, 'Department retrieved successfully', data);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = await departmentService.updateDepartment(req.validatedParams?.id || req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Department updated successfully', data);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await departmentService.deleteDepartment(req.validatedParams?.id || req.params.id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
