const { z, objectIdSchema, dateStringSchema } = require('./validationFramework');

const clockInSchema = z.object({
  locationId: objectIdSchema.optional().nullable(),
  gpsCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional().nullable(),
  deviceInfo: z.string().trim().optional().nullable(),
});

const clockOutSchema = z.object({
  gpsCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional().nullable(),
  deviceInfo: z.string().trim().optional().nullable(),
});

const correctionRequestSchema = z.object({
  correctedClockIn: dateStringSchema.optional(),
  correctedClockOut: dateStringSchema.optional(),
  correctionNotes: z.string().trim().min(10).max(500),
});

const correctionApproveSchema = z.object({
  approved: z.boolean(),
  approverNotes: z.string().trim().optional(),
});

module.exports = {
  clockInSchema,
  clockOutSchema,
  correctionRequestSchema,
  correctionApproveSchema
};
