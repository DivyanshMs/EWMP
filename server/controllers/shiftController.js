const shiftService = require('../services/shiftService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const create = async (req, res, next) => {
  try {
    const data = await shiftService.createShift(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Shift created successfully', data);
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await shiftService.getShifts(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Shifts retrieved successfully', data);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const data = await shiftService.getShiftById(req.validatedParams?.id || req.params.id, req.user);
    sendSuccess(res, 200, 'Shift retrieved successfully', data);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = await shiftService.updateShift(req.validatedParams?.id || req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Shift updated successfully', data);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await shiftService.deleteShift(req.validatedParams?.id || req.params.id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
