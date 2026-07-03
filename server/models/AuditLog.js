/**
 * AuditLog.js
 * Mongoose Schema for AuditLogs Collection
 * Immutable security and compliance audit trail. Records all security-sensitive and data-modification events. Never soft-deleted.
 *
 * Authority: DATABASE_DESIGN.md Section 8.9
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    actorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor User ID is required'],
    },
    actorRole: {
      type: String,
      required: [true, 'Actor role is required'],
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      trim: true,
      maxlength: [100, 'Action cannot exceed 100 characters'],
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      trim: true,
      maxlength: [100, 'Entity type cannot exceed 100 characters'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    previousValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      maxlength: 45,
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    outcome: {
      type: String,
      required: true,
      enum: ['Success', 'Failure'],
      default: 'Success',
    },
    failureReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // No updatedAt, no soft delete per spec
  }
);

// Indexes
auditLogSchema.index({ organizationId: 1, action: 1 });
auditLogSchema.index({ organizationId: 1, entityType: 1, entityId: 1 });
auditLogSchema.index({ actorUserId: 1 });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 }); // 2 years TTL retention

module.exports = mongoose.model('AuditLog', auditLogSchema);
