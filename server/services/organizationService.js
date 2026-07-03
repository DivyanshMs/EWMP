/**
 * organizationService.js — Phase 4A: Organization Management Module
 * Implements business logic for Organization profile and SystemSettings management.
 *
 * Authority: API_SPECIFICATION.md Section 6.1
 *            DATABASE_DESIGN.md Section 6.2 & 8.11
 *            DEVELOPMENT_ORDER.md Step 21
 */

const Organization = require('../models/Organization');
const SystemSetting = require('../models/SystemSetting');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { ERROR_CODES } = require('../config/constants');
const { logInfo, logError } = require('../utils/loggerHelper');

/**
 * Retrieve current organization profile with timezone and currency from settings if needed.
 * @param {string} organizationId - MongoDB ObjectId of the organization
 */
const getCurrentOrganization = async (organizationId) => {
  if (!organizationId) {
    throw new AppError(400, 'Organization ID is required', ERROR_CODES.VALIDATION_ERROR);
  }

  const org = await Organization.findById(organizationId);
  if (!org) {
    throw new AppError(404, 'Organization not found', ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  // Ensure system settings exist to sync timezone and currency if needed
  let settings = await SystemSetting.findOne({ organizationId });
  if (!settings) {
    settings = await SystemSetting.create({
      organizationId,
      timezone: org.timezone || 'Asia/Kolkata',
      currency: org.currency || 'INR',
    });
  }

  const orgObject = org.toObject();
  const logoValue = orgObject.logoUrl || orgObject.logo || null;
  const timezoneValue = orgObject.timezone || settings.timezone || 'Asia/Kolkata';
  const currencyValue = orgObject.currency || settings.currency || 'INR';

  return {
    ...orgObject,
    logo: logoValue,
    logoUrl: logoValue,
    timezone: timezoneValue,
    currency: currencyValue,
  };
};

/**
 * Update current organization information.
 * @param {string} organizationId - MongoDB ObjectId of the organization
 * @param {object} updateData - Validated payload
 * @param {object} actorUser - Authenticated user performing the action
 */
const updateCurrentOrganization = async (organizationId, updateData, actorUser) => {
  if (!organizationId) {
    throw new AppError(400, 'Organization ID is required', ERROR_CODES.VALIDATION_ERROR);
  }

  const org = await Organization.findById(organizationId);
  if (!org) {
    throw new AppError(404, 'Organization not found', ERROR_CODES.RESOURCE_NOT_FOUND);
  }

  const oldValues = org.toObject();

  // Handle address updates
  if (
    updateData.address !== undefined ||
    updateData.city ||
    updateData.state ||
    updateData.country ||
    updateData.postalCode ||
    updateData.pincode
  ) {
    let addressObj = oldValues.address || {};
    if (typeof updateData.address === 'string') {
      addressObj.street = updateData.address;
    } else if (typeof updateData.address === 'object' && updateData.address !== null) {
      addressObj = { ...addressObj, ...updateData.address };
      if (updateData.address.postalCode && !updateData.address.pincode) {
        addressObj.pincode = updateData.address.postalCode;
      }
      if (updateData.address.pincode && !updateData.address.postalCode) {
        addressObj.postalCode = updateData.address.pincode;
      }
    }
    if (updateData.city) addressObj.city = updateData.city;
    if (updateData.state) addressObj.state = updateData.state;
    if (updateData.country) addressObj.country = updateData.country;
    if (updateData.postalCode) {
      addressObj.postalCode = updateData.postalCode;
      addressObj.pincode = updateData.postalCode;
    }
    if (updateData.pincode) {
      addressObj.pincode = updateData.pincode;
      addressObj.postalCode = updateData.pincode;
    }
    org.address = addressObj;
  }

  // Handle direct fields
  const directFields = ['name', 'phone', 'email', 'website', 'industry', 'timezone', 'currency'];
  directFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      org[field] = updateData[field];
    }
  });

  // Handle logo / logoUrl
  if (updateData.logoUrl !== undefined || updateData.logo !== undefined) {
    const newLogo = updateData.logoUrl !== undefined ? updateData.logoUrl : updateData.logo;
    org.logoUrl = newLogo;
    org.logo = newLogo;
  }

  await org.save();

  // Sync timezone & currency to SystemSetting if updated
  if (updateData.timezone || updateData.currency) {
    await SystemSetting.findOneAndUpdate(
      { organizationId },
      {
        $set: {
          ...(updateData.timezone && { timezone: updateData.timezone }),
          ...(updateData.currency && { currency: updateData.currency }),
          updatedBy: actorUser?._id || null,
        },
      },
      { upsert: true }
    );
  }

  // Required logging
  logInfo('organization updated', {
    organizationId,
    actorUserId: actorUser?._id,
    updatedFields: Object.keys(updateData),
  });

  try {
    await AuditLog.create({
      organizationId,
      actorUserId: actorUser?._id || org.adminId || org._id,
      actorRole: actorUser?.role || 'SUPER_ADMIN',
      action: 'ORGANIZATION_UPDATED',
      entityType: 'Organization',
      entityId: org._id,
      previousValues: oldValues,
      newValues: org.toObject(),
    });
  } catch (auditErr) {
    logError(`AuditLog creation failed for ORGANIZATION_UPDATED: ${auditErr.message}`);
  }

  return getCurrentOrganization(organizationId);
};

/**
 * Retrieve organization system settings.
 * @param {string} organizationId - MongoDB ObjectId of the organization
 */
const getSettings = async (organizationId) => {
  if (!organizationId) {
    throw new AppError(400, 'Organization ID is required', ERROR_CODES.VALIDATION_ERROR);
  }

  let settings = await SystemSetting.findOne({ organizationId });
  if (!settings) {
    const org = await Organization.findById(organizationId);
    settings = await SystemSetting.create({
      organizationId,
      timezone: org?.timezone || 'Asia/Kolkata',
      currency: org?.currency || 'INR',
      workingDaysPerWeek: 5,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      dateFormat: 'YYYY-MM-DD',
      language: 'en-US',
      defaultShift: 'General Day Shift',
      payrollCycle: 'Monthly',
    });
  }

  return settings.toObject();
};

/**
 * Update organization system settings.
 * @param {string} organizationId - MongoDB ObjectId of the organization
 * @param {object} updateData - Validated payload
 * @param {object} actorUser - Authenticated user performing the action
 */
const updateSettings = async (organizationId, updateData, actorUser) => {
  if (!organizationId) {
    throw new AppError(400, 'Organization ID is required', ERROR_CODES.VALIDATION_ERROR);
  }

  let settings = await SystemSetting.findOne({ organizationId });
  const oldValues = settings ? settings.toObject() : {};

  const allowedFields = [
    'timezone',
    'currency',
    'dateFormat',
    'language',
    'workingDays',
    'workingDaysPerWeek',
    'defaultShift',
    'payrollCycle',
    'attendanceSettings',
    'leaveSettings',
    'payrollSettings',
    'notificationSettings',
    'aiSettings',
    'fiscalYearStart',
  ];

  const updatePayload = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updatePayload[field] = updateData[field];
    }
  });

  if (actorUser && actorUser._id) {
    updatePayload.updatedBy = actorUser._id;
  }

  settings = await SystemSetting.findOneAndUpdate(
    { organizationId },
    { $set: updatePayload },
    { new: true, upsert: true, runValidators: true }
  );

  // Sync timezone & currency back to Organization if updated
  if (updateData.timezone || updateData.currency) {
    await Organization.findByIdAndUpdate(organizationId, {
      $set: {
        ...(updateData.timezone && { timezone: updateData.timezone }),
        ...(updateData.currency && { currency: updateData.currency }),
      },
    });
  }

  // Required logging
  logInfo('settings updated', {
    organizationId,
    actorUserId: actorUser?._id,
    updatedFields: Object.keys(updateData),
  });

  try {
    await AuditLog.create({
      organizationId,
      actorUserId: actorUser?._id || settings._id,
      actorRole: actorUser?.role || 'SUPER_ADMIN',
      action: 'SETTINGS_UPDATED',
      entityType: 'SystemSetting',
      entityId: settings._id,
      previousValues: oldValues,
      newValues: settings.toObject(),
    });
  } catch (auditErr) {
    logError(`AuditLog creation failed for SETTINGS_UPDATED: ${auditErr.message}`);
  }

  return settings.toObject();
};

const getOrganizationById = async (id) => {
  return getCurrentOrganization(id);
};

const updateOrganizationById = async (id, updateData, actorUser) => {
  return updateCurrentOrganization(id, updateData, actorUser);
};

module.exports = {
  getCurrentOrganization,
  updateCurrentOrganization,
  getSettings,
  updateSettings,
  getOrganizationById,
  updateOrganizationById,
};
