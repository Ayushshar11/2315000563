import React, { useState, useEffect } from 'react';
import { logger } from './logger';
import { api } from './api';
import {
  sortByPriority,
  filterByType,
  paginateNotifications,
  getTopPriorityNotifications,
  normalizeNotifications,
  getUniqueTypes,
} from './utils';
import NotificationCard from './components/NotificationCard';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';
import './App.css';

const ITEMS_PER_PAGE = 10;
const TOP_NOTIFICATIONS_COUNT = 10;

// Main App component for the Affordmed campus notification system
function App() {
  const [allNotifications, setAllNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [topPriorityNotifications, setTopPriorityNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch notifications on component mount
  useEffect(() => {
    logger.logComponentMount('App');
    fetchNotifications(1, 'all');

    return () => {
      logger.logComponentUnmount('App');
    };
  }, []);

  // Apply filters and sorting when notifications or filters change
  useEffect(() => {
    logger.debug('App', 'Applying filters and sorting');

    if (allNotifications.length === 0) {
      setFilteredNotifications([]);
      setTopPriorityNotifications([]);
      return;
    }

    let processed = allNotifications;

    // Apply type filter
    processed = filterByType(processed, selectedType);

    // Sort by priority (Affordmed: Placement=30, Result=20, Event=10 + recency)
    processed = sortByPriority(processed);

    logger.logStateChange('App', { count: allNotifications.length }, { filteredCount: processed.length });

    setFilteredNotifications(processed);

    // Get top 10 priority notifications
    const topNotifications = getTopPriorityNotifications(processed, TOP_NOTIFICATIONS_COUNT);
    setTopPriorityNotifications(topNotifications);

    // Reset to first page when filters change
    setCurrentPage(1);
  }, [allNotifications, selectedType]);

  const fetchNotifications = async (page = 1, type = 'all') => {
    logger.logEventHandler('App', 'Fetching notifications', { page, type });
    setLoading(true);
    setError(null);

    try {
      // Build query parameters for API
      const params = {
        page: page,
        limit: ITEMS_PER_PAGE,
      };

      // Add notification type filter if not 'all'
      if (type && type !== 'all') {
        params.notification_type = type;
        logger.debug('App', 'Filtering by type in API call', { type });
      }

      logger.info('App', 'Calling API with params', params);
      const response = await api.getNotifications(params);

      if (response.success) {
        // Normalize API response (handle both response.data.notifications and response.data)
        const rawData = response.data;
        const normalizedNotifications = normalizeNotifications(rawData);

        logger.info('App', 'Notifications fetched successfully', {
          count: normalizedNotifications.length,
          rawDataType: typeof rawData,
        });

        setAllNotifications(normalizedNotifications);
      } else {
        // Show error instead of fallback to mock data
        const errorMessage = response.error || 'Failed to fetch notifications from API';
        logger.error('App', 'API call failed', { error: response.error });
        setError(`⚠️ ${errorMessage}`);
        setAllNotifications([]);
      }
    } catch (err) {
      logger.error('App', 'Exception during fetch', { error: err.message });
      setError(`⚠️ Error: ${err.message}`);
      setAllNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    logger.logEventHandler('App', 'Marking notification as read', { id: notificationId });

    setAllNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleDeleteNotification = (notificationId) => {
    logger.logEventHandler('App', 'Deleting notification', { id: notificationId });

    setAllNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== notificationId)
    );
  };

  const handleTypeChange = (type) => {
    logger.logEventHandler('App', 'Type filter changed', { type });
    logger.logStateChange('App', { selectedType }, { selectedType: type });
    setSelectedType(type);
    setCurrentPage(1); // Reset to first page when filter changes
    fetchNotifications(1, type); // Fetch from API with new filter
  };

  const handlePageChange = (page) => {
    logger.logEventHandler('App', 'Page changed', { page, selectedType });
    setCurrentPage(page);
    fetchNotifications(page, selectedType); // Fetch from API with new page
  };

  // Get paginated data from filtered notifications
  const paginatedData = paginateNotifications(filteredNotifications, currentPage, ITEMS_PER_PAGE);

  // Get available notification types from all notifications
  const availableTypes = getUniqueTypes(allNotifications);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Campus Notifications</h1>
        <p className="header-subtitle">Affordmed Notifications System - Latest Updates</p>
      </header>

      <main className="app-main">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">Total Notifications:</span>
            <span className="stat-value">{allNotifications.length}</span>
          </div>
          {selectedType !== 'all' && (
            <div className="stat">
              <span className="stat-label">Filtered Type:</span>
              <span className="stat-value">{selectedType}</span>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        {!loading && !error && allNotifications.length > 0 && (
          <FilterBar
            notifications={allNotifications}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
        )}

        {/* Loading State */}
        {loading && <div className="loading-state">⏳ Loading notifications...</div>}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn-retry" onClick={() => fetchNotifications(1, 'all')}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && allNotifications.length === 0 && (
          <div className="empty-state">
            <p>📭 No notifications found.</p>
            <p>Check back later for updates.</p>
          </div>
        )}

        {/* Top 10 Priority Notifications Section */}
        {!loading && !error && topPriorityNotifications.length > 0 && (
          <section className="top-priority-section">
            <h2 className="section-title">🔥 Top {Math.min(TOP_NOTIFICATIONS_COUNT, topPriorityNotifications.length)} Priority Notifications</h2>
            <div className="top-notifications-list">
              {topPriorityNotifications.map((notification) => (
                <NotificationCard
                  key={`top-${notification.id}`}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                  isTopPriority={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Notifications with Pagination */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <section className="all-notifications-section">
            <h2 className="section-title">📋 All Notifications</h2>

            <div className="notifications-list">
              {paginatedData.data.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {paginatedData.totalPages > 1 && (
              <Pagination
                currentPage={paginatedData.currentPage}
                totalPages={paginatedData.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={paginatedData.totalItems}
              />
            )}
          </section>
        )}

        {/* Refresh Button */}
        <button
          className="btn-refresh"
          onClick={() => fetchNotifications(1, selectedType)}
          disabled={loading}
          title="Reload notifications from API"
        >
          {loading ? '⏳ Refreshing...' : '🔄 Refresh Notifications'}
        </button>
      </main>
    </div>
  );
}

export default App;
