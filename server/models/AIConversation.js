/**
 * AiConversation.js
 * Mongoose Schema for AiConversations Collection
 * AI chat session containers. Each conversation is a user-initiated AI assistant session.
 *
 * Authority: DATABASE_DESIGN.md Section 8.7
 */

const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema(
  {
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    sessionTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      default: 'New Conversation',
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
    messageCount: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Message count cannot be negative'],
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    tokenUsageTotal: {
      type: Number,
      default: 0,
      min: [0, 'Token usage total cannot be negative'],
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
aiConversationSchema.index({ employeeId: 1, createdAt: -1 });
aiConversationSchema.index({ organizationId: 1, moduleContext: 1 });
aiConversationSchema.index({ employeeId: 1 });

module.exports = mongoose.model('AiConversation', aiConversationSchema);
