/**
 * Candidate.js
 * Mongoose Schema for Candidates Collection
 * Stores job applicant records through the full recruitment lifecycle from application to employee conversion.
 *
 * Authority: DATABASE_DESIGN.md Section 7.2
 */

const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [1, 'First name must be at least 1 character'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [1, 'Last name must be at least 1 character'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      trim: true,
      maxlength: 15,
    },
    appliedForDesignation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      default: null,
    },
    appliedForDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
      max: [60, 'Experience cannot exceed 60 years'],
    },
    skills: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    resumePublicId: {
      type: String,
      default: null,
    },
    aiAnalysisScore: {
      type: Number,
      default: null,
      min: [0, 'AI score cannot be negative'],
      max: [100, 'AI score cannot exceed 100'],
    },
    aiAnalysisSummary: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
    aiSkillsIdentified: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    aiSkillsGap: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    recruitmentStatus: {
      type: String,
      required: true,
      enum: [
        'Applied',
        'Screening',
        'Technical Interview',
        'HR Interview',
        'Offer',
        'Accepted',
        'Rejected',
        'Withdrawn',
        'Joined',
      ],
      default: 'Applied',
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    offerLetterUrl: {
      type: String,
      default: null,
    },
    convertedEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    sourceChannel: {
      type: String,
      enum: ['LinkedIn', 'Referral', 'Job Board', 'Direct', 'Campus', 'Other'],
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    hrOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
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
candidateSchema.index({ organizationId: 1, email: 1 }, { unique: true });
candidateSchema.index({ organizationId: 1, recruitmentStatus: 1 });
candidateSchema.index({ organizationId: 1 });
candidateSchema.index({ convertedEmployeeId: 1 }, { sparse: true });

module.exports = mongoose.model('Candidate', candidateSchema);
