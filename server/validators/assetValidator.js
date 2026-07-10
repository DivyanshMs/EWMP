/**
 * assetValidator.js
 * Zod validation schemas for Asset endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

const createAssetSchema = z.object({
  body: z.object({
    assetTag: z.string().min(1),
    name: z.string().min(2).max(100),
    assetType: z.enum([
      'Laptop', 'Desktop', 'Monitor', 'Mobile Phone', 'Keyboard',
      'Mouse', 'Furniture', 'Vehicle', 'Software License', 'Other'
    ]),
    brand: z.string().max(100).optional(),
    model: z.string().max(100).optional(),
    serialNumber: z.string().optional(),
    purchaseDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    purchaseCost: z.number().min(0).optional(),
    warrantyExpiry: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    locationId: objectIdSchema.optional(),
    assetStatus: z.enum(['Available', 'Allocated', 'Under Maintenance', 'Retired', 'Lost']).optional(),
    condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),
    notes: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const updateAssetSchema = z.object({
  body: z.object({
    assetTag: z.string().min(1).optional(),
    name: z.string().min(2).max(100).optional(),
    assetType: z.enum([
      'Laptop', 'Desktop', 'Monitor', 'Mobile Phone', 'Keyboard',
      'Mouse', 'Furniture', 'Vehicle', 'Software License', 'Other'
    ]).optional(),
    brand: z.string().max(100).optional(),
    model: z.string().max(100).optional(),
    serialNumber: z.string().optional(),
    purchaseDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    purchaseCost: z.number().min(0).optional(),
    warrantyExpiry: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    locationId: objectIdSchema.optional(),
    assetStatus: z.enum(['Available', 'Allocated', 'Under Maintenance', 'Retired', 'Lost']).optional(),
    condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),
    notes: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
  }),
});

const allocateAssetSchema = z.object({
  body: z.object({
    employeeId: objectIdSchema,
    allocationDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()),
    expectedReturnDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()).optional(),
    conditionOnIssue: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
    allocationNotes: z.string().max(500).optional(),
  }),
});

const returnAssetSchema = z.object({
  body: z.object({
    actualReturnDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()),
    conditionOnReturn: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
    returnNotes: z.string().max(500).optional(),
  }),
});

module.exports = {
  createAssetSchema,
  updateAssetSchema,
  allocateAssetSchema,
  returnAssetSchema,
};
