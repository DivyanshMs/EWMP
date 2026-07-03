/**
 * Employee.js
 * Mongoose Schema for Employees Collection
 * Stores the complete professional profile of every employee. Referenced by virtually all other collections.
 *
 * Authority: DATABASE_DESIGN.md Section 7.1
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

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 15 },
    relation: { type: String, trim: true, maxlength: 50 },
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^EMP[0-9]{4}$/, 'Employee ID must match pattern EMP[0-9]{4} (e.g., EMP1023)'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department ID is required'],
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      required: [true, 'Designation ID is required'],
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    shiftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shift',
      default: null,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
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
      required: [true, 'Work email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, 'Mobile number must be a valid 10-digit number'],
    },
    dateOfBirth: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return v <= new Date();
        },
        message: 'Date of birth must be in the past',
      },
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer Not to Say'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    address: {
      type: addressSchema,
      default: null,
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    employmentType: {
      type: String,
      required: [true, 'Employment type is required'],
      enum: ['Full-Time', 'Part-Time', 'Contract', 'Intern'],
    },
    employmentStatus: {
      type: String,
      required: true,
      enum: ['Probation', 'Permanent', 'Notice Period', 'Resigned', 'Terminated'],
      default: 'Probation',
    },
    salaryStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryStructure',
      default: null,
    },
    basicSalary: {
      type: Number,
      default: 0,
      min: [0, 'Basic salary cannot be negative'],
    },
    profilePhotoUrl: {
      type: String,
      default: null,
    },
    emergencyContact: {
      type: emergencyContactSchema,
      default: null,
    },
    aadharNumber: {
      type: String,
      default: null,
      match: [/^\d{12}$/, 'Aadhar number must be a 12-digit number'],
      select: false, // PII restricted
    },
    panNumber: {
      type: String,
      default: null,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN number must follow valid format'],
      uppercase: true,
      select: false, // PII restricted
    },
    bankAccountNumber: {
      type: String,
      default: null,
      maxlength: 20,
      select: false, // Sensitive
    },
    bankIfscCode: {
      type: String,
      default: null,
      uppercase: true,
      select: false, // Sensitive
    },
    exitDate: {
      type: Date,
      default: null,
    },
    exitReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by User ID is required'],
    },
    updatedBy: {
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
employeeSchema.index({ organizationId: 1, departmentId: 1 });
employeeSchema.index({ organizationId: 1, status: 1 });
employeeSchema.index({ managerId: 1 });
employeeSchema.index({ panNumber: 1 }, { sparse: true });
employeeSchema.index({ aadharNumber: 1 }, { sparse: true });

module.exports = mongoose.model('Employee', employeeSchema);
