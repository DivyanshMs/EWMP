const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const createHolidaySchema = z.object({

  name: z.string().trim().min(2).max(100),
  date: dateStringSchema,
  year: z.number().int().min(2000).max(2100),
  holidayType: z.enum(['Public', 'Restricted', 'Optional']).optional(),
  applicableLocations: z.array(objectIdSchema).optional(),
  description: z.string().trim().max(500).optional().nullable(),

});

const updateHolidaySchema = z.object({

  name: z.string().trim().min(2).max(100).optional(),
  date: dateStringSchema.optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  holidayType: z.enum(['Public', 'Restricted', 'Optional']).optional(),
  applicableLocations: z.array(objectIdSchema).optional(),
  description: z.string().trim().max(500).optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),

});

module.exports = {
  createHolidaySchema,
  updateHolidaySchema,
};
