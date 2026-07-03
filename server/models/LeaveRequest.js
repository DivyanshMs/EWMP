/**
 * LeaveRequest.js
 * Mongoose Schema for LeaveRequests Collection
 * Records leave applications submitted by employees and tracks their approval workflow.
 *
 * Authority: DATABASE_DESIGN.md Section 7.9
 */

const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
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
    leaveBalanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveBalance',
      required: [true, 'Leave balance ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (v) {
          if (!v || !this.startDate) return true;
          return v >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date',
      },
    },
    totalDays: {
      type: Number,
      required: [true, 'Total days is required'],
      min: [0.5, 'Total days must be at least 0.5 (half day)'],
      max: [365, 'Total days cannot exceed 365'],
    },
    isHalfDay: {
      type: Boolean,
      required: true,
      default: false,
    },
    halfDaySession: {
      type: String,
      enum: ['Morning', 'Afternoon'],
      default: null,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      minlength: [10, 'Reason must be at least 10 characters'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    approvalStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    approverNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    cancelledAt: {
      type: Date,
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
leaveRequestSchema.index({ employeeId: 1, startDate: 1 });
leaveRequestSchema.index({ organizationId: 1, approvalStatus: 1 });
leaveRequestSchema.index({ employeeId: 1, approvalStatus: 1 });
leaveRequestSchema.index({ approverId: 1 });
leaveRequestSchema.index({ leaveTypeId: 1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
