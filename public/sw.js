// Service Worker for TradeOff PWA
// Provides offline support, caching strategy, and background sync

const CACHE_VERSION = 'v1';
const CACHE_NAME = `tradeoff-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/favicon.ico',
  '/site.webmanifest',
  '/robots.txt',
];

// Cache strategies
const STATIC_ASSETS = /\.(js|css|woff|woff2|ttf|eot)$/;
const API_ROUTES = /^https:\/\/(api|api-tradeoff)/;

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(() => {
      // Silently fail - offline functionality is optional
      console.warn('Failed to cache assets on install');
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip requests with credentials for API
  if (event.request.url.includes('api') && event.request.credentials === 'include') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets: Cache first, fallback to network
  if (STATIC_ASSETS.test(event.request.url)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) return response;
        
        return fetch(event.request).then((response) => {
          if (!response || !response.ok) return response;
          
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(() => {
          return new Response('Offline', { status: 503 });
        });
      })
    );
    return;
  }

  // API requests: Network first, fallback to cache
  if (API_ROUTES.test(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || !response.ok) return response;
          
          // Clone and cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            return response || new Response(
              JSON.stringify({ error: 'Offline' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });
        })
    );
    return;
  }

  // Navigation requests: Network first, fallback to offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/') || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // Default: Network only
  event.respondWith(fetch(event.request));
});

// Background sync for cart and orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  } else if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncCart() {
  try {
    const db = await openIndexedDB();
    const cart = await getFromIndexedDB(db, 'cart');
    if (cart && cart.items.length > 0) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
    }
  } catch (error) {
    console.error('Failed to sync cart:', error);
  }
}

async function syncOrders() {
  try {
    const db = await openIndexedDB();
    const orders = await getFromIndexedDB(db, 'orders');
    if (orders && orders.length > 0) {
      await fetch('/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders),
      });
    }
  } catch (error) {
    console.error('Failed to sync orders:', error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tradeoff', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function getFromIndexedDB(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result[0]);
  });
}
