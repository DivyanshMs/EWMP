/**
 * documentValidator.js
 * Zod validation schemas for Document endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const uploadDocumentSchema = z.object({
  body: z.object({
    category: z.enum(['HR', 'Employee', 'Payroll', 'Project', 'Asset', 'Legal', 'Finance', 'Policy', 'Other']),
    tags: z.string().optional(), // In form-data, arrays might come as comma-separated strings or stringified JSON
    employeeId: objectIdSchema.optional(),
    projectId: objectIdSchema.optional(),
    assetId: objectIdSchema.optional(),
  }),
});

const updateDocumentSchema = z.object({
  body: z.object({
    category: z.enum(['HR', 'Employee', 'Payroll', 'Project', 'Asset', 'Legal', 'Finance', 'Policy', 'Other']).optional(),
    tags: z.array(z.string()).optional(),
    employeeId: objectIdSchema.optional(),
    projectId: objectIdSchema.optional(),
    assetId: objectIdSchema.optional(),
  }),
});

const searchDocumentSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    category: z.enum(['HR', 'Employee', 'Payroll', 'Project', 'Asset', 'Legal', 'Finance', 'Policy', 'Other']).optional(),
    employeeId: objectIdSchema.optional(),
    projectId: objectIdSchema.optional(),
    assetId: objectIdSchema.optional(),
    uploader: objectIdSchema.optional(),
    sort: z.string().optional(),
  }),
});

module.exports = {
  uploadDocumentSchema,
  updateDocumentSchema,
  searchDocumentSchema,
};
