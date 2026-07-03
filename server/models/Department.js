/**
 * Department.js
 * Mongoose Schema for Departments Collection
 * Defines organizational departments and their hierarchy. Referenced by employees, projects, and reports.
 *
 * Authority: DATABASE_DESIGN.md Section 6.3
 */

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      minlength: [2, 'Department name must be at least 2 characters'],
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Department code cannot exceed 10 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    parentDeptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    headcount: {
      type: Number,
      default: 0,
      min: [0, 'Headcount cannot be negative'],
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
departmentSchema.index({ organizationId: 1, code: 1 }, { unique: true });
departmentSchema.index({ organizationId: 1 });
departmentSchema.index({ managerId: 1 });

module.exports = mongoose.model('Department', departmentSchema);
