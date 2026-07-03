/**
 * ActivityLog.js
 * Mongoose Schema for ActivityLogs Collection
 * General user activity tracking for analytics and session monitoring.
 *
 * Authority: DATABASE_DESIGN.md Section 8.10
 */

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    activityType: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: [
        'Page View',
        'API Call',
        'File Upload',
        'File Download',
        'Export',
        'Search',
        'Login',
        'Logout',
      ],
    },
    module: {
      type: String,
      trim: true,
      maxlength: [50, 'Module cannot exceed 50 characters'],
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 45,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable activity event
  }
);

// Indexes
activityLogSchema.index({ userId: 1, createdAt: 1 });
activityLogSchema.index({ organizationId: 1, activityType: 1 });
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90-day TTL retention

module.exports = mongoose.model('ActivityLog', activityLogSchema);
