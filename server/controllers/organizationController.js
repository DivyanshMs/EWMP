/**
 * organizationController.js — Phase 4A: Organization Management Module
 * Implements: API_SPECIFICATION.md Section 6.1
 * Handles HTTP requests for Organization profile and System Settings.
 */

const organizationService = require('../services/organizationService');
const { sendSuccess } = require('../utils/formatResponse');

const getCurrentOrganization = async (req, res, next) => {
  try {
    const orgData = await organizationService.getCurrentOrganization(req.user.organizationId);
    return sendSuccess(res, 200, 'Organization retrieved successfully', orgData);
  } catch (error) {
    next(error);
  }
};

const updateCurrentOrganization = async (req, res, next) => {
  try {
    const orgData = await organizationService.updateCurrentOrganization(
      req.user.organizationId,
      req.validatedBody || req.body,
      req.user
    );
    return sendSuccess(res, 200, 'Organization updated successfully', orgData);
  } catch (error) {
    next(error);
  }
};

const getSettings = async (req, res, next) => {
  try {
    const settingsData = await organizationService.getSettings(req.user.organizationId);
    return sendSuccess(res, 200, 'Organization settings retrieved successfully', settingsData);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settingsData = await organizationService.updateSettings(
      req.user.organizationId,
      req.validatedBody || req.body,
      req.user
    );
    return sendSuccess(res, 200, 'Organization settings updated successfully', settingsData);
  } catch (error) {
    next(error);
  }
};

const getOrganizationById = async (req, res, next) => {
  try {
    const orgData = await organizationService.getOrganizationById(req.validatedParams?.id || req.params.id);
    return sendSuccess(res, 200, 'Organization retrieved successfully', orgData);
  } catch (error) {
    next(error);
  }
};

const updateOrganizationById = async (req, res, next) => {
  try {
    const orgData = await organizationService.updateOrganizationById(
      req.validatedParams?.id || req.params.id,
      req.validatedBody || req.body,
      req.user
    );
    return sendSuccess(res, 200, 'Organization updated successfully', orgData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentOrganization,
  updateCurrentOrganization,
  getSettings,
  updateSettings,
  getOrganizationById,
  updateOrganizationById,
};
