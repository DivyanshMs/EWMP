const Document = require('../models/Document');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { buildSearchQuery } = require('../utils/queryHelper');
const { logInfo, logError } = require('../utils/loggerHelper');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/fileUploadUtil');

const createAuditLog = async (data) => {
  try {
    await AuditLog.create(data);
  } catch (err) {
    logError('Audit log creation failed', { error: err.message, data });
  }
};

/**
 * Get paginated list of documents
 */
const getDocuments = async (queryParams, organizationId, employeeId = null, userId = null) => {
  const { page = 1, limit = 10, search, category, employee, project, asset, uploader, uploadedDate, sort = '-createdAt' } = queryParams;

  const query = { organizationId, documentStatus: { $ne: 'Deleted' } };

  if (category) query.category = category;
  if (employee) query.employeeId = employee;
  if (project) query.projectId = project;
  if (asset) query.assetId = asset;
  if (uploader) query.uploadedBy = uploader;
  
  if (uploadedDate) {
    // Assuming uploadedDate is a string YYYY-MM-DD
    const startDate = new Date(uploadedDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    query.createdAt = { $gte: startDate, $lt: endDate };
  }

  // Data Scoping: If queried by an EMPLOYEE, they see only their own documents
  if (employeeId) {
    query.$or = [
      { employeeId },
      { uploadedBy: userId }
    ];
  }

  // Search by filename or originalName
  if (search) {
    Object.assign(query, buildSearchQuery(search, ['filename', 'originalName']));
  }

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Document.find(query)
      .populate('employeeId', 'firstName lastName employeeCode')
      .populate('projectId', 'name code')
      .populate('assetId', 'name assetTag')
      .populate('uploadedBy', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Document.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get document by ID (Download Metadata & history)
 */
const getDocumentById = async (id, organizationId, employeeId = null, userId = null, recordDownload = false) => {
  const query = { _id: id, organizationId, documentStatus: { $ne: 'Deleted' } };

  if (employeeId) {
    query.$or = [
      { employeeId },
      { uploadedBy: userId }
    ];
  }

  const document = await Document.findOne(query)
    .populate('uploadedBy', 'firstName lastName')
    .populate('downloadHistory.downloadedBy', 'firstName lastName');

  if (!document) {
    throw new AppError(404, 'Document not found or unauthorized');
  }

  if (recordDownload && userId) {
    document.downloadHistory.push({ downloadedBy: userId, downloadedAt: new Date() });
    await document.save();
  }

  return document;
};

/**
 * Upload a new document
 */
const uploadDocument = async (file, bodyData, organizationId, user) => {
  if (!file) {
    throw new AppError(400, 'Missing file');
  }

  const folderPath = `ewmp/${organizationId}/documents/${bodyData.category || 'Other'}`;
  const uploadResult = await uploadToCloudinary(file.buffer, folderPath, `doc_${Date.now()}`);

  const tagsArray = bodyData.tags ? (typeof bodyData.tags === 'string' ? bodyData.tags.split(',').map(t => t.trim()) : bodyData.tags) : [];

  const document = await Document.create({
    organizationId,
    category: bodyData.category || 'Other',
    tags: tagsArray,
    employeeId: bodyData.employeeId || null,
    projectId: bodyData.projectId || null,
    assetId: bodyData.assetId || null,
    filename: file.originalname, // Using original name as filename for user display
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    cloudinaryPublicId: uploadResult.publicId,
    cloudinaryUrl: uploadResult.url,
    uploadedBy: user._id,
    versionNumber: 1,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPLOAD_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
    newValue: { filename: document.filename, category: document.category },
  });

  logInfo(`Document uploaded: ${document._id}`);
  return document;
};

/**
 * Replace an existing file in the document (new version)
 */
const replaceDocument = async (id, file, organizationId, user) => {
  if (!file) {
    throw new AppError(400, 'Missing file');
  }

  const document = await Document.findOne({ _id: id, organizationId, documentStatus: 'Active' });
  if (!document) {
    throw new AppError(404, 'Active document not found');
  }

  // Delete old file from Cloudinary (optional, but good for space management. We'll replace it entirely).
  await deleteFromCloudinary(document.cloudinaryPublicId);

  const folderPath = `ewmp/${organizationId}/documents/${document.category}`;
  const uploadResult = await uploadToCloudinary(file.buffer, folderPath, `doc_${Date.now()}`);

  const previousValue = { versionNumber: document.versionNumber, cloudinaryUrl: document.cloudinaryUrl };

  document.filename = file.originalname;
  document.originalName = file.originalname;
  document.mimeType = file.mimetype;
  document.size = file.size;
  document.cloudinaryPublicId = uploadResult.publicId;
  document.cloudinaryUrl = uploadResult.url;
  document.versionNumber += 1;
  
  await document.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'REPLACE_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
    previousValue,
    newValue: { versionNumber: document.versionNumber, cloudinaryUrl: document.cloudinaryUrl },
  });

  logInfo(`Document replaced: ${document._id} (Version ${document.versionNumber})`);
  return document;
};

/**
 * Update document metadata
 */
const updateDocument = async (id, data, organizationId, user) => {
  const document = await Document.findOne({ _id: id, organizationId, documentStatus: 'Active' });
  if (!document) {
    throw new AppError(404, 'Active document not found');
  }

  const previousValue = document.toObject();

  if (data.category) document.category = data.category;
  if (data.tags) document.tags = data.tags;
  if (data.employeeId !== undefined) document.employeeId = data.employeeId;
  if (data.projectId !== undefined) document.projectId = data.projectId;
  if (data.assetId !== undefined) document.assetId = data.assetId;

  await document.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'UPDATE_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
    previousValue,
    newValue: document,
  });

  logInfo(`Document metadata updated: ${document._id}`);
  return document;
};

/**
 * Soft delete document
 */
const softDeleteDocument = async (id, organizationId, user) => {
  const document = await Document.findOne({ _id: id, organizationId, documentStatus: { $ne: 'Deleted' } });
  if (!document) {
    throw new AppError(404, 'Document not found or already deleted');
  }

  document.documentStatus = 'Deleted';
  await document.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SOFT_DELETE_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
  });

  logInfo(`Document soft deleted: ${document._id}`);
  return null;
};

/**
 * Restore soft-deleted document
 */
const restoreDocument = async (id, organizationId, user) => {
  const document = await Document.findOne({ _id: id, organizationId, documentStatus: 'Deleted' });
  if (!document) {
    throw new AppError(404, 'Deleted document not found');
  }

  document.documentStatus = 'Active';
  await document.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'RESTORE_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
  });

  logInfo(`Document restored: ${document._id}`);
  return document;
};

/**
 * Permanent Delete (Admin Only)
 */
const permanentDeleteDocument = async (id, organizationId, user) => {
  const document = await Document.findOne({ _id: id, organizationId });
  if (!document) {
    throw new AppError(404, 'Document not found');
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(document.cloudinaryPublicId);

  await Document.deleteOne({ _id: id });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'PERMANENT_DELETE_DOCUMENT',
    entityType: 'Document',
    entityId: document._id,
  });

  logInfo(`Document permanently deleted: ${document._id}`);
  return null;
};

module.exports = {
  getDocuments,
  getDocumentById,
  uploadDocument,
  replaceDocument,
  updateDocument,
  softDeleteDocument,
  restoreDocument,
  permanentDeleteDocument,
};
