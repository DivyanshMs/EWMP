/**
 * Announcement.js
 * Mongoose Schema for Announcements Collection
 * Organization-wide or department-specific announcements created by HR or Admin.
 *
 * Authority: DATABASE_DESIGN.md Section 8.12
 */

const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [10, 'Content must be at least 10 characters'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    announcementType: {
      type: String,
      required: true,
      enum: ['General', 'HR Policy', 'Event', 'Holiday', 'Emergency', 'Training'],
      default: 'General',
    },
    audienceScope: {
      type: String,
      required: true,
      enum: ['All', 'Department', 'Location', 'Role'],
      default: 'All',
    },
    audienceDepartmentIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
      default: [],
    },
    audienceRoles: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v || !this.publishedAt) return true;
          return v > this.publishedAt;
        },
        message: 'Expires at must be after published at date',
      },
    },
    isPinned: {
      type: Boolean,
      required: true,
      default: false,
    },
    attachmentUrl: {
      type: String,
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
announcementSchema.index({ organizationId: 1, status: 1 });
announcementSchema.index({ organizationId: 1, publishedAt: 1 });
announcementSchema.index({ organizationId: 1, expiresAt: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
