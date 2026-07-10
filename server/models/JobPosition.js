/**
 * JobPosition.js
 * Mongoose Schema for JobPositions Collection
 * Stores open job positions / hiring requests.
 *
 * Authority: Recruitment Module Implementation
 */

const mongoose = require('mongoose');

const jobPositionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department ID is required'],
    },
    hiringManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Hiring Manager ID is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    experienceRequired: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    jobStatus: {
      type: String,
      required: true,
      enum: ['Open', 'On Hold', 'Closed', 'Draft'],
      default: 'Open',
    },
    totalVacancies: {
      type: Number,
      default: 1,
      min: [1, 'Must have at least 1 vacancy'],
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
jobPositionSchema.index({ organizationId: 1, jobStatus: 1 });
jobPositionSchema.index({ departmentId: 1 });
jobPositionSchema.index({ hiringManagerId: 1 });

module.exports = mongoose.model('JobPosition', jobPositionSchema);
