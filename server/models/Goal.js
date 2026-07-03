/**
 * Goal.js
 * Mongoose Schema for Goals Collection
 * Employee performance goals set by managers and self. Linked to quarterly performance reviews.
 *
 * Authority: DATABASE_DESIGN.md Section 7.14
 */

const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
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
    setByManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Manager ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Target date is required'],
      validate: {
        validator: function (v) {
          if (!v || !this.isNew) return true;
          return v > new Date();
        },
        message: 'Target date must be in the future at creation',
      },
    },
    quarter: {
      type: String,
      required: [true, 'Quarter is required'],
      enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Invalid year'],
      max: [2100, 'Invalid year'],
    },
    goalType: {
      type: String,
      required: true,
      enum: ['KPI', 'Learning', 'Project', 'Behavior'],
      default: 'KPI',
    },
    targetValue: {
      type: Number,
      default: null,
    },
    achievedValue: {
      type: Number,
      default: null,
    },
    completionPercent: {
      type: Number,
      default: 0,
      min: [0, 'Completion percent cannot be negative'],
      max: [100, 'Completion percent cannot exceed 100'],
    },
    goalStatus: {
      type: String,
      required: true,
      enum: ['Not Started', 'In Progress', 'Completed', 'Missed'],
      default: 'Not Started',
    },
    managerRating: {
      type: Number,
      default: null,
      min: [1, 'Manager rating must be at least 1'],
      max: [5, 'Manager rating cannot exceed 5'],
    },
    managerNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Manager notes cannot exceed 1000 characters'],
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
goalSchema.index({ employeeId: 1, year: 1, quarter: 1 });
goalSchema.index({ organizationId: 1, year: 1, quarter: 1 });
goalSchema.index({ employeeId: 1 });
goalSchema.index({ setByManagerId: 1 });

module.exports = mongoose.model('Goal', goalSchema);
