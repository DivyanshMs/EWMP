/**
 * Shift.js
 * Mongoose Schema for Shifts Collection
 * Defines work shift schedules including start/end times and overtime thresholds. Referenced by employees and attendance.
 *
 * Authority: DATABASE_DESIGN.md Section 6.6
 */

const mongoose = require('mongoose');

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const shiftSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Shift name is required'],
      trim: true,
      minlength: [2, 'Shift name must be at least 2 characters'],
      maxlength: [100, 'Shift name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Shift code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Shift code cannot exceed 10 characters'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Please provide a valid time in HH:mm 24-hour format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Please provide a valid time in HH:mm 24-hour format'],
    },
    workingHours: {
      type: Number,
      required: [true, 'Working hours is required'],
      min: [1, 'Working hours must be at least 1'],
      max: [24, 'Working hours cannot exceed 24'],
    },
    overtimeThreshold: {
      type: Number,
      required: true,
      default: 8,
      min: [1, 'Overtime threshold must be at least 1'],
      max: [24, 'Overtime threshold cannot exceed 24'],
    },
    weeklyOffDays: {
      type: [{ type: String, enum: DAYS_OF_WEEK }],
      required: true,
      default: ['Saturday', 'Sunday'],
    },
    gracePeriodMinutes: {
      type: Number,
      default: 15,
      min: [0, 'Grace period cannot be negative'],
      max: [60, 'Grace period cannot exceed 60 minutes'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by User ID is required'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
shiftSchema.index({ organizationId: 1, code: 1 }, { unique: true });
shiftSchema.index({ organizationId: 1 });

module.exports = mongoose.model('Shift', shiftSchema);
