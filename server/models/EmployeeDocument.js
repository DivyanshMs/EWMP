/**
 * EmployeeDocument.js
 * Mongoose Schema for EmployeeDocuments Collection
 * Stores metadata and Cloudinary URLs for all documents associated with an employee.
 *
 * Authority: DATABASE_DESIGN.md Section 7.4
 */

const mongoose = require('mongoose');

const employeeDocumentSchema = new mongoose.Schema(
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
    documentType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: [
        'Aadhaar',
        'PAN',
        'Resume',
        'Offer Letter',
        'Experience Letter',
        'Educational Certificate',
        'Photograph',
        'Other',
      ],
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
      maxlength: [200, 'Document name cannot exceed 200 characters'],
    },
    documentUrl: {
      type: String,
      required: [true, 'Document URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
    },
    fileSizeBytes: {
      type: Number,
      default: null,
      min: [0, 'File size cannot be negative'],
    },
    mimeType: {
      type: String,
      trim: true,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploaded by User ID is required'],
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
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
employeeDocumentSchema.index({ employeeId: 1, documentType: 1 });
employeeDocumentSchema.index({ employeeId: 1 });
employeeDocumentSchema.index({ organizationId: 1 });

module.exports = mongoose.model('EmployeeDocument', employeeDocumentSchema);
