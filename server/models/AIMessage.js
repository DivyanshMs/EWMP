/**
 * AiMessage.js
 * Mongoose Schema for AiMessages Collection
 * Individual message records within an AI conversation. Stores both user prompts and AI responses.
 *
 * Authority: DATABASE_DESIGN.md Section 8.8
 */

const mongoose = require('mongoose');

const aiMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AiConversation',
      required: [true, 'Conversation ID is required'],
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['user', 'assistant'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [1, 'Content must be at least 1 character'],
      maxlength: [10000, 'Content cannot exceed 10000 characters'],
    },
    moduleContext: {
      type: String,
      enum: [
        'Leave',
        'Attendance',
        'Payroll',
        'Recruitment',
        'Performance',
        'Document',
        'General',
      ],
      default: null,
    },
    promptTokens: {
      type: Number,
      default: null,
      min: [0, 'Prompt tokens cannot be negative'],
    },
    completionTokens: {
      type: Number,
      default: null,
      min: [0, 'Completion tokens cannot be negative'],
    },
    totalTokens: {
      type: Number,
      default: null,
      min: [0, 'Total tokens cannot be negative'],
    },
    isError: {
      type: Boolean,
      required: true,
      default: false,
    },
    errorMessage: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    feedbackRating: {
      type: Number,
      default: null,
      min: [1, 'Feedback rating must be at least 1'],
      max: [5, 'Feedback rating cannot exceed 5'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable message exchange
  }
);

// Indexes
aiMessageSchema.index({ conversationId: 1, createdAt: 1 });
aiMessageSchema.index({ conversationId: 1 });
aiMessageSchema.index({ organizationId: 1, createdAt: 1 });

module.exports = mongoose.model('AiMessage', aiMessageSchema);
