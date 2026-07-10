const Notification = require('../models/Notification');
const Announcement = require('../models/Announcement');
const AuditLog = require('../models/AuditLog');
const AppError = require('../utils/AppError');
const { buildPaginationAndSort } = require('../utils/paginationHelper');
const { logInfo, logError } = require('../utils/loggerHelper');

const createAuditLog = async (data) => {
  try {
    await AuditLog.create(data);
  } catch (err) {
    logError('Audit log creation failed', { error: err.message, data });
  }
};

/**
 * Send a notification to a specific recipient
 */
const sendNotification = async (data, organizationId, user) => {
  const notification = await Notification.create({
    ...data,
    organizationId,
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'SEND_NOTIFICATION',
    entityType: 'Notification',
    entityId: notification._id,
    newValue: { recipientId: notification.recipientId, notificationType: notification.notificationType },
  });

  logInfo(`Notification sent to ${data.recipientId}`);
  return notification;
};

/**
 * Broadcast an Organization-wide or targeted Announcement
 */
const broadcastAnnouncement = async (data, organizationId, user) => {
  const announcement = await Announcement.create({
    ...data,
    organizationId,
    createdBy: user._id,
    publishedAt: new Date(), // Auto-publish for now
  });

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'BROADCAST_ANNOUNCEMENT',
    entityType: 'Announcement',
    entityId: announcement._id,
    newValue: announcement,
  });

  logInfo(`Announcement broadcasted: ${announcement._id}`);
  return announcement;
};

/**
 * Get paginated list of notifications
 */
const getNotifications = async (queryParams, organizationId, recipientId = null) => {
  const { page = 1, limit = 10, isRead, notificationType, priority, sort = '-createdAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  if (recipientId) {
    query.recipientId = recipientId;
  }
  
  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (notificationType) query.notificationType = notificationType;
  if (priority) query.priority = priority;

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Notification.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Notification.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Get paginated list of announcements (Org-wide)
 */
const getAnnouncements = async (queryParams, organizationId) => {
  const { page = 1, limit = 10, sort = '-publishedAt' } = queryParams;

  const query = { organizationId, status: 'active' };

  const { skip, limit: parsedLimit, sortObj } = buildPaginationAndSort({ page, limit, sort });

  const [data, total] = await Promise.all([
    Announcement.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort(sortObj)
      .skip(skip)
      .limit(parsedLimit),
    Announcement.countDocuments(query),
  ]);

  return { data, total, page: Number(page), limit: parsedLimit };
};

/**
 * Mark notification as read
 */
const markAsRead = async (id, organizationId, recipientId) => {
  const notification = await Notification.findOne({ _id: id, organizationId, recipientId, status: 'active' });
  if (!notification) {
    throw new AppError(404, 'Notification not found');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  logInfo(`Notification marked as read: ${id}`);
  return notification;
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (organizationId, recipientId) => {
  const result = await Notification.updateMany(
    { organizationId, recipientId, isRead: false, status: 'active' },
    { $set: { isRead: true, readAt: new Date() } }
  );

  logInfo(`Marked ${result.modifiedCount} notifications as read for user: ${recipientId}`);
  return { modifiedCount: result.modifiedCount };
};

/**
 * Delete a notification (soft delete)
 */
const deleteNotification = async (id, organizationId, recipientId, user) => {
  // If recipientId is provided, enforce ownership (Employee). Otherwise, it's an admin.
  const query = { _id: id, organizationId };
  if (recipientId) query.recipientId = recipientId;

  const notification = await Notification.findOne(query);
  if (!notification) {
    throw new AppError(404, 'Notification not found or unauthorized');
  }

  notification.status = 'archived';
  await notification.save();

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'DELETE_NOTIFICATION',
    entityType: 'Notification',
    entityId: notification._id,
  });

  logInfo(`Notification archived: ${id}`);
  return null;
};

/**
 * Bulk delete notifications (soft delete)
 */
const bulkDelete = async (notificationIds, organizationId, recipientId, user) => {
  const query = { _id: { $in: notificationIds }, organizationId };
  if (recipientId) query.recipientId = recipientId;

  const result = await Notification.updateMany(
    query,
    { $set: { status: 'archived' } }
  );

  await createAuditLog({
    organizationId,
    actorUserId: user._id,
    actorRole: user.role,
    action: 'BULK_DELETE_NOTIFICATIONS',
    entityType: 'Notification',
    newValue: { modifiedCount: result.modifiedCount },
  });

  logInfo(`Bulk deleted ${result.modifiedCount} notifications`);
  return { modifiedCount: result.modifiedCount };
};

/**
 * Get Notification Preferences (Stub, since it's not in the DB design)
 */
const getPreferences = async () => {
  return {
    emailNotifications: true,
    inAppNotifications: true,
    doNotDisturb: false,
  };
};

module.exports = {
  sendNotification,
  broadcastAnnouncement,
  getNotifications,
  getAnnouncements,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  bulkDelete,
  getPreferences,
};
