import { logger } from './logger';

// API configuration with authentication token from environment variables
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://4.224.186.213/evaluation-service';
const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
console.log("TOKEN FROM ENV:", ACCESS_TOKEN);
console.log("BASE URL:", API_BASE_URL);
const TIMEOUT = 10000; // 10 seconds

// DEBUG: Log environment at module initialization
console.log('=== API MODULE INITIALIZATION DEBUG ===');
console.log('[ENV] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('[ENV] VITE_ACCESS_TOKEN exists:', !!import.meta.env.VITE_ACCESS_TOKEN);
console.log('[ENV] VITE_ACCESS_TOKEN length:', import.meta.env.VITE_ACCESS_TOKEN?.length || 0);
console.log('[ENV] VITE_ACCESS_TOKEN first 20 chars:', import.meta.env.VITE_ACCESS_TOKEN?.substring(0, 20) + '...');
console.log('[ENV] Token has whitespace:', /^\s|\s$/.test(import.meta.env.VITE_ACCESS_TOKEN || ''));
console.log('=== END INITIALIZATION DEBUG ===');

// Helper function to get default headers with authentication
const getHeaders = () => {
  if (!ACCESS_TOKEN) {
    logger.warn('API', 'ACCESS_TOKEN not configured. Set VITE_ACCESS_TOKEN in .env.local');
    console.warn('[HEADERS] ⚠️ NO ACCESS TOKEN - Authorization header will be missing!');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(ACCESS_TOKEN && { 'Authorization': `Bearer ${ACCESS_TOKEN}` }),
  };
  
  // DEBUG: Log the exact headers being used
  console.log('[HEADERS] Authorization header:', headers['Authorization'] ? `Bearer ${ACCESS_TOKEN?.substring(0, 20)}...` : 'NOT SET');
  console.log('[HEADERS] Full headers object:', JSON.stringify({
    'Content-Type': headers['Content-Type'],
    'Authorization': headers['Authorization'] ? `Bearer [TOKEN_PRESENT_${ACCESS_TOKEN?.length}_CHARS]` : 'NOT SET'
  }));
  console.log("AUTH HEADER:", {
  Authorization: ACCESS_TOKEN
    ? `Bearer ${ACCESS_TOKEN.substring(0, 20)}...`
    : "MISSING"
});
  
  return headers;
};

// Helper function to make API requests with logging and timeout
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    logger.logApiCall(options.method || 'GET', url);
    
    // DEBUG: Log full request details
    const headers = {
      ...getHeaders(),
      ...options.headers,
    };
    console.log('[REQUEST] Method:', options.method || 'GET');
    console.log('[REQUEST] URL:', url);
    console.log('[REQUEST] Full Headers:', JSON.stringify(headers, null, 2));
    console.log('[REQUEST] Headers keys:', Object.keys(headers));
    console.log('[REQUEST] Authorization present:', 'Authorization' in headers);
    console.log('[REQUEST] Authorization value:', headers['Authorization'] ? `Bearer [${ACCESS_TOKEN?.length}_CHAR_TOKEN]` : 'MISSING');

    const response = await fetch(url, {
      ...options,
      headers: headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    // DEBUG: Log response details
    console.log('[RESPONSE] Status:', response.status);
    console.log('[RESPONSE] StatusText:', response.statusText);
    console.log('[RESPONSE] Headers:', {
      'content-type': response.headers.get('content-type'),
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.logApiError(options.method || 'GET', url, errorData);
      console.error('[ERROR] API returned error status:', response.status);
      console.error('[ERROR] Response body:', errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    logger.logApiResponse(options.method || 'GET', url, response.status, data);

    return { success: true, data, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('[ERROR] Request aborted - timeout after', TIMEOUT, 'ms');
      logger.logApiError(options.method || 'GET', url, 'Request timeout');
      return { success: false, error: 'Request timeout. Please try again.' };
    }

    console.error('[ERROR] Fetch error:', error);
    logger.error('API', 'Fetch error', error.message);
    return { success: false, error: error.message };
  }
};

export const api = {
  getNotifications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/notifications${
      queryString ? `?${queryString}` : ''
    }`;

    return fetchWithTimeout(url);
  },
};

export default api;
