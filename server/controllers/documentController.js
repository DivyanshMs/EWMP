const documentService = require('../services/documentService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/documents
 * List Documents
 */
const getDocuments = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await documentService.getDocuments(req.query, req.user.organizationId, employeeId, req.user._id);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Documents retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/documents/:id
 * Get Document by ID (Downloads Metadata/tracks history)
 */
const getDocumentById = async (req, res, next) => {
  try {
    const employeeId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    // recordDownload = true when fetching single document metadata to track views/downloads
    const result = await documentService.getDocumentById(req.params.id, req.user.organizationId, employeeId, req.user._id, true);
    sendSuccess(res, result, 'Document retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/documents
 * Upload Document
 */
const uploadDocument = async (req, res, next) => {
  try {
    // req.file contains the Multer file buffer
    const result = await documentService.uploadDocument(req.file, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Document uploaded successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/documents/:id/replace
 * Replace Existing File (increments version)
 */
const replaceDocument = async (req, res, next) => {
  try {
    const result = await documentService.replaceDocument(req.params.id, req.file, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Document file replaced successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/documents/:id
 * Update Document Metadata
 */
const updateDocument = async (req, res, next) => {
  try {
    const result = await documentService.updateDocument(req.params.id, req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Document metadata updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/documents/:id
 * Soft Delete Document
 */
const softDeleteDocument = async (req, res, next) => {
  try {
    await documentService.softDeleteDocument(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Document soft deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/documents/:id/restore
 * Restore Soft Deleted Document
 */
const restoreDocument = async (req, res, next) => {
  try {
    const result = await documentService.restoreDocument(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Document restored successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/documents/:id/permanent
 * Permanent Delete Document (Admin Only)
 */
const permanentDeleteDocument = async (req, res, next) => {
  try {
    await documentService.permanentDeleteDocument(req.params.id, req.user.organizationId, req.user);
    sendSuccess(res, null, 'Document permanently deleted');
  } catch (error) {
    next(error);
  }
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
