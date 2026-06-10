import { logger } from './logger';

// Utility functions for business logic

// Calculate priority score for notification sorting (Affordmed Assessment)
// Priority by type:
//   - Placement: 30 points
//   - Result: 20 points
//   - Event: 10 points
// Plus recency score based on timestamp
export const calculatePriorityScore = (notification) => {
  logger.debug('Utils', 'Calculating priority score for notification', { id: notification.id, type: notification.type });

  let score = 0;

  // Type-based priority scoring (Affordmed requirement)
  const typeScore = {
    'Placement': 30,
    'Result': 20,
    'Event': 10,
  };

  score += typeScore[notification.type] || 0;

  // Recency scoring: newer notifications get higher score
  // Each hour = 1 point (so recent notifications get good boost)
  const notificationDate = new Date(notification.createdAt).getTime();
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const hoursSince = (now - notificationDate) / hourInMs;

  // Recency score: max 100 points for very recent, decays over 100 hours
  const recencyScore = Math.max(0, 100 - hoursSince);
  score += recencyScore;

  return score;
};

// Get top N priority notifications (sorted by priority score)
export const getTopPriorityNotifications = (notifications, count = 10) => {
  logger.debug('Utils', 'Getting top priority notifications', { count, totalCount: notifications.length });

  return [...notifications]
    .sort((a, b) => calculatePriorityScore(b) - calculatePriorityScore(a))
    .slice(0, count);
};

// Sort notifications by priority
export const sortByPriority = (notifications) => {
  logger.debug('Utils', 'Sorting notifications by priority', { count: notifications.length });

  return [...notifications].sort((a, b) => {
    const scoreA = calculatePriorityScore(a);
    const scoreB = calculatePriorityScore(b);
    return scoreB - scoreA;
  });
};

// Filter notifications by type (Affordmed types: Event, Result, Placement)
export const filterByType = (notifications, type) => {
  logger.debug('Utils', 'Filtering notifications by type', { type, totalCount: notifications.length });

  if (!type || type === 'all') {
    return notifications;
  }

  return notifications.filter((notification) => notification.type === type);
};

// Filter notifications by read status
export const filterByReadStatus = (notifications, showUnreadOnly) => {
  logger.debug('Utils', 'Filtering by read status', { showUnreadOnly, totalCount: notifications.length });

  if (!showUnreadOnly) {
    return notifications;
  }

  return notifications.filter((notification) => !notification.isRead);
};

// Normalize notification data from API response
// Handles both array format and nested format
export const normalizeNotifications = (data) => {
  logger.debug('Utils', 'Normalizing notifications data', { type: typeof data });

  if (!data) {
    return [];
  }

  // If data is already an array
  if (Array.isArray(data)) {
    return data;
  }

  // If data has a notifications property
  if (Array.isArray(data.notifications)) {
    return data.notifications;
  }

  // Otherwise return empty array
  return [];
};

// Paginate notifications
export const paginateNotifications = (notifications, page, itemsPerPage) => {
  logger.debug('Utils', 'Paginating notifications', { page, itemsPerPage, totalCount: notifications.length });

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return {
    data: notifications.slice(startIndex, endIndex),
    currentPage: page,
    totalPages,
    totalItems: notifications.length,
    itemsPerPage,
  };
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = date.toDateString();
  const todayDateOnly = today.toDateString();
  const yesterdayDateOnly = yesterday.toDateString();

  if (dateOnly === todayDateOnly) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  if (dateOnly === yesterdayDateOnly) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

// Get unique notification types from list
export const getUniqueTypes = (notifications) => {
  const types = new Set(notifications.map((n) => n.type));
  return Array.from(types).sort();
};

// Get priority label
export const getPriorityLabel = (priority) => {
  const labels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };
  return labels[priority] || 'Normal';
};

// Get priority color class
export const getPriorityColor = (priority) => {
  const colors = {
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };
  return colors[priority] || '';
};

export default {
  calculatePriorityScore,
  sortByPriority,
  filterByType,
  filterByReadStatus,
  normalizeNotifications,
  getTopPriorityNotifications,
  paginateNotifications,
  formatDate,
  getUniqueTypes,
  getPriorityLabel,
  getPriorityColor,
};
