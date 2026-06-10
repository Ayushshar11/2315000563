# API Integration Guide

## Authentication

All API requests automatically include:
```
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

Token is automatically loaded from `.env.local` file.

## API Endpoints

The application expects the following endpoints from `http://20.244.56.144/evaluation-service`:

### Get All Notifications
```
GET /api/notifications
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - notification_type: string (filter by type)

Response:
{
  "success": true,
  "data": [
    {
      "id": "123",
      "title": "Semester Registration Open",
      "message": "Online registration for the next semester is now open.",
      "type": "Academic",
      "priority": "high",
      "isRead": false,
      "createdAt": "2024-01-15T10:30:45Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### Get Single Notification
```
GET /api/notifications/{id}

Response:
{
  "success": true,
  "data": {
    "id": "123",
    "title": "Semester Registration Open",
    "message": "Online registration for the next semester is now open.",
    "type": "Academic",
    "priority": "high",
    "isRead": false,
    "createdAt": "2024-01-15T10:30:45Z"
  }
}
```

### Mark as Read
```
PATCH /api/notifications/{id}/read
Body:
{
  "isRead": true
}

Response:
{
  "success": true,
  "data": {
    "id": "123",
    "isRead": true,
    "updatedAt": "2024-01-15T11:30:45Z"
  }
}
```

### Delete Notification
```
DELETE /api/notifications/{id}

Response:
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### Create Notification (Admin)
```
POST /api/notifications
Body:
{
  "title": "New Event",
  "message": "Join us for...",
  "type": "Events",
  "priority": "medium"
}

Response:
{
  "success": true,
  "data": {
    "id": "456",
    "title": "New Event",
    "message": "Join us for...",
    "type": "Events",
    "priority": "medium",
    "isRead": false,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### Update Notification (Admin)
```
PUT /api/notifications/{id}
Body:
{
  "title": "Updated Title",
  "message": "Updated message",
  "type": "Events",
  "priority": "high"
}

Response:
{
  "success": true,
  "data": {
    "id": "456",
    "title": "Updated Title",
    "message": "Updated message",
    "type": "Events",
    "priority": "high",
    "isRead": false,
    "updatedAt": "2024-01-15T13:00:00Z"
  }
}
```

### Get Categories
```
GET /api/categories

Response:
{
  "success": true,
  "data": [
    "Academic",
    "Events",
    "Placements",
    "Facilities",
    "IT",
    "Other"
  ]
}
```

## Notification Schema

Each notification object should have:

```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Notification title
  message: string,               // Notification message/body
  type: string,                  // Category (Academic, Events, Placements, etc.)
  priority: string,              // "high", "medium", or "low"
  isRead: boolean,               // Read status
  createdAt: ISO8601 datetime,   // Creation timestamp
  updatedAt?: ISO8601 datetime   // Last update timestamp (optional)
}
```

## Error Responses

Expected error format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

HTTP Status Codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized (invalid token)
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
- `503` - Service Unavailable

## CORS Configuration

For development at `http://localhost:5173`, your backend needs to allow:
```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Rate Limiting (Optional)

Implement if needed. Frontend will respect:
- Retry-After header
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset

## Testing Endpoints

You can test using curl:

```bash
# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     http://20.244.56.144/evaluation-service/api/notifications

# Get specific notification
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://20.244.56.144/evaluation-service/api/notifications/123

# Mark as read
curl -X PATCH \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"isRead": true}' \
     http://20.244.56.144/evaluation-service/api/notifications/123/read
```

## Frontend Logging

All API calls are logged to browser console. Open DevTools (F12) → Console tab to see:
- Request method and endpoint
- Response status
- Response data
- Error details

## Timeout

Requests timeout after 10 seconds. If your API is slow, adjust in `src/api.js`:
```javascript
const TIMEOUT = 10000; // Change this value (in milliseconds)
```

## HTTPS Deployment

When deploying to production:
1. Ensure API endpoint uses HTTPS
2. Update `VITE_API_BASE_URL` in environment variables
3. Verify CORS headers allow your production domain

---

For questions about implementation, check the logging middleware output in the browser console.
