/**
 * SystemSetting.js
 * Mongoose Schema for SystemSettings Collection
 * Organization-level configuration and feature flags. One document per organization.
 *
 * Authority: DATABASE_DESIGN.md Section 8.11
 */

const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
      unique: true,
    },
    attendanceSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    leaveSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    payrollSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    notificationSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    aiSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    workingDaysPerWeek: {
      type: Number,
      default: 5,
      min: [1, 'Working days must be at least 1'],
      max: [7, 'Working days cannot exceed 7'],
    },
    fiscalYearStart: {
      type: Number,
      default: 4,
      min: [1, 'Fiscal year start month must be between 1 and 12'],
      max: [12, 'Fiscal year start month must be between 1 and 12'],
    },
    timezone: {
      type: String,
      trim: true,
      default: 'Asia/Kolkata',
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'INR',
    },
    dateFormat: {
      type: String,
      trim: true,
      default: 'YYYY-MM-DD',
    },
    language: {
      type: String,
      trim: true,
      default: 'en-US',
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    defaultShift: {
      type: String,
      trim: true,
      default: 'General Day Shift',
    },
    payrollCycle: {
      type: String,
      trim: true,
      default: 'Monthly',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
