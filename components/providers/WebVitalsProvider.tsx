'use client';

import { useEffect } from 'react';

/**
 * Type for performance metric
 */
interface Metric {
  name: string;
  value: number;
  rating?: 'good' | 'poor';
  delta?: number;
  id: string;
}

/**
 * Send metrics to analytics service
 */
async function sendMetric(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating || 'good',
    delta: metric.delta || 0,
    id: metric.id,
    url: typeof window !== 'undefined' ? window.location.href : null,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    timestamp: new Date().toISOString(),
  };

  try {
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics/vitals',
        JSON.stringify(body)
      );
    } else {
      await fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      });
    }
  } catch (error) {
    console.error('Failed to send web vital:', error);
  }
}

/**
 * Web Vitals component
 * Measures performance metrics using Performance Observer API
 */
export function WebVitalsProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Measure navigation timing
      const perfData = window.performance?.timing;
      if (perfData) {
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        if (pageLoadTime > 0) {
          sendMetric({
            name: 'PageLoadTime',
            value: pageLoadTime,
            rating: pageLoadTime < 3000 ? 'good' : 'poor',
            delta: 0,
            id: `page-load-${Date.now()}`,
          });
        }

        // First Contentful Paint
        const fcp = perfData.responseEnd - perfData.navigationStart;
        if (fcp > 0) {
          sendMetric({
            name: 'FirstContentfulPaint',
            value: fcp,
            rating: fcp < 1800 ? 'good' : 'poor',
            id: `fcp-${Date.now()}`,
          });
        }
      }

      // Resource timing
      const resources = window.performance?.getEntriesByType('resource') || [];
      const totalResourceTime = resources.reduce((acc: number, r: any) => acc + r.duration, 0);
      const avgResourceTime = resources.length > 0 ? totalResourceTime / resources.length : 0;

      if (avgResourceTime > 0) {
        sendMetric({
          name: 'AvgResourceTime',
          value: avgResourceTime,
          rating: avgResourceTime < 500 ? 'good' : 'poor',
          id: `resource-time-${Date.now()}`,
        });
      }

      // Connection speed - track but don't log
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        sendMetric({
          name: 'ConnectionType',
          value: conn.effectiveType === '4g' ? 4 : conn.effectiveType === '3g' ? 3 : 2,
          id: `connection-${Date.now()}`,
        });
      }
    } catch (error) {
      console.error('Failed to collect web vitals:', error);
    }
  }, []);

  return null;
}
