/**
 * AttendanceLogs.js
 * Mongoose Schema for AttendanceLogs Collection
 * Immutable event log of every clock-in and clock-out action. Supports attendance corrections and audit trail.
 *
 * Authority: DATABASE_DESIGN.md Section 7.6
 */

const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const attendanceLogsSchema = new mongoose.Schema(
  {
    attendanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendance',
      required: [true, 'Attendance ID is required'],
    },
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
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: [
        'Clock-In',
        'Clock-Out',
        'Correction-Request',
        'Correction-Approved',
        'Correction-Rejected',
      ],
    },
    eventTime: {
      type: Date,
      required: [true, 'Event time is required'],
    },
    gpsCoordinates: {
      type: gpsSchema,
      default: null,
    },
    deviceInfo: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    correctionNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable log creation timestamp
  }
);

// Indexes
attendanceLogsSchema.index({ employeeId: 1, eventTime: 1 });
attendanceLogsSchema.index({ attendanceId: 1 });
attendanceLogsSchema.index({ organizationId: 1 });

module.exports = mongoose.model('AttendanceLogs', attendanceLogsSchema);
