/**
 * projectValidator.js
 * Zod validation schemas for Project endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    code: z.string().max(20),
    description: z.string().max(2000).optional(),
    departmentId: objectIdSchema.optional(),
    projectManagerId: objectIdSchema,
    teamMemberIds: z.array(objectIdSchema).optional(),
    startDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()), // Accept ISO string
    endDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    budget: z.number().min(0).optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    departmentId: objectIdSchema.optional(),
    projectManagerId: objectIdSchema.optional(),
    teamMemberIds: z.array(objectIdSchema).optional(),
    startDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    endDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    budget: z.number().min(0).optional(),
    completionPercent: z.number().min(0).max(100).optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    projectStatus: z.enum(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']),
    actualEndDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
  }),
});

module.exports = {
  createProjectSchema,
  updateProjectSchema,
  updateStatusSchema,
};
