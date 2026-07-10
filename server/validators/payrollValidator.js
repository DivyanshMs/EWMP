/**
 * payrollValidator.js
 * Zod validation schemas for Payroll endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const processPayrollSchema = z.object({
  payPeriodMonth: z.number().min(1).max(12),
  payPeriodYear: z.number().min(2000).max(2100),
  employeeIds: z.array(objectIdSchema).optional(),
});

module.exports = {
  processPayrollSchema,
};
