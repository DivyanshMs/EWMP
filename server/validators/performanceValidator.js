/**
 * performanceValidator.js
 * Zod validation schemas for Performance Management endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Performance Review Schemas
const createReviewSchema = z.object({
  body: z.object({
    employeeId: objectIdSchema,
    reviewerId: objectIdSchema,
    quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
    year: z.number().min(2000).max(2100),
  }),
});

const selfAssessmentSchema = z.object({
  body: z.object({
    selfAssessment: z.string().max(2000),
    selfRating: z.number().min(1).max(5),
  }),
});

const managerAssessmentSchema = z.object({
  body: z.object({
    managerFeedback: z.string().max(2000),
    managerRating: z.number().min(1).max(5),
    kpiScore: z.number().min(0).max(100).optional(),
    attendanceScore: z.number().min(0).max(100).optional(),
  }),
});

const hrAssessmentSchema = z.object({
  body: z.object({
    finalRating: z.number().min(1).max(5),
    overallLevel: z.enum(['Outstanding', 'Excellent', 'Good', 'Needs Improvement', 'Unsatisfactory']),
    promotionRecommended: z.boolean().optional(),
    promotionNotes: z.string().max(500).optional(),
  }),
});

const searchReviewSchema = z.object({
  query: z.object({
    employeeId: objectIdSchema.optional(),
    reviewerId: objectIdSchema.optional(),
    quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional(),
    year: z.string().regex(/^\d{4}$/).optional(),
    reviewStatus: z.enum(['Draft', 'Self-Assessment Pending', 'Manager Review Pending', 'Completed']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sort: z.string().optional(),
  }),
});

// Goal Schemas
const createGoalSchema = z.object({
  body: z.object({
    employeeId: objectIdSchema,
    title: z.string().min(5).max(200),
    description: z.string().max(1000).optional(),
    targetDate: z.string().datetime({ offset: true }).or(z.date()).or(z.string()),
    quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']),
    year: z.number().min(2000).max(2100),
    goalType: z.enum(['KPI', 'Learning', 'Project', 'Behavior']).optional(),
    targetValue: z.number().optional(),
  }),
});

const updateGoalProgressSchema = z.object({
  body: z.object({
    achievedValue: z.number().optional(),
    completionPercent: z.number().min(0).max(100).optional(),
    goalStatus: z.enum(['Not Started', 'In Progress', 'Completed', 'Missed']).optional(),
  }),
});

const evaluateGoalSchema = z.object({
  body: z.object({
    managerRating: z.number().min(1).max(5),
    managerNotes: z.string().max(1000).optional(),
  }),
});

const searchGoalSchema = z.object({
  query: z.object({
    employeeId: objectIdSchema.optional(),
    setByManagerId: objectIdSchema.optional(),
    quarter: z.enum(['Q1', 'Q2', 'Q3', 'Q4']).optional(),
    year: z.string().regex(/^\d{4}$/).optional(),
    goalStatus: z.enum(['Not Started', 'In Progress', 'Completed', 'Missed']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sort: z.string().optional(),
  }),
});

module.exports = {
  createReviewSchema,
  selfAssessmentSchema,
  managerAssessmentSchema,
  hrAssessmentSchema,
  searchReviewSchema,
  createGoalSchema,
  updateGoalProgressSchema,
  evaluateGoalSchema,
  searchGoalSchema,
};
