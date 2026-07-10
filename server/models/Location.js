/**
 * Location.js
 * Mongoose Schema for Locations Collection
 * Defines office locations and work-site addresses. Referenced by employees and attendance records.
 *
 * Authority: DATABASE_DESIGN.md Section 6.5
 */

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true, maxlength: 200 },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    pincode: { type: String, trim: true, maxlength: 10 },
  },
  { _id: false }
);

const gpsSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      minlength: [2, 'Location name must be at least 2 characters'],
      maxlength: [100, 'Location name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Location code is required'],
      trim: true,
      uppercase: true,
      maxlength: [10, 'Location code cannot exceed 10 characters'],
    },
    address: {
      type: addressSchema,
      required: [true, 'Address is required'],
    },
    isRemote: {
      type: Boolean,
      required: true,
      default: false,
    },
    gpsCoordinates: {
      type: gpsSchema,
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
locationSchema.index({ organizationId: 1, code: 1 }, { unique: true });
locationSchema.index({ organizationId: 1 });

module.exports = mongoose.model('Location', locationSchema);
