/**
 * SalaryStructure.js
 * Mongoose Schema for SalaryStructures Collection
 * Defines salary grade configurations with component percentage formulas. Assigned to employees to drive payroll computation.
 *
 * Authority: DATABASE_DESIGN.md Section 7.11
 */

const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Salary structure name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Salary structure code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Code cannot exceed 10 characters'],
    },
    hraPercent: {
      type: Number,
      required: [true, 'HRA percent is required'],
      min: [0, 'HRA percent cannot be negative'],
      max: [100, 'HRA percent cannot exceed 100'],
    },
    daPercent: {
      type: Number,
      default: 0,
      min: [0, 'DA percent cannot be negative'],
      max: [100, 'DA percent cannot exceed 100'],
    },
    pfPercent: {
      type: Number,
      default: 12,
      min: [0, 'PF percent cannot be negative'],
      max: [100, 'PF percent cannot exceed 100'],
    },
    professionalTax: {
      type: Number,
      default: 200,
      min: [0, 'Professional tax cannot be negative'],
    },
    medicalAllowance: {
      type: Number,
      default: 0,
      min: [0, 'Medical allowance cannot be negative'],
    },
    travelAllowance: {
      type: Number,
      default: 0,
      min: [0, 'Travel allowance cannot be negative'],
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
salaryStructureSchema.index({ organizationId: 1, code: 1 }, { unique: true });
salaryStructureSchema.index({ organizationId: 1 });

module.exports = mongoose.model('SalaryStructure', salaryStructureSchema);
