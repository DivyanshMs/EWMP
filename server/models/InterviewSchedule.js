/**
 * InterviewSchedule.js
 * Mongoose Schema for InterviewSchedules Collection
 * Records interview appointments between candidates and interviewers.
 *
 * Authority: DATABASE_DESIGN.md Section 7.3
 */

const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate ID is required'],
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Interviewer ID is required'],
    },
    round: {
      type: String,
      required: [true, 'Interview round is required'],
      enum: ['Screening', 'Technical', 'HR', 'Final'],
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Scheduled date and time is required'],
      validate: {
        validator: function (v) {
          if (!v || !this.isNew) return true;
          return v > new Date();
        },
        message: 'Scheduled date must be in the future',
      },
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 480 minutes'],
    },
    mode: {
      type: String,
      required: true,
      enum: ['In-Person', 'Video Call', 'Phone'],
      default: 'In-Person',
    },
    meetingLink: {
      type: String,
      default: null,
    },
    venue: {
      type: String,
      trim: true,
      maxlength: 200,
      default: null,
    },
    interviewStatus: {
      type: String,
      required: true,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Scheduled',
    },
    feedbackScore: {
      type: Number,
      default: null,
      min: [1, 'Feedback score must be at least 1'],
      max: [10, 'Feedback score cannot exceed 10'],
    },
    feedbackNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
    recommendation: {
      type: String,
      enum: ['Proceed', 'Reject', 'Hold'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by User ID is required'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
interviewScheduleSchema.index({ candidateId: 1, round: 1 });
interviewScheduleSchema.index({ interviewerId: 1 });
interviewScheduleSchema.index({ scheduledAt: 1 });
interviewScheduleSchema.index({ organizationId: 1 });

module.exports = mongoose.model('InterviewSchedule', interviewScheduleSchema);
