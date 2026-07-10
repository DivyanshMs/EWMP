/**
 * LeaveType.js
 * Mongoose Schema for LeaveTypes Collection
 * Defines available leave categories and their entitlement rules.
 *
 * Authority: DATABASE_DESIGN.md Section 7.7
 */

const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Leave type name is required'],
      trim: true,
      minlength: [2, 'Leave type name must be at least 2 characters'],
      maxlength: [100, 'Leave type name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Leave type code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Leave type code cannot exceed 10 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    maxDaysPerYear: {
      type: Number,
      required: [true, 'Max days per year is required'],
      min: [0, 'Max days cannot be negative'],
      max: [365, 'Max days cannot exceed 365'],
    },
    isCarryForward: {
      type: Boolean,
      required: true,
      default: false,
    },
    maxCarryForwardDays: {
      type: Number,
      default: 0,
      min: [0, 'Max carry forward days cannot be negative'],
    },
    isPaidLeave: {
      type: Boolean,
      required: true,
      default: true,
    },
    requiresApproval: {
      type: Boolean,
      required: true,
      default: true,
    },
    minAdvanceNoticeDays: {
      type: Number,
      default: 1,
      min: [0, 'Min advance notice days cannot be negative'],
    },
    applicableGender: {
      type: String,
      enum: ['Male', 'Female', 'All'],
      default: null,
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
leaveTypeSchema.index({ organizationId: 1, code: 1 }, { unique: true });
leaveTypeSchema.index({ organizationId: 1 });

module.exports = mongoose.model('LeaveType', leaveTypeSchema);
