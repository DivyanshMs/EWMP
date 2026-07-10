const notificationService = require('../services/notificationService');
const { sendSuccess, sendPaginatedSuccess } = require('../utils/formatResponse');

/**
 * GET /api/notifications
 * List User Notifications
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.query, req.user.organizationId, req.user.employeeId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/org
 * List Organization Notifications (Admin)
 */
const getOrgNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.query, req.user.organizationId, null);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Organization notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/announcements
 * List Organization Announcements
 */
const getAnnouncements = async (req, res, next) => {
  try {
    const result = await notificationService.getAnnouncements(req.query, req.user.organizationId);
    sendPaginatedSuccess(res, result.data, result.total, result.page, result.limit, 'Announcements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notifications/send
 * Send Targeted Notification
 */
const sendNotification = async (req, res, next) => {
  try {
    const result = await notificationService.sendNotification(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Notification sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notifications/broadcast
 * Broadcast Organization Announcement
 */
const broadcastAnnouncement = async (req, res, next) => {
  try {
    const result = await notificationService.broadcastAnnouncement(req.body, req.user.organizationId, req.user);
    sendSuccess(res, result, 'Announcement broadcasted successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark Notification as Read
 */
const markAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user.organizationId, req.user.employeeId);
    sendSuccess(res, result, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notifications/read-all
 * Mark All as Read
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.organizationId, req.user.employeeId);
    sendSuccess(res, result, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/notifications/:id
 * Delete Notification
 */
const deleteNotification = async (req, res, next) => {
  try {
    const recipientId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    await notificationService.deleteNotification(req.params.id, req.user.organizationId, recipientId, req.user);
    sendSuccess(res, null, 'Notification deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/notifications/bulk-delete
 * Bulk Delete Notifications
 */
const bulkDelete = async (req, res, next) => {
  try {
    const recipientId = req.user.role === 'EMPLOYEE' ? req.user.employeeId : null;
    const result = await notificationService.bulkDelete(req.body.notificationIds, req.user.organizationId, recipientId, req.user);
    sendSuccess(res, result, 'Notifications deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/notifications/preferences
 * Get Notification Preferences
 */
const getPreferences = async (req, res, next) => {
  try {
    const result = await notificationService.getPreferences();
    sendSuccess(res, result, 'Preferences retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  getOrgNotifications,
  getAnnouncements,
  sendNotification,
  broadcastAnnouncement,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  bulkDelete,
  getPreferences,
};
