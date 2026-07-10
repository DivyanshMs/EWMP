/**
 * aiValidator.js — Phase 1/9: AI Infrastructure & Conversation Memory Schemas
 * Zod validation schemas for AI endpoints.
 *
 * Authority: API_SPECIFICATION.md Section 10
 */

const { z, idParamSchema, paginationQuerySchema } = require('../../validators/validationFramework');

const conversationIdSchema = z.string().trim().min(1, 'Conversation ID cannot be empty').optional();

const chatRequestSchema = z.object({
  message: z.string({ required_error: 'Message is required' }).trim().min(1, 'Message is required').max(10000, 'Message cannot exceed 10000 characters'),
  conversationId: conversationIdSchema,
  module: z.string().trim().optional(),
  filters: z.record(z.any()).optional(),
});

const summarizeRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(10000, 'Message cannot exceed 10000 characters').optional(),
  conversationId: conversationIdSchema,
  module: z.string().trim().optional(),
  filters: z.record(z.any()).optional(),
});

const insightsRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(10000, 'Message cannot exceed 10000 characters').optional(),
  conversationId: conversationIdSchema,
  module: z.string().trim().optional(),
  filters: z.record(z.any()).optional(),
});

const recommendationsRequestSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(10000, 'Message cannot exceed 10000 characters').optional(),
  conversationId: conversationIdSchema,
  module: z.string().trim().optional(),
  filters: z.record(z.any()).optional(),
});

const actionPlanRequestSchema = z.object({
  message: z.string({ required_error: 'Message is required' }).trim().min(1, 'Message is required').max(10000, 'Message cannot exceed 10000 characters'),
  conversationId: conversationIdSchema,
  module: z.string().trim().optional(),
  filters: z.record(z.any()).optional(),
});

module.exports = {
  chatRequestSchema,
  summarizeRequestSchema,
  insightsRequestSchema,
  recommendationsRequestSchema,
  actionPlanRequestSchema,
  idParamSchema,
  paginationQuerySchema,
};
