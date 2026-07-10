const holidayService = require('../services/holidayService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const create = async (req, res, next) => {
  try {
    const data = await holidayService.createHoliday(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Holiday created successfully', data);
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await holidayService.getHolidays(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Holidays retrieved successfully', data);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const data = await holidayService.getHolidayById(req.validatedParams?.id || req.params.id, req.user);
    sendSuccess(res, 200, 'Holiday retrieved successfully', data);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = await holidayService.updateHoliday(req.validatedParams?.id || req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Holiday updated successfully', data);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await holidayService.deleteHoliday(req.validatedParams?.id || req.params.id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
