const assetService = require('../services/assetService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/assets
 * List Assets
 */
const getAssets = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await assetService.getAssets(req.query, req.user.organizationId, employeeId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Assets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assets/my
 * Get My Allocated Assets
 */
const getMyAssets = async (req, res, next) => {
  try {
    const result = await assetService.getAssets(req.query, req.user.organizationId, req.user.employeeId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'My assets retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/assets/:id
 * Get Asset by ID
 */
const getAssetById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await assetService.getAssetById(req.params.id, req.user.organizationId, employeeId);
    sendSuccess(res, result, 'Asset retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assets
 * Create Asset
 */
const createAsset = async (req, res, next) => {
  try {
    const result = await assetService.createAsset(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Asset created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/assets/:id
 * Update Asset
 */
const updateAsset = async (req, res, next) => {
  try {
    const result = await assetService.updateAsset(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Asset updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/assets/:id/allocate
 * Allocate Asset to Employee
 */
const allocateAsset = async (req, res, next) => {
  try {
    const result = await assetService.allocateAsset(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Asset allocated successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/asset-allocations/:id/return
 * Return Allocated Asset
 */
const returnAsset = async (req, res, next) => {
  try {
    const result = await assetService.returnAsset(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Asset returned successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/asset-allocations
 * List Asset Allocations (History)
 */
const getAssetAllocations = async (req, res, next) => {
  try {
    const result = await assetService.getAssetAllocations(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Asset allocations retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/assets/:id
 * Archive Asset
 */
const deleteAsset = async (req, res, next) => {
  try {
    await assetService.deleteAsset(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Asset archived successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssets,
  getMyAssets,
  getAssetById,
  createAsset,
  updateAsset,
  allocateAsset,
  returnAsset,
  getAssetAllocations,
  deleteAsset,
};
