/**
 * PerformanceReview.js
 * Mongoose Schema for PerformanceReviews Collection
 * Formal quarterly performance review records, consolidating goals, KPI scores, and ratings.
 *
 * Authority: DATABASE_DESIGN.md Section 7.15
 */

const mongoose = require('mongoose');

const performanceReviewSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Reviewer ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
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
    goalIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
      default: [],
    },
    kpiScore: {
      type: Number,
      default: null,
      min: [0, 'KPI score cannot be negative'],
      max: [100, 'KPI score cannot exceed 100'],
    },
    attendanceScore: {
      type: Number,
      default: null,
      min: [0, 'Attendance score cannot be negative'],
      max: [100, 'Attendance score cannot exceed 100'],
    },
    managerRating: {
      type: Number,
      default: null,
      min: [1, 'Manager rating must be at least 1'],
      max: [5, 'Manager rating cannot exceed 5'],
    },
    selfRating: {
      type: Number,
      default: null,
      min: [1, 'Self rating must be at least 1'],
      max: [5, 'Self rating cannot exceed 5'],
    },
    finalRating: {
      type: Number,
      default: null,
      min: [1, 'Final rating must be at least 1'],
      max: [5, 'Final rating cannot exceed 5'],
    },
    overallLevel: {
      type: String,
      enum: ['Outstanding', 'Excellent', 'Good', 'Needs Improvement', 'Unsatisfactory'],
      default: null,
    },
    managerFeedback: {
      type: String,
      trim: true,
      maxlength: [2000, 'Manager feedback cannot exceed 2000 characters'],
    },
    selfAssessment: {
      type: String,
      trim: true,
      maxlength: [2000, 'Self assessment cannot exceed 2000 characters'],
    },
    promotionRecommended: {
      type: Boolean,
      default: false,
    },
    promotionNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Promotion notes cannot exceed 500 characters'],
      default: null,
    },
    reviewStatus: {
      type: String,
      required: true,
      enum: ['Draft', 'Self-Assessment Pending', 'Manager Review Pending', 'Completed'],
      default: 'Draft',
    },
    completedAt: {
      type: Date,
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
performanceReviewSchema.index({ employeeId: 1, year: 1, quarter: 1 }, { unique: true });
performanceReviewSchema.index({ organizationId: 1, year: 1, quarter: 1 });
performanceReviewSchema.index({ reviewerId: 1 });
performanceReviewSchema.index({ organizationId: 1, reviewStatus: 1 });

module.exports = mongoose.model('PerformanceReview', performanceReviewSchema);
