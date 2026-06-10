# Campus Notification System - Frontend

A clean, maintainable React + Vite frontend for a campus notification system with logging middleware, pagination, filtering, and priority-based notification sorting.

## Features

- **Notification Display**: View all campus notifications in a clean card-based layout
- **Priority-Based Sorting**: Notifications automatically sorted by priority level, read status, and recency
- **Type Filtering**: Filter notifications by type (Academic, Events, Placements, etc.)
- **Unread Filter**: Quick toggle to show only unread notifications
- **Pagination**: Efficient pagination with configurable items per page
- **Mark as Read**: Mark individual notifications as read with API integration
- **Delete Notifications**: Remove notifications with confirmation
- **Logging Middleware**: Comprehensive logging for all major functions, API calls, and state changes
- **Responsive Design**: Mobile-friendly layout for all screen sizes
- **Error Handling**: Graceful error handling with fallback to mock data
- **Loading States**: Clear loading indicators for better UX

## Project Structure

```
src/
├── components/
│   ├── NotificationCard.jsx    # Individual notification display component
│   ├── FilterBar.jsx           # Filter controls (type, unread toggle)
│   └── Pagination.jsx          # Pagination controls and navigation
├── App.jsx                     # Main application component
├── App.css                     # Global styles
├── main.jsx                    # React entry point
├── logger.js                   # Logging middleware for all operations
├── api.js                      # API utilities with fetch wrapper
└── utils.js                    # Business logic utility functions
```

## Technology Stack

- **React 18.2.0**: UI framework with functional components and hooks
- **Vite 4.4.0**: Fast build tool and dev server
- **JavaScript (ES6+)**: Plain JavaScript, no TypeScript
- **Fetch API**: Native HTTP client for API calls

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Configuration

### API Base URL

Set the API base URL via environment variable:

```bash
# Create .env.local file
REACT_APP_API_URL=http://your-api-domain.com/api
```

Default: `http://localhost:3000/api`

### Logging Level

Logging levels can be adjusted in the logger:

```javascript
import { logger } from './logger';

// Set to DEBUG for verbose logging
logger.setLogLevel(0); // DEBUG
logger.setLogLevel(1); // INFO (default)
logger.setLogLevel(2); // WARN
logger.setLogLevel(3); // ERROR
```

## API Endpoints Expected

The application expects the following API endpoints:

```
GET  /api/notifications              # Get all notifications
GET  /api/notifications/:id          # Get single notification
POST /api/notifications              # Create notification (admin)
PUT  /api/notifications/:id          # Update notification (admin)
DELETE /api/notifications/:id        # Delete notification (admin)
PATCH /api/notifications/:id/read    # Mark as read
GET  /api/categories                 # Get notification categories
```

### Notification Object Schema

```javascript
{
  id: string,
  title: string,
  message: string,
  type: string,              // e.g., "Academic", "Events", "Placements"
  priority: string,          // "high", "medium", or "low"
  isRead: boolean,
  createdAt: ISO8601 datetime
}
```

## Key Components

### NotificationCard
Displays a single notification with:
- Title and message
- Type badge and creation date
- Priority indicator
- Unread badge (if unread)
- Mark as read and delete actions
- Error handling for failed operations

### FilterBar
Provides filtering controls:
- Type dropdown filter
- Unread toggle with count badge
- Responsive layout

### Pagination
Handles navigation through pages:
- Previous/Next buttons
- Page number buttons with smart display
- Item count display
- Disabled state for boundary pages

## Logging Features

The application includes comprehensive logging across:

- **API Calls**: All fetch requests logged with method, endpoint, and response
- **Event Handlers**: User interactions logged with context
- **State Changes**: Component state modifications tracked
- **Component Lifecycle**: Mount/unmount events logged
- **Errors**: All errors captured with full context

### Example Logs

```
[2024-01-15T10:30:45.123Z] [INFO] [API] GET /api/notifications
[2024-01-15T10:30:45.456Z] [DEBUG] [App] State changed
[2024-01-15T10:30:45.789Z] [INFO] [API] GET /api/notifications - Status 200
```

## Utility Functions

### Priority Calculation (`utils.js`)

Notifications are scored based on:
- Unread status (1000 points)
- Priority level (500 for high, 250 for medium)
- Recency (up to 300 points, decays daily)

### Date Formatting

Smart date formatting showing:
- "Today at 3:45 PM"
- "Yesterday at 10:20 AM"
- "Jan 15, 2024"

## Error Handling

- **API Failures**: Falls back to mock data for demonstration
- **Network Timeouts**: 10-second timeout with user-friendly error message
- **Invalid Data**: Graceful handling with validation
- **Empty States**: Clear messaging when no notifications match filters

## Development Best Practices Used

1. **Functional Components**: All components use React hooks (useState, useEffect)
2. **Separation of Concerns**: Business logic in utils, API calls in api.js, logging in logger.js
3. **Meaningful Naming**: Clear variable and function names throughout
4. **Clean Code**: Minimal abstractions, focused components
5. **Error Boundaries**: Try-catch blocks around all async operations
6. **Mock Data**: Fallback data for development without backend
7. **Responsive Design**: Mobile-first CSS with breakpoints
8. **Accessibility**: Semantic HTML and proper ARIA labels

## Mock Data

The application includes mock notification data that automatically loads if the API is unavailable. This is useful for development and testing:

```javascript
// In App.jsx
const getMockNotifications = () => { ... }
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will prompt you to use the next available port.

### API Connection Issues
If the backend API is not running, the app will automatically use mock data. Check the browser console for API errors.

### Styling Issues
Clear browser cache if styles don't update (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Logging Not Visible
Check browser console (F12 or Cmd+Option+I) for log messages

## Future Enhancements

- Dark mode toggle
- Real-time notifications via WebSocket
- Search functionality
- Advanced filtering by date range
- Notification grouping by category
- User preferences and saved filters
- Analytics dashboard
- Multi-language support

## Code Quality

- No external logging libraries, using native console
- No unnecessary dependencies
- Clean variable naming and code organization
- Consistent error handling pattern
- Inline comments where useful (not excessive)

## License

This project is part of a campus notification system assignment.

## Support

For issues or questions, check:
1. Browser console logs (press F12)
2. Network tab for API requests
3. Application logs in the logging middleware
