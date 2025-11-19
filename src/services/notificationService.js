import api from './api';

export const notificationService = {
  // Get notifications
  getNotifications: (unreadOnly = false, limit = 20) => {
    return api.get(`/notifications?unreadOnly=${unreadOnly}&limit=${limit}`);
  },

  // Mark as read
  markAsRead: (notificationId) => {
    return api.put(`/notifications/${notificationId}/read`);
  },

  // Mark all as read
  markAllAsRead: () => {
    return api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (notificationId) => {
    return api.delete(`/notifications/${notificationId}`);
  },

  // Clear all
  clearAll: () => {
    return api.delete('/notifications');
  }
};
