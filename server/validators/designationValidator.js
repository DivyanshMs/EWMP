const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const createDesignationSchema = z.object({

  title: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().max(20),
  grade: z.string().trim().max(10).optional().nullable(),
  departmentId: objectIdSchema.optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),

});

const updateDesignationSchema = z.object({

  title: z.string().trim().min(2).max(100).optional(),
  code: z.string().trim().toUpperCase().max(20).optional(),
  grade: z.string().trim().max(10).optional().nullable(),
  departmentId: objectIdSchema.optional().nullable(),
  description: z.string().trim().max(500).optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),

});

module.exports = {
  createDesignationSchema,
  updateDesignationSchema,
};
