/**
 * User.js — Phase 3
 * Mongoose Schema for Users Collection
 * Stores authentication credentials, role assignment, and login security state for all platform users.
 *
 * Authority: DATABASE_DESIGN.md Section 6.1 (Collection: users)
 *            ARCHITECTURE_REVISION.md Section 8 (Authentication Architecture)
 *            DEVELOPMENT_ORDER.md Section 10 (Step 11)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: [60, 'Password hash must be at least 60 characters'],
      select: false, // Do not return passwordHash by default in queries
    },
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: Object.values(ROLES),
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isLocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    failedLoginAttempts: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 10,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
      default: null,
      select: false,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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
userSchema.index({ organizationId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ employeeId: 1 }, { sparse: true });

/**
 * Instance method to compare incoming candidate password with stored bcrypt hash.
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

/**
 * Instance method to check if account is currently locked out.
 * @returns {boolean}
 */
userSchema.methods.isAccountLocked = function () {
  if (!this.isLocked) return false;
  if (this.lockUntil && this.lockUntil < new Date()) {
    return false; // Lock expired
  }
  return true;
};

module.exports = mongoose.model('User', userSchema);
