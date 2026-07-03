/**
 * LeaveBalance.js
 * Mongoose Schema for LeaveBalances Collection
 * Tracks per-employee remaining leave balance per leave type. One document per employee per leave type per year.
 *
 * Authority: DATABASE_DESIGN.md Section 7.8
 */

const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveType',
      required: [true, 'Leave type ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Invalid year'],
      max: [2100, 'Invalid year'],
    },
    entitledDays: {
      type: Number,
      required: [true, 'Entitled days is required'],
      min: [0, 'Entitled days cannot be negative'],
    },
    usedDays: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Used days cannot be negative'],
    },
    pendingDays: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Pending days cannot be negative'],
    },
    remainingDays: {
      type: Number,
      required: [true, 'Remaining days is required'],
      min: [0, 'Remaining days cannot be negative'],
    },
    carryForwardDays: {
      type: Number,
      default: 0,
      min: [0, 'Carry forward days cannot be negative'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
leaveBalanceSchema.index({ employeeId: 1, leaveTypeId: 1, year: 1 }, { unique: true });
leaveBalanceSchema.index({ organizationId: 1, year: 1 });
leaveBalanceSchema.index({ employeeId: 1 });

module.exports = mongoose.model('LeaveBalance', leaveBalanceSchema);
