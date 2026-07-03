/**
 * Payroll.js
 * Mongoose Schema for Payroll Collection
 * Monthly payroll run records. One document per employee per payroll period.
 *
 * Authority: DATABASE_DESIGN.md Section 7.12
 */

const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema(
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
    salaryStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalaryStructure',
      default: null,
    },
    payPeriodMonth: {
      type: Number,
      required: [true, 'Pay period month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    payPeriodYear: {
      type: Number,
      required: [true, 'Pay period year is required'],
      min: [2000, 'Invalid year'],
      max: [2100, 'Invalid year'],
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    hra: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'HRA cannot be negative'],
    },
    da: {
      type: Number,
      default: 0,
      min: [0, 'DA cannot be negative'],
    },
    medicalAllowance: {
      type: Number,
      default: 0,
      min: [0, 'Medical allowance cannot be negative'],
    },
    travelAllowance: {
      type: Number,
      default: 0,
      min: [0, 'Travel allowance cannot be negative'],
    },
    overtimePay: {
      type: Number,
      default: 0,
      min: [0, 'Overtime pay cannot be negative'],
    },
    bonus: {
      type: Number,
      default: 0,
      min: [0, 'Bonus cannot be negative'],
    },
    grossSalary: {
      type: Number,
      required: [true, 'Gross salary is required'],
      min: [0, 'Gross salary cannot be negative'],
    },
    pfDeduction: {
      type: Number,
      default: 0,
      min: [0, 'PF deduction cannot be negative'],
    },
    professionalTax: {
      type: Number,
      default: 0,
      min: [0, 'Professional tax cannot be negative'],
    },
    incomeTax: {
      type: Number,
      default: 0,
      min: [0, 'Income tax cannot be negative'],
    },
    leaveDayDeduction: {
      type: Number,
      default: 0,
      min: [0, 'Leave day deduction cannot be negative'],
    },
    otherDeductions: {
      type: Number,
      default: 0,
      min: [0, 'Other deductions cannot be negative'],
    },
    totalDeductions: {
      type: Number,
      required: [true, 'Total deductions is required'],
      min: [0, 'Total deductions cannot be negative'],
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
      min: [0, 'Net salary cannot be negative'],
    },
    workingDays: {
      type: Number,
      required: [true, 'Working days is required'],
      min: [0, 'Working days cannot be negative'],
    },
    presentDays: {
      type: Number,
      required: [true, 'Present days is required'],
      min: [0, 'Present days cannot be negative'],
    },
    leaveDays: {
      type: Number,
      default: 0,
      min: [0, 'Leave days cannot be negative'],
    },
    absentDays: {
      type: Number,
      default: 0,
      min: [0, 'Absent days cannot be negative'],
    },
    overtimeHours: {
      type: Number,
      default: 0,
      min: [0, 'Overtime hours cannot be negative'],
    },
    payrollStatus: {
      type: String,
      required: true,
      enum: ['Draft', 'Processed', 'Approved', 'Paid'],
      default: 'Draft',
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    payslipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payslip',
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
payrollSchema.index({ employeeId: 1, payPeriodYear: 1, payPeriodMonth: 1 }, { unique: true });
payrollSchema.index({ organizationId: 1, payPeriodYear: 1, payPeriodMonth: 1 });
payrollSchema.index({ organizationId: 1, payrollStatus: 1 });
payrollSchema.index({ employeeId: 1 });

module.exports = mongoose.model('Payroll', payrollSchema);
