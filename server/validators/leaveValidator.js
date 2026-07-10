/**
 * leaveValidator.js — Phase 4B: Leave Management Module
 * Zod schemas for Leave Types, Balances, and Requests.
 *
 * Authority: API_SPECIFICATION.md Section 7.2, 7.4, 7.5
 */

const { z, objectIdSchema, dateStringSchema, paginationQuerySchema } = require('./validationFramework');

// ─── Leave Types ─────────────────────────────────────────────────────────────

const createLeaveTypeSchema = z.object({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().min(1).max(10).toUpperCase(),
  description: z.string().trim().max(500).optional().nullable(),
  maxDaysPerYear: z.number().min(0).max(365),
  isCarryForward: z.boolean().optional().default(false),
  maxCarryForwardDays: z.number().min(0).optional().default(0),
  isPaidLeave: z.boolean().optional().default(true),
  requiresApproval: z.boolean().optional().default(true),
  minAdvanceNoticeDays: z.number().min(0).optional().default(1),
  applicableGender: z.enum(['Male', 'Female', 'All']).optional().nullable(),
});

const updateLeaveTypeSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  code: z.string().trim().min(1).max(10).toUpperCase().optional(),
  description: z.string().trim().max(500).optional().nullable(),
  maxDaysPerYear: z.number().min(0).max(365).optional(),
  isCarryForward: z.boolean().optional(),
  maxCarryForwardDays: z.number().min(0).optional(),
  isPaidLeave: z.boolean().optional(),
  requiresApproval: z.boolean().optional(),
  minAdvanceNoticeDays: z.number().min(0).optional(),
  applicableGender: z.enum(['Male', 'Female', 'All']).optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

// ─── Leave Balances Queries ──────────────────────────────────────────────────

const leaveBalanceQuerySchema = z.object({
  employeeId: objectIdSchema.optional(),
  year: z.string().optional().transform(val => val ? parseInt(val, 10) : new Date().getFullYear()),
  leaveTypeId: objectIdSchema.optional(),
});

const myLeaveBalanceQuerySchema = z.object({
  year: z.string().optional().transform(val => val ? parseInt(val, 10) : new Date().getFullYear()),
});

// ─── Leave Requests ──────────────────────────────────────────────────────────

const leaveRequestQuerySchema = paginationQuerySchema.extend({
  employeeId: objectIdSchema.optional(),
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
  leaveTypeId: objectIdSchema.optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

const myLeaveRequestQuerySchema = paginationQuerySchema.extend({
  approvalStatus: z.enum(['Pending', 'Approved', 'Rejected', 'Cancelled']).optional(),
  year: z.string().optional().transform(val => val ? parseInt(val, 10) : undefined),
});

const submitLeaveRequestSchema = z.object({
  leaveTypeId: objectIdSchema,
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  isHalfDay: z.boolean().optional().default(false),
  halfDaySession: z.enum(['Morning', 'Afternoon']).optional().nullable(),
  reason: z.string().trim().min(10).max(500),
});

const approveLeaveRequestSchema = z.object({
  approverNotes: z.string().trim().max(500).optional().nullable(),
});

const rejectLeaveRequestSchema = z.object({
  approverNotes: z.string().trim().min(5).max(500),
});

const cancelLeaveRequestSchema = z.object({
  cancellationReason: z.string().trim().min(5).max(500),
});

module.exports = {
  createLeaveTypeSchema,
  updateLeaveTypeSchema,
  leaveBalanceQuerySchema,
  myLeaveBalanceQuerySchema,
  leaveRequestQuerySchema,
  myLeaveRequestQuerySchema,
  submitLeaveRequestSchema,
  approveLeaveRequestSchema,
  rejectLeaveRequestSchema,
  cancelLeaveRequestSchema,
};
