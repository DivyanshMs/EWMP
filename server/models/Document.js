/**
 * Document.js
 * Mongoose Schema for Enterprise Document Management Collection
 * Stores metadata, references, and Cloudinary URLs for company-wide documents.
 * 
 * Note: This model is an extension of the system beyond DATABASE_DESIGN.md 
 * to fulfill the Phase 4G enterprise document management requirements.
 */

const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema(
  {
    downloadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    category: {
      type: String,
      required: [true, 'Document category is required'],
      enum: ['HR', 'Employee', 'Payroll', 'Project', 'Asset', 'Legal', 'Finance', 'Policy', 'Other'],
      default: 'Other',
    },
    tags: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    versionNumber: {
      type: Number,
      default: 1,
    },
    documentStatus: {
      type: String,
      required: true,
      enum: ['Active', 'Archived', 'Deleted'],
      default: 'Active',
    },
    // Linking
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      default: null,
    },
    // File Metadata
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: [0, 'Size cannot be negative'],
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloadHistory: {
      type: [downloadHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
documentSchema.index({ organizationId: 1, category: 1 });
documentSchema.index({ organizationId: 1, documentStatus: 1 });
documentSchema.index({ employeeId: 1 });
documentSchema.index({ projectId: 1 });
documentSchema.index({ assetId: 1 });

module.exports = mongoose.model('Document', documentSchema);
