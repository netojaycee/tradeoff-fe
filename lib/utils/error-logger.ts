/**
 * Error logging and reporting configuration
 * Provides interface for Sentry or similar error tracking services
 */

import { logger } from '@/lib/utils/logger';

export interface ErrorReport {
  message: string;
  error?: Error | null;
  context?: Record<string, any>;
  severity?: 'fatal' | 'error' | 'warning' | 'info';
  userId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Error logging service
 * Can be connected to Sentry, Rollbar, or other APM services
 */
class ErrorLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private sentryDSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
  private apiEndpoint = '/api/errors';

  /**
   * Report an error to tracking service
   */
  async reportError(errorReport: ErrorReport): Promise<void> {
    try {
      // Log locally first
      logger.error(`[${errorReport.severity || 'error'}] ${errorReport.message}`, {
        error: errorReport.error,
        context: errorReport.context,
      });

      // Don't send to backend in development
      if (this.isDevelopment) {
        console.error('Error Report:', errorReport);
        return;
      }

      // Prepare error payload
      const payload = {
        message: errorReport.message,
        error: errorReport.error?.message || null,
        stack: errorReport.error?.stack || null,
        context: errorReport.context || {},
        severity: errorReport.severity || 'error',
        userId: errorReport.userId,
        url: errorReport.url || (typeof window !== 'undefined' ? window.location.href : null),
        userAgent: errorReport.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : null),
        timestamp: new Date().toISOString(),
      };

      // Send to backend error collection endpoint
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.apiEndpoint,
          JSON.stringify(payload)
        );
      } else {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          // Silently fail - don't crash the app
        });
      }
    } catch (error) {
      console.error('Failed to report error:', error);
    }
  }

  /**
   * Report unhandled promise rejection
   */
  reportUnhandledRejection(reason: unknown): void {
    this.reportError({
      message: 'Unhandled Promise Rejection',
      error: reason instanceof Error ? reason : new Error(String(reason)),
      severity: 'error',
    });
  }

  /**
   * Report global error
   */
  reportGlobalError(event: ErrorEvent): void {
    this.reportError({
      message: event.message,
      error: event.error,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      severity: 'error',
    });
  }

  /**
   * Set user context for error tracking
   */
  setUserContext(userId: string, userData?: Record<string, any>): void {
    if (typeof window !== 'undefined') {
      (window as any).__ERROR_LOGGER_USER__ = { userId, userData };
    }
  }

  /**
   * Clear user context
   */
  clearUserContext(): void {
    if (typeof window !== 'undefined') {
      delete (window as any).__ERROR_LOGGER_USER__;
    }
  }
}

export const errorLogger = new ErrorLogger();

/**
 * Setup global error handlers
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window !== 'undefined') {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      errorLogger.reportGlobalError(event);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      errorLogger.reportUnhandledRejection(event.reason);
    });
  }
}

/**
 * Initialize error logging (call this in layout or app entry)
 */
export function initializeErrorLogging(): void {
  setupGlobalErrorHandlers();

  // Log page views and transitions
  if (typeof window !== 'undefined') {
    const reportPageView = (url: string) => {
      logger.info('Page view', { url });
    };

    // Listen for navigation changes (works with Next.js router)
    if ((window as any).__NEXT_DATA__) {
      reportPageView(window.location.pathname);
    }
  }
}
