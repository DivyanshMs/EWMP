/**
 * Holiday.js
 * Mongoose Schema for Holidays Collection
 * Organization holiday calendar. Referenced during attendance computation and leave validation.
 *
 * Authority: DATABASE_DESIGN.md Section 7.10
 */

const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Holiday name is required'],
      trim: true,
      minlength: [2, 'Holiday name must be at least 2 characters'],
      maxlength: [100, 'Holiday name cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Holiday date is required'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    holidayType: {
      type: String,
      required: true,
      enum: ['Public', 'Restricted', 'Optional'],
      default: 'Public',
    },
    applicableLocations: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
      default: [],
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
holidaySchema.index({ organizationId: 1, date: 1 }, { unique: true });
holidaySchema.index({ organizationId: 1, year: 1 });

module.exports = mongoose.model('Holiday', holidaySchema);
