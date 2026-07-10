const Asset = require('../models/Asset');
const AssetAllocation = require('../models/AssetAllocation');
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
 * Get paginated list of assets
 */
const getAssets = async (queryParams, organizationId, employeeId = null) => {
  const { page = 1, limit = 10, search, assetStatus, assetType, locationId, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (assetStatus) query.assetStatus = assetStatus;
  if (assetType) query.assetType = assetType;
  if (locationId) query.locationId = locationId;

  // Data Scoping: If queried by an EMPLOYEE, they see only assets currently allocated to them
  if (employeeId) {
    const allocations = await AssetAllocation.find({ employeeId, organizationId, allocationStatus: 'Active' });
    const assetIds = allocations.map(a => a.assetId);
    query._id = { $in: assetIds };
  }

  // Search by name, assetTag, or serialNumber
  if (search) {
    Object.assign(query, buildSearchQuery(search, ['name', 'assetTag', 'serialNumber']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Asset.find(query)
      .populate('locationId', 'name')
      .populate({
        path: 'currentAllocationId',
        populate: { path: 'employeeId', select: 'firstName lastName employeeCode' }
      })
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Asset.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get asset by ID
 */
const getAssetById = async (id, organizationId, employeeId = null) => {
  const query = { _id: id, organizationId, status: 'active' };

  if (employeeId) {
    const activeAllocation = await AssetAllocation.findOne({ assetId: id, employeeId, organizationId, allocationStatus: 'Active' });
    if (!activeAllocation) {
      throw new AppError(404, 'Asset not found or unauthorized');
    }
  }

  const asset = await Asset.findOne(query)
    .populate('locationId', 'name')
    .populate({
      path: 'currentAllocationId',
      populate: { path: 'employeeId', select: 'firstName lastName employeeCode' }
    });

  if (!asset) {
    throw new AppError(404, 'Asset not found or unauthorized');
  }

  return asset;
};

/**
 * Create a new asset
 */
const createAsset = async (data, organizationId, user) => {
  const existingAsset = await Asset.findOne({ organizationId, assetTag: data.assetTag });
  if (existingAsset) {
    throw new AppError(400, 'Asset tag already exists in this organization');
  }

  const asset = await Asset.create({
    ...data,
    organizationId,
    createdBy: user._id,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'CREATE_ASSET',
    entityType: 'Asset',
    entityId: asset._id,
    newValue: asset,
  });

  logInfo(`Asset created: ${asset.assetTag}`);
  return asset;
};

/**
 * Update asset details
 */
const updateAsset = async (id, data, organizationId, user) => {
  const asset = await Asset.findOne({ _id: id, organizationId, status: 'active' });
  if (!asset) {
    throw new AppError(404, 'Asset not found');
  }

  const previousValue = asset.toObject();

  Object.assign(asset, data);
  await asset.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_ASSET',
    entityType: 'Asset',
    entityId: asset._id,
    previousValue,
    newValue: asset,
  });

  logInfo(`Asset updated: ${asset.assetTag}`);
  return asset;
};

/**
 * Allocate asset to an employee
 */
const allocateAsset = async (assetId, data, organizationId, user) => {
  const asset = await Asset.findOne({ _id: assetId, organizationId, status: 'active' });
  if (!asset) {
    throw new AppError(404, 'Asset not found');
  }

  if (asset.assetStatus === 'Allocated') {
    throw new AppError(400, 'Asset is already allocated. Return it before reallocating.');
  }

  if (asset.assetStatus !== 'Available') {
    throw new AppError(400, `Asset cannot be allocated. Current status is ${asset.assetStatus}`);
  }

  const allocation = await AssetAllocation.create({
    ...data,
    assetId,
    organizationId,
    issuedBy: user._id,
    allocationStatus: 'Active',
  });

  const previousValue = { assetStatus: asset.assetStatus, currentAllocationId: asset.currentAllocationId };
  asset.assetStatus = 'Allocated';
  asset.currentAllocationId = allocation._id;
  await asset.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'ALLOCATE_ASSET',
    entityType: 'AssetAllocation',
    entityId: allocation._id,
    newValue: allocation,
  });

  logInfo(`Asset ${asset.assetTag} allocated to employee ${data.employeeId}`);
  return allocation;
};

/**
 * Return an allocated asset
 */
const returnAsset = async (allocationId, data, organizationId, user) => {
  const allocation = await AssetAllocation.findOne({ _id: allocationId, organizationId, allocationStatus: 'Active' });
  if (!allocation) {
    throw new AppError(404, 'Active asset allocation not found');
  }

  const asset = await Asset.findOne({ _id: allocation.assetId, organizationId });
  if (!asset) {
    throw new AppError(404, 'Asset not found');
  }

  allocation.actualReturnDate = data.actualReturnDate;
  allocation.conditionOnReturn = data.conditionOnReturn;
  allocation.returnNotes = data.returnNotes;
  allocation.allocationStatus = 'Returned';
  allocation.receivedBy = user._id;

  await allocation.save();

  asset.assetStatus = 'Available';
  asset.currentAllocationId = null;
  await asset.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'RETURN_ASSET',
    entityType: 'AssetAllocation',
    entityId: allocation._id,
    newValue: allocation,
  });

  logInfo(`Asset ${asset.assetTag} returned`);
  return allocation;
};

/**
 * Get assignment history (AssetAllocations)
 */
const getAssetAllocations = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, assetId, employeeId, allocationStatus, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (assetId) query.assetId = assetId;
  if (employeeId) query.employeeId = employeeId;
  if (allocationStatus) query.allocationStatus = allocationStatus;

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    AssetAllocation.find(query)
      .populate('assetId', 'name assetTag assetType serialNumber')
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('issuedBy', 'firstName lastName')
      .populate('receivedBy', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    AssetAllocation.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Delete (Archive) asset
 */
const deleteAsset = async (id, organizationId, user) => {
  const asset = await Asset.findOne({ _id: id, organizationId, status: 'active' });
  if (!asset) {
    throw new AppError(404, 'Asset not found');
  }

  asset.status = 'archived';
  await asset.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'DELETE_ASSET',
    entityType: 'Asset',
    entityId: asset._id,
  });

  logInfo(`Asset archived: ${asset.assetTag}`);
  return null;
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  allocateAsset,
  returnAsset,
  getAssetAllocations,
  deleteAsset,
};
