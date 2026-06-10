# Quick Start Guide - Campus Notification System

## Authentication Setup ✅

Your JWT token and API credentials have been configured. The system is now ready to connect to your backend API at:

**API Endpoint:** `http://20.244.56.144/evaluation-service`

**User Profile:**
- Email: ayush.sharma5_cs23@gla.ac.in
- Name: ayush sharma
- Roll No: 2315000563
- Access Code: RPsgYt

## Start Development Server

```bash
npm run dev
```

This will:
- Start the Vite dev server at `http://localhost:5173`
- Load environment variables from `.env.local`
- Auto-reload on file changes
- Open browser automatically

## View API Logs

When running the app:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. You'll see logs like:
   ```
   [2024-01-15T10:30:45.123Z] [INFO] [API] GET /api/notifications
   [2024-01-15T10:30:45.456Z] [DEBUG] [App] Fetching notifications
   [2024-01-15T10:30:45.789Z] [INFO] [API] GET /api/notifications - Status 200
   ```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory. Ready to deploy!

## Key Features

✅ **Automatic Authentication** - JWT token automatically included in all API calls
✅ **Logging Middleware** - All API calls, state changes, and events are logged
✅ **Error Handling** - Graceful error messages if API fails
✅ **Pagination** - View 10 notifications per page
✅ **Filtering** - Filter by type (Academic, Events, Placements, etc.)
✅ **Priority Sorting** - Top priority notifications highlighted
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Environment Variables

The `.env.local` file contains:
- `VITE_API_BASE_URL` - Your API endpoint
- `VITE_ACCESS_TOKEN` - JWT authentication token

**Never commit `.env.local` to version control!** It's already in `.gitignore`.

## Troubleshooting

### API Calls Not Working?
1. Check browser console (F12) for error logs
2. Network tab shows HTTP requests
3. Verify token is valid (currently expires soon - you may need a refresh mechanism)

### CORS Issues?
Your backend needs to allow requests from `http://localhost:5173` (for development).

### Port Already in Use?
Vite will automatically use the next available port.

## Next Steps

1. Start the dev server: `npm run dev`
2. Test the notification system
3. Check browser console for logs
4. Build for production: `npm run build`
5. Deploy the `dist/` folder to your hosting

Happy coding! 🚀
