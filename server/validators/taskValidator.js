/**
 * taskValidator.js
 * Zod validation schemas for Task endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const attachmentSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  name: z.string().optional(),
  mimeType: z.string().optional(),
});

const createTaskSchema = z.object({
  body: z.object({
    projectId: objectIdSchema,
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    assignedToId: objectIdSchema.optional(),
    reportedById: objectIdSchema,
    taskStatus: z.enum(['To Do', 'In Progress', 'Review', 'Completed', 'Blocked']).optional(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    dueDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()),
    estimatedHours: z.number().min(0).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    attachmentUrls: z.array(attachmentSchema).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    assignedToId: objectIdSchema.optional(),
    taskStatus: z.enum(['To Do', 'In Progress', 'Review', 'Completed', 'Blocked']).optional(),
    priority: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    dueDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    estimatedHours: z.number().min(0).optional(),
    loggedHours: z.number().min(0).optional(),
    blockedReason: z.string().max(500).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    attachmentUrls: z.array(attachmentSchema).optional(),
  }),
});

const updateTaskStatusSchema = z.object({
  body: z.object({
    taskStatus: z.enum(['To Do', 'In Progress', 'Review', 'Completed', 'Blocked']),
    blockedReason: z.string().max(500).optional(),
  }),
});

const addCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(1000),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  addCommentSchema,
};
