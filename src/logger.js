// Logging middleware for tracking function calls, API requests, state changes, and errors

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

let currentLogLevel = LOG_LEVELS.INFO;

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, category, message, data = null) => {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [${level}] [${category}]`;
  return { prefix, message, data };
};

export const logger = {
  setLogLevel: (level) => {
    currentLogLevel = level;
  },

  debug: (category, message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      const log = formatLog('DEBUG', category, message, data);
      console.log(`${log.prefix} ${log.message}`, log.data || '');
    }
  },

  info: (category, message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      const log = formatLog('INFO', category, message, data);
      console.log(`${log.prefix} ${log.message}`, log.data || '');
    }
  },

  warn: (category, message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      const log = formatLog('WARN', category, message, data);
      console.warn(`${log.prefix} ${log.message}`, log.data || '');
    }
  },

  error: (category, message, data = null) => {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      const log = formatLog('ERROR', category, message, data);
      console.error(`${log.prefix} ${log.message}`, log.data || '');
    }
  },

  // Middleware for API calls
  logApiCall: (method, endpoint, data = null) => {
    logger.info('API', `${method} ${endpoint}`, data);
  },

  logApiResponse: (method, endpoint, status, data = null) => {
    logger.info('API', `${method} ${endpoint} - Status ${status}`, data);
  },

  logApiError: (method, endpoint, error) => {
    logger.error('API', `${method} ${endpoint} - Error`, error);
  },

  // Middleware for state changes
  logStateChange: (component, previousState, newState) => {
    logger.debug(component, 'State changed', { previous: previousState, new: newState });
  },

  // Middleware for event handlers
  logEventHandler: (component, eventName, data = null) => {
    logger.debug(component, `Event: ${eventName}`, data);
  },

  // Middleware for component lifecycle
  logComponentMount: (componentName) => {
    logger.debug(componentName, 'Component mounted');
  },

  logComponentUnmount: (componentName) => {
    logger.debug(componentName, 'Component unmounted');
  },
};

export default logger;
