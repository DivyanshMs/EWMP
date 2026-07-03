/**
 * Asset.js
 * Mongoose Schema for Assets Collection
 * Company asset inventory. Each document represents one physical or digital asset.
 *
 * Authority: DATABASE_DESIGN.md Section 8.3
 */

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    assetTag: {
      type: String,
      required: [true, 'Asset tag is required'],
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    assetType: {
      type: String,
      required: true,
      enum: [
        'Laptop',
        'Desktop',
        'Monitor',
        'Mobile Phone',
        'Keyboard',
        'Mouse',
        'Furniture',
        'Vehicle',
        'Software License',
        'Other',
      ],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    model: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v <= new Date();
        },
        message: 'Purchase date must be in the past',
      },
    },
    purchaseCost: {
      type: Number,
      default: null,
      min: [0, 'Purchase cost cannot be negative'],
    },
    warrantyExpiry: {
      type: Date,
      default: null,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    currentAllocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssetAllocation',
      default: null,
    },
    assetStatus: {
      type: String,
      required: true,
      enum: ['Available', 'Allocated', 'Under Maintenance', 'Retired', 'Lost'],
      default: 'Available',
    },
    condition: {
      type: String,
      required: true,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
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
assetSchema.index({ organizationId: 1, assetTag: 1 }, { unique: true });
assetSchema.index({ serialNumber: 1 }, { unique: true, sparse: true });
assetSchema.index({ organizationId: 1, assetStatus: 1 });
assetSchema.index({ organizationId: 1, assetType: 1 });

module.exports = mongoose.model('Asset', assetSchema);
