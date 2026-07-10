/**
 * Organization.js — Phase 3
 * Mongoose Schema for Organizations Collection
 * Stores organization identity, configuration, and branding. The root entity for all multi-tenancy scoping.
 *
 * Authority: DATABASE_DESIGN.md Section 6.2 (Collection: organizations)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 11)
 */

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, maxlength: 200 },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    pincode: { type: String, trim: true, maxlength: 10 },
    postalCode: { type: String, trim: true, maxlength: 10 },
  },
  { _id: false }
);

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization legal name is required'],
      trim: true,
      minlength: [2, 'Organization name must be at least 2 characters'],
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Organization code is required'],
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: [10, 'Organization code cannot exceed 10 characters'],
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, 'Industry cannot exceed 100 characters'],
    },
    address: {
      type: addressSchema,
      default: {},
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [15, 'Phone number cannot exceed 15 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    website: {
      type: String,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
      default: null,
    },
    logo: {
      type: String,
      trim: true,
      default: null,
    },
    employeeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    timezone: {
      type: String,
      trim: true,
      default: 'Asia/Kolkata',
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: 'INR',
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
organizationSchema.index({ status: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
