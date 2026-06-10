# API Connection Troubleshooting

## Common Issues and Solutions

### 1. Authorization Header Not Sent

**Problem:** API returns 401 Unauthorized

**Solution:**
1. Check `.env.local` exists and contains `VITE_ACCESS_TOKEN`
2. Verify token is not empty
3. Restart dev server (Vite doesn't auto-reload env changes)
4. Check browser console logs for warnings about missing token

```bash
# Verify .env.local exists
cat .env.local

# Restart dev server
npm run dev
```

### 2. CORS Errors

**Problem:** Browser console shows CORS errors

**Solution:**
Your backend needs to allow requests from localhost:5173. Contact backend team to add:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### 3. Connection Timeout

**Problem:** "Request timeout. Please try again."

**Solution:**
- API endpoint is slow or unreachable
- Check: `http://20.244.56.144/evaluation-service` is online
- Increase timeout in `src/api.js` (currently 10 seconds):

```javascript
const TIMEOUT = 15000; // 15 seconds
```

### 4. No Notifications Displayed

**Problem:** Page shows "No notifications found"

**Solution:**
1. Check browser console (F12 → Console tab)
2. Look for API errors in logs
3. Verify API response format matches expected schema
4. Check if API returns empty array instead of data

### 5. Token Expired

**Problem:** "API Error: 401 Unauthorized" after some time

**Solution:**
Current token expires at: 2026-06-10 (based on JWT payload)

If expired, you need a new token. Contact your admin to get a fresh token and update `.env.local`:

```
VITE_ACCESS_TOKEN=new_token_here
```

Then restart the dev server.

### 6. Network Request Shows But No Response

**Problem:** API call hangs or takes very long

**Solution:**
1. Check Network tab (F12 → Network tab)
2. Look for pending requests
3. Verify API endpoint URL is correct
4. Check if backend is running
5. Try accessing endpoint directly in browser

### 7. Backend Returns Different Error Format

**Problem:** Error handling doesn't show custom error messages

**Solution:**
Update error parsing in `src/api.js`:

```javascript
// In fetchWithTimeout function, modify error handling:
const errorData = await response.json().catch(() => ({}));

// Add logic to handle your custom error format
const errorMessage = errorData.error || errorData.message || 'Unknown error';
```

## Debugging Steps

### Step 1: Check Network Requests
```
1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. Look for API requests
5. Click on request to see:
   - Request headers (including Authorization)
   - Request body
   - Response status
   - Response body
```

### Step 2: Check Console Logs
```
1. Open DevTools (F12)
2. Go to "Console" tab
3. Look for logs like:
   - [INFO] [API] GET /api/notifications
   - [INFO] [API] ... - Status 200
   - [ERROR] [API] ... - Error ...
```

### Step 3: Check Environment Variables
```bash
# In browser console (F12 → Console):
console.log(import.meta.env.VITE_API_BASE_URL)
console.log(import.meta.env.VITE_ACCESS_TOKEN)

# Should show:
# http://20.244.56.144/evaluation-service
# eyJhbGciOiJIUzI1NiIs...
```

### Step 4: Test API Directly
```bash
# PowerShell:
$token = "your_token_here"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Invoke-RestMethod `
    -Uri "http://20.244.56.144/evaluation-service/api/notifications" `
    -Headers $headers `
    -Method Get

# Or use curl:
curl -H "Authorization: Bearer $token" \
     http://20.244.56.144/evaluation-service/api/notifications
```

## Log Levels

Adjust logging verbosity in `src/logger.js`:

```javascript
import { logger } from './logger';

// In any component:
logger.setLogLevel(0); // DEBUG - very verbose
logger.setLogLevel(1); // INFO - default
logger.setLogLevel(2); // WARN - only warnings
logger.setLogLevel(3); // ERROR - only errors
```

## Check .env.local Setup

The file should look like:
```
VITE_API_BASE_URL=http://20.244.56.144/evaluation-service
VITE_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- No spaces around `=`
- No quotes around values
- File must be in project root (same level as package.json)
- Vite must be restarted after changes

## Restart Development Server

```bash
# Stop current server (Ctrl+C)

# Then restart:
npm run dev
```

## Check Vite Configuration

Your Vite config at `vite.config.js` should have:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
```

This ensures environment variables are properly loaded.

## Production Deployment

When building for production:

```bash
npm run build
```

Before deploying:
1. Verify `VITE_API_BASE_URL` points to production API
2. Update `.env.local` with production values
3. Rebuild with: `npm run build`
4. Deploy `dist/` folder
5. Ensure production API allows requests from your domain

## Still Having Issues?

1. Check the output of `npm run dev` for startup errors
2. Look at browser console for JavaScript errors
3. Verify API is accessible (ping the endpoint)
4. Check API logs on backend for auth failures
5. Verify token is valid and not expired

For advanced debugging:
```bash
# Run with verbose logging
DEBUG=* npm run dev
```

---

Need help? Check:
- API_INTEGRATION.md - Full API documentation
- README.md - Project overview
- Browser console logs - Real-time debugging
