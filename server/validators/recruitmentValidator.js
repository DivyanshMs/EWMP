/**
 * recruitmentValidator.js
 * Zod validation schemas for Recruitment Management endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Job Position Schemas
const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    departmentId: objectIdSchema,
    hiringManagerId: objectIdSchema,
    description: z.string().min(10).max(5000),
    requirements: z.array(z.string()).optional(),
    experienceRequired: z.number().min(0).optional(),
    totalVacancies: z.number().min(1).optional(),
    jobStatus: z.enum(['Open', 'On Hold', 'Closed', 'Draft']).optional(),
  }),
});

const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(5000).optional(),
    requirements: z.array(z.string()).optional(),
    experienceRequired: z.number().min(0).optional(),
    totalVacancies: z.number().min(1).optional(),
    jobStatus: z.enum(['Open', 'On Hold', 'Closed', 'Draft']).optional(),
  }),
});

// Candidate Schemas
const createCandidateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    mobile: z.string().max(15).optional(),
    appliedForDesignation: objectIdSchema.optional(),
    appliedForDepartment: objectIdSchema.optional(),
    experience: z.number().min(0).max(60).optional(),
    skills: z.array(z.string()).optional(),
    sourceChannel: z.enum(['LinkedIn', 'Referral', 'Job Board', 'Direct', 'Campus', 'Other']).optional(),
    referredBy: objectIdSchema.optional(),
    resumeUrl: z.string().url().optional(), // Expected to be uploaded via Document/Cloudinary first
  }),
});

const changeCandidateStatusSchema = z.object({
  body: z.object({
    recruitmentStatus: z.enum([
      'Applied',
      'Screening',
      'Technical Interview',
      'HR Interview',
      'Offer',
      'Accepted',
      'Rejected',
      'Withdrawn',
      'Joined',
    ]),
    rejectionReason: z.string().max(500).optional(),
    offerLetterUrl: z.string().url().optional(),
  }),
});

// Interview Schemas
const scheduleInterviewSchema = z.object({
  body: z.object({
    candidateId: objectIdSchema,
    interviewerId: objectIdSchema,
    round: z.enum(['Screening', 'Technical', 'HR', 'Final']),
    scheduledAt: z.string().datetime({ offset: true }).or(z.date()).or(z.string()),
    durationMinutes: z.number().min(15).max(480).optional(),
    mode: z.enum(['In-Person', 'Video Call', 'Phone']).optional(),
    meetingLink: z.string().url().optional(),
    venue: z.string().max(200).optional(),
  }),
});

const interviewFeedbackSchema = z.object({
  body: z.object({
    feedbackScore: z.number().min(1).max(10),
    feedbackNotes: z.string().max(2000).optional(),
    recommendation: z.enum(['Proceed', 'Reject', 'Hold']),
    interviewStatus: z.enum(['Completed', 'No-Show']).optional(),
  }),
});

// Search Schemas
const searchJobSchema = z.object({
  query: z.object({
    departmentId: objectIdSchema.optional(),
    hiringManagerId: objectIdSchema.optional(),
    jobStatus: z.enum(['Open', 'On Hold', 'Closed', 'Draft']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sort: z.string().optional(),
  }),
});

const searchCandidateSchema = z.object({
  query: z.object({
    appliedForDepartment: objectIdSchema.optional(),
    recruitmentStatus: z.enum([
      'Applied', 'Screening', 'Technical Interview', 'HR Interview',
      'Offer', 'Accepted', 'Rejected', 'Withdrawn', 'Joined',
    ]).optional(),
    sourceChannel: z.enum(['LinkedIn', 'Referral', 'Job Board', 'Direct', 'Campus', 'Other']).optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    sort: z.string().optional(),
    search: z.string().optional(),
  }),
});

module.exports = {
  createJobSchema,
  updateJobSchema,
  createCandidateSchema,
  changeCandidateStatusSchema,
  scheduleInterviewSchema,
  interviewFeedbackSchema,
  searchJobSchema,
  searchCandidateSchema,
};
