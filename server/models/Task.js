/**
 * Task.js
 * Mongoose Schema for Tasks Collection
 * Individual task records within projects. Tracks status, assignments, priorities, and deadlines.
 *
 * Authority: DATABASE_DESIGN.md Section 8.2
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
    mimeType: { type: String, trim: true },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    assignedToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    reportedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Reported by Employee ID is required'],
    },
    taskStatus: {
      type: String,
      required: true,
      enum: ['To Do', 'In Progress', 'Review', 'Completed', 'Blocked'],
      default: 'To Do',
    },
    priority: {
      type: String,
      required: true,
      enum: ['Critical', 'High', 'Medium', 'Low'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    estimatedHours: {
      type: Number,
      default: null,
      min: [0, 'Estimated hours cannot be negative'],
    },
    loggedHours: {
      type: Number,
      default: 0,
      min: [0, 'Logged hours cannot be negative'],
    },
    sprintName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },
    tags: {
      type: [{ type: String, trim: true }],
      validate: [
        function (val) {
          return val.length <= 10;
        },
        'Cannot exceed 10 tags',
      ],
      default: [],
    },
    attachmentUrls: {
      type: [attachmentSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      validate: [
        function (val) {
          return val.length <= 100;
        },
        'Cannot exceed 100 comments per task',
      ],
      default: [],
    },
    blockedReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
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
taskSchema.index({ projectId: 1, taskStatus: 1 });
taskSchema.index({ assignedToId: 1 });
taskSchema.index({ organizationId: 1, taskStatus: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ projectId: 1 });

module.exports = mongoose.model('Task', taskSchema);
