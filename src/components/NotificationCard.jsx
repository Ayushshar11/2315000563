import React, { useState } from 'react';
import { logger } from '../logger';
import { api } from '../api';
import { formatDate } from '../utils';

// NotificationCard component displays a single notification
const NotificationCard = ({ notification, onMarkAsRead, onDelete, isTopPriority = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  logger.logComponentMount(`NotificationCard-${notification.id}`);

  const handleMarkAsRead = async () => {
    logger.logEventHandler('NotificationCard', 'Mark as read clicked', { id: notification.id });

    if (notification.isRead) return;

    try {
      const response = await api.markAsRead(notification.id);

      if (response.success) {
        logger.info('NotificationCard', 'Marked as read', { id: notification.id });
        onMarkAsRead(notification.id);
      } else {
        logger.error('NotificationCard', 'Failed to mark as read', response.error);
      }
    } catch (error) {
      logger.error('NotificationCard', 'Error marking as read', error.message);
    }
  };

  const handleDelete = async () => {
    logger.logEventHandler('NotificationCard', 'Delete clicked', { id: notification.id });

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await api.deleteNotification(notification.id);

      if (response.success) {
        logger.info('NotificationCard', 'Notification deleted', { id: notification.id });
        onDelete(notification.id);
      } else {
        logger.error('NotificationCard', 'Failed to delete notification', response.error);
        setDeleteError(response.error);
      }
    } catch (error) {
      logger.error('NotificationCard', 'Error deleting notification', error.message);
      setDeleteError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`notification-card ${isTopPriority ? 'top-priority' : ''} ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="notification-header">
        <div className="notification-meta">
          <span className="notification-type">{notification.type}</span>
          <span className="notification-date">{formatDate(notification.createdAt)}</span>
          {isTopPriority && <span className="top-priority-badge">🔥 Top Priority</span>}
        </div>
        {!notification.isRead && <span className="unread-badge">New</span>}
      </div>

      <div className="notification-content">
        <h3 className="notification-title">{notification.title}</h3>
        <p className="notification-body">{notification.message}</p>
      </div>

      <div className="notification-actions">
        {!notification.isRead && (
          <button className="btn-mark-read" onClick={handleMarkAsRead} disabled={isDeleting}>
            Mark as read
          </button>
        )}
        <button className="btn-delete" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {deleteError && <div className="error-message">{deleteError}</div>}
    </div>
  );
};

export default NotificationCard;
