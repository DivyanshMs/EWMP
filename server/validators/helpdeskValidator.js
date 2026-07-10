/**
 * helpDeskValidator.js
 * Zod validation schemas for Help Desk Ticket endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const categoryEnum = z.enum([
  'Hardware', 'Software', 'Network', 'Access',
  'HR Query', 'Payroll Query', 'Policy Query', 'Other'
]);

const priorityEnum = z.enum(['Critical', 'High', 'Medium', 'Low']);

const ticketStatusEnum = z.enum(['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened']);

const attachmentSchema = z.object({
  url: z.string().url(),
  publicId: z.string().optional(),
  name: z.string().optional(),
});

const createTicketSchema = z.object({
  body: z.object({
    category: categoryEnum,
    priority: priorityEnum.optional(),
    subject: z.string().min(5).max(200),
    description: z.string().min(10).max(2000),
    attachmentUrls: z.array(attachmentSchema).optional(),
    raisedById: objectIdSchema.optional(), // Usually inferred from user, but admin can specify
  }),
});

const updateTicketSchema = z.object({
  body: z.object({
    category: categoryEnum.optional(),
    priority: priorityEnum.optional(),
    subject: z.string().min(5).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
  }),
});

const assignTicketSchema = z.object({
  body: z.object({
    assignedToId: objectIdSchema,
  }),
});

const changeStatusSchema = z.object({
  body: z.object({
    ticketStatus: ticketStatusEnum,
    resolutionNotes: z.string().max(2000).optional(),
  }),
});

const addCommentSchema = z.object({
  body: z.object({
    text: z.string().min(1).max(1000),
  }),
});

const searchTicketSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    ticketStatus: ticketStatusEnum.optional(),
    category: categoryEnum.optional(),
    priority: priorityEnum.optional(),
    raisedById: objectIdSchema.optional(),
    assignedToId: objectIdSchema.optional(),
    sort: z.string().optional(),
  }),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  assignTicketSchema,
  changeStatusSchema,
  addCommentSchema,
  searchTicketSchema,
};
