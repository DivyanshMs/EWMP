const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const createLocationSchema = z.object({

  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().max(10),
  address: z.object({
    street: z.string().trim().max(200).optional().nullable(),
    city: z.string().trim().max(100).optional().nullable(),
    state: z.string().trim().max(100).optional().nullable(),
    country: z.string().trim().max(100).optional().nullable(),
    pincode: z.string().trim().max(10).optional().nullable(),
  }),
  isRemote: z.boolean().optional(),

});

const updateLocationSchema = z.object({

  name: z.string().trim().min(2).max(100).optional(),
  code: z.string().trim().toUpperCase().max(10).optional(),
  address: z.object({
    street: z.string().trim().max(200).optional().nullable(),
    city: z.string().trim().max(100).optional().nullable(),
    state: z.string().trim().max(100).optional().nullable(),
    country: z.string().trim().max(100).optional().nullable(),
    pincode: z.string().trim().max(10).optional().nullable(),
  }).optional(),
  isRemote: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),

});

module.exports = {
  createLocationSchema,
  updateLocationSchema,
};
