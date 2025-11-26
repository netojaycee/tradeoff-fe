'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * Enables PWA functionality with offline support
 */
export function ServiceWorkerProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.error('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for controller change (update available)
      let refreshing = false;
      navigator.serviceWorker.oncontrollerchange = () => {
        if (!refreshing) {
          refreshing = true;
          // Notify user that app has been updated
          if (window.confirm('New version available! Reload to update?')) {
            window.location.reload();
          }
        }
      };

      // Check for updates periodically
      const updateInterval = setInterval(() => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
          }
        });
      }, 60000); // Check every minute

      return () => clearInterval(updateInterval);
    }
  }, []);

  return null;
}
