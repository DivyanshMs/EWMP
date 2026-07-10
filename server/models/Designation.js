/**
 * Designation.js
 * Mongoose Schema for Designations Collection
 * Defines job titles and grade classifications. Referenced by employees for their official designation.
 *
 * Authority: DATABASE_DESIGN.md Section 6.4
 */

const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Designation title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Designation code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Code cannot exceed 20 characters'],
    },
    grade: {
      type: String,
      trim: true,
      maxlength: [10, 'Grade cannot exceed 10 characters'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
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
designationSchema.index({ organizationId: 1, code: 1 }, { unique: true });
designationSchema.index({ organizationId: 1 });

module.exports = mongoose.model('Designation', designationSchema);
