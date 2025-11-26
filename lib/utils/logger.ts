/**
 * Logger utility
 * Environment-aware logging with development/production checks
 */

export const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, but with distinction in production
    if (process.env.NODE_ENV === 'production') {
      // In production, could send to error tracking service (e.g., Sentry)
      console.error('[ERROR]', ...args);
    } else {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  },

  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(...args);
    }
  },
};
