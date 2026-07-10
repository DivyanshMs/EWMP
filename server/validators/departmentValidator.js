const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const createDepartmentSchema = z.object({

  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().max(10),
  description: z.string().trim().max(500).optional().nullable(),
  managerId: objectIdSchema.optional().nullable(),
  parentDeptId: objectIdSchema.optional().nullable(),

});

const updateDepartmentSchema = z.object({

  name: z.string().trim().min(2).max(100).optional(),
  code: z.string().trim().toUpperCase().max(10).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  managerId: objectIdSchema.optional().nullable(),
  parentDeptId: objectIdSchema.optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),

});

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
};
