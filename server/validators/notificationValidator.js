/**
 * notificationValidator.js
 * Zod validation schemas for Notification endpoints
 */
const { z } = require('zod');
const mongoose = require('mongoose');

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Using the exact enums from the Notification.js schema (Source of Truth)
const notificationTypeEnum = z.enum([
  'Leave', 'Attendance', 'Payroll', 'Task', 'Recruitment',
  'Asset', 'Ticket', 'System', 'Announcement'
]);

const sendNotificationSchema = z.object({
  body: z.object({
    recipientId: objectIdSchema,
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(500),
    notificationType: notificationTypeEnum,
    priority: z.enum(['High', 'Normal', 'Low']).optional(),
    relatedEntityType: z.string().optional(),
    relatedEntityId: objectIdSchema.optional(),
    actionUrl: z.string().url().optional(),
  }),
});

const broadcastNotificationSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(200),
    content: z.string().min(10).max(5000),
    announcementType: z.enum(['General', 'HR Policy', 'Event', 'Holiday', 'Emergency', 'Training']).optional(),
    audienceScope: z.enum(['All', 'Department', 'Location', 'Role']).optional(),
    audienceDepartmentIds: z.array(objectIdSchema).optional(),
    audienceRoles: z.array(z.string()).optional(),
    isPinned: z.boolean().optional(),
  }),
});

const searchNotificationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    isRead: z.enum(['true', 'false']).optional(),
    notificationType: notificationTypeEnum.optional(),
    priority: z.enum(['High', 'Normal', 'Low']).optional(),
    sort: z.string().optional(),
  }),
});

const bulkDeleteSchema = z.object({
  body: z.object({
    notificationIds: z.array(objectIdSchema).min(1),
  }),
});

module.exports = {
  sendNotificationSchema,
  broadcastNotificationSchema,
  searchNotificationSchema,
  bulkDeleteSchema,
};
