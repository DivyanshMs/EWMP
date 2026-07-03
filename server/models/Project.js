/**
 * Project.js
 * Mongoose Schema for Projects Collection
 * Records project definitions, team assignments, timelines, and progress tracking.
 *
 * Authority: DATABASE_DESIGN.md Section 8.1
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    code: {
      type: String,
      required: [true, 'Project code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Code cannot exceed 20 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    projectManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Project manager ID is required'],
    },
    teamMemberIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
      default: [],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v || !this.startDate) return true;
          return v > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    actualEndDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      required: true,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    projectStatus: {
      type: String,
      required: true,
      enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled'],
      default: 'Planning',
    },
    completionPercent: {
      type: Number,
      default: 0,
      min: [0, 'Completion percent cannot be negative'],
      max: [100, 'Completion percent cannot exceed 100'],
    },
    budget: {
      type: Number,
      default: null,
      min: [0, 'Budget cannot be negative'],
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
projectSchema.index({ organizationId: 1, code: 1 }, { unique: true });
projectSchema.index({ organizationId: 1, projectStatus: 1 });
projectSchema.index({ projectManagerId: 1 });
projectSchema.index({ organizationId: 1, departmentId: 1 });

module.exports = mongoose.model('Project', projectSchema);
