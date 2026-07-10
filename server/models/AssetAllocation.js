/**
 * AssetAllocation.js
 * Mongoose Schema for AssetAllocations Collection
 * Records asset assignment events and return history. Full audit trail of asset custody.
 *
 * Authority: DATABASE_DESIGN.md Section 8.4
 */

const mongoose = require('mongoose');

const assetAllocationSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset ID is required'],
    },
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
    allocationDate: {
      type: Date,
      required: [true, 'Allocation date is required'],
    },
    expectedReturnDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v || !this.allocationDate) return true;
          return v > this.allocationDate;
        },
        message: 'Expected return date must be after allocation date',
      },
    },
    actualReturnDate: {
      type: Date,
      default: null,
    },
    conditionOnIssue: {
      type: String,
      required: true,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    },
    conditionOnReturn: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: null,
    },
    allocationNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    returnNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    allocationStatus: {
      type: String,
      required: true,
      enum: ['Active', 'Returned', 'Lost'],
      default: 'Active',
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Issued by User ID is required'],
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assetAllocationSchema.index({ assetId: 1, allocationStatus: 1 });
assetAllocationSchema.index({ employeeId: 1, allocationStatus: 1 });
assetAllocationSchema.index({ organizationId: 1 });
assetAllocationSchema.index({ allocationDate: 1 });

module.exports = mongoose.model('AssetAllocation', assetAllocationSchema);
