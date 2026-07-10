const locationService = require('../services/locationService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

const create = async (req, res, next) => {
  try {
    const data = await locationService.createLocation(req.validatedBody, req.user);
    sendSuccess(res, 201, 'Location created successfully', data);
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const data = await locationService.getLocations(req.query, req.user);
    sendPaginatedSuccess(res, 200, 'Locations retrieved successfully', data);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const data = await locationService.getLocationById(req.validatedParams?.id || req.params.id, req.user);
    sendSuccess(res, 200, 'Location retrieved successfully', data);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const data = await locationService.updateLocation(req.validatedParams?.id || req.params.id, req.validatedBody, req.user);
    sendSuccess(res, 200, 'Location updated successfully', data);
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await locationService.deleteLocation(req.validatedParams?.id || req.params.id, req.user);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove };
