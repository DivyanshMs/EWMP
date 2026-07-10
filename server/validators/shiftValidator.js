const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const createShiftSchema = z.object({

  name: z.string().trim().min(2).max(100),
  code: z.string().trim().toUpperCase().max(10),
  startTime: z.string().trim().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  endTime: z.string().trim().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  workingHours: z.number().min(1).max(24),
  overtimeThreshold: z.number().min(1).max(24).optional(),
  weeklyOffDays: z.array(z.string()).optional(),
  gracePeriodMinutes: z.number().min(0).max(60).optional(),

});

const updateShiftSchema = z.object({

  name: z.string().trim().min(2).max(100).optional(),
  code: z.string().trim().toUpperCase().max(10).optional(),
  startTime: z.string().trim().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional(),
  endTime: z.string().trim().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional(),
  workingHours: z.number().min(1).max(24).optional(),
  overtimeThreshold: z.number().min(1).max(24).optional(),
  weeklyOffDays: z.array(z.string()).optional(),
  gracePeriodMinutes: z.number().min(0).max(60).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),

});

module.exports = {
  createShiftSchema,
  updateShiftSchema,
};
