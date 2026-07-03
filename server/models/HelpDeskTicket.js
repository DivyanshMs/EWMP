/**
 * HelpDeskTicket.js
 * Mongoose Schema for HelpDeskTickets Collection
 * IT and HR support ticket records with full lifecycle tracking from creation to resolution.
 *
 * Authority: DATABASE_DESIGN.md Section 8.5
 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Comment author ID is required'],
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      minlength: [1, 'Comment must be at least 1 character'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: null },
    name: { type: String, trim: true },
  },
  { _id: false }
);

const helpDeskTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^TKT-\d{6}$/, 'Ticket number must match format TKT-000000'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    raisedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Raised by Employee ID is required'],
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Hardware',
        'Software',
        'Network',
        'Access',
        'HR Query',
        'Payroll Query',
        'Policy Query',
        'Other',
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [5, 'Subject must be at least 5 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    attachmentUrls: {
      type: [attachmentSchema],
      default: [],
    },
    ticketStatus: {
      type: String,
      required: true,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
      default: 'Open',
    },
    resolutionNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    satisfactionRating: {
      type: Number,
      default: null,
      min: [1, 'Satisfaction rating must be at least 1'],
      max: [5, 'Satisfaction rating cannot exceed 5'],
    },
    comments: {
      type: [commentSchema],
      validate: [
        function (val) {
          return val.length <= 50;
        },
        'Cannot exceed 50 comments per ticket',
      ],
      default: [],
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
helpDeskTicketSchema.index({ organizationId: 1, ticketStatus: 1 });
helpDeskTicketSchema.index({ organizationId: 1, category: 1 });
helpDeskTicketSchema.index({ raisedById: 1 });
helpDeskTicketSchema.index({ assignedToId: 1 });

module.exports = mongoose.model('HelpDeskTicket', helpDeskTicketSchema);
