/**
 * reportValidator.js
 * Zod validation schemas for Reports & Analytics Dashboard endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    endDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    departmentId: objectIdSchema.optional(),
    employeeId: objectIdSchema.optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sort: z.string().optional(),
    export: z.enum(['true', 'false']).optional(),
  }),
});

module.exports = {
  dateRangeSchema,
};
