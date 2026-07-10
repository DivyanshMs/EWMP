const designationService = require('../services/designationService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const create = async (req, res, next) => {
  try {
    const data = await designationService.createDesignation(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Designation created successfully', data);
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await designationService.getDesignations(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Designations retrieved successfully', data);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const data = await designationService.getDesignationById(req.validatedParams?.id || req.params.id, req.user);
    sendSuccess(res, 200, 'Designation retrieved successfully', data);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = await designationService.updateDesignation(req.validatedParams?.id || req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Designation updated successfully', data);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await designationService.deleteDesignation(req.validatedParams?.id || req.params.id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
