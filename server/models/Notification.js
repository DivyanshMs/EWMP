/**
 * Notification.js
 * Mongoose Schema for Notifications Collection
 * In-app notification records for all platform events. One document per notification per recipient.
 *
 * Authority: DATABASE_DESIGN.md Section 8.6
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Recipient ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    notificationType: {
      type: String,
      required: true,
      enum: [
        'Leave',
        'Attendance',
        'Payroll',
        'Task',
        'Recruitment',
        'Asset',
        'Ticket',
        'System',
        'Announcement',
      ],
    },
    relatedEntityType: {
      type: String,
      trim: true,
      default: null,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    actionUrl: {
      type: String,
      trim: true,
      default: null,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Normal', 'Low'],
      default: 'Normal',
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable creation timestamp
  }
);

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ organizationId: 1, notificationType: 1 });
notificationSchema.index({ recipientId: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
