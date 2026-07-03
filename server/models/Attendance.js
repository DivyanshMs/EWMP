/**
 * Attendance.js
 * Mongoose Schema for Attendance Collection
 * Daily attendance summary record per employee. One document per employee per date.
 *
 * Authority: DATABASE_DESIGN.md Section 7.5
 */

const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v <= new Date();
        },
        message: 'Attendance date cannot be in the future',
      },
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
      default: null,
    },
    clockInTime: {
      type: Date,
      default: null,
    },
    clockOutTime: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v || !this.clockInTime) return true;
          return v > this.clockInTime;
        },
        message: 'Clock-out time must be after clock-in time',
      },
    },
    workingHours: {
      type: Number,
      default: 0,
      min: [0, 'Working hours cannot be negative'],
      max: [24, 'Working hours cannot exceed 24'],
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: [0, 'Overtime hours cannot be negative'],
      max: [24, 'Overtime hours cannot exceed 24'],
    },
    attendanceStatus: {
      type: String,
      required: true,
      enum: [
        'Present',
        'Absent',
        'Late',
        'Half-Day',
        'Leave',
        'Holiday',
        'Work-From-Home',
        'On-Duty',
      ],
      default: 'Absent',
    },
    isLate: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEarlyExit: {
      type: Boolean,
      required: true,
      default: false,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    clockInGps: {
      type: gpsSchema,
      default: null,
    },
    clockOutGps: {
      type: gpsSchema,
      default: null,
    },
    correctionStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: null,
    },
    correctionRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceLogs',
      default: null,
    },
    correctionApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    correctionApprovedAt: {
      type: Date,
      default: null,
    },
    leaveRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LeaveRequest',
      default: null,
    },
    holidayId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Holiday',
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
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ organizationId: 1, date: 1 });
attendanceSchema.index({ organizationId: 1, attendanceStatus: 1 });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
