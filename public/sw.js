const CACHE_NAME_STATIC = 'deen-zone-static-v1';
const CACHE_NAME_QURAN = 'deen-zone-quran-v1';
const CACHE_NAME_HADITH = 'deen-zone-hadith-v1';

// Core assets to pre-cache on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.jpg'
];

// Domains and endpoints to cache with Cache-First strategy (Quran API & Media)
const QURAN_DOMAINS = [
  'api.alquran.cloud',
  'cdn.jsdelivr.net',
  'cdn.islamic.network',
  'archive.org'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME_STATIC &&
            cacheName !== CACHE_NAME_QURAN &&
            cacheName !== CACHE_NAME_HADITH &&
            cacheName !== 'quran-pages-cache'
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension scheme
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Quran & Islamic API / CDN Requests -> Cache First, fallback to Network
  const isQuranResource = QURAN_DOMAINS.some(domain => url.hostname.includes(domain));
  if (isQuranResource) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached Quran data / page image immediately
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME_QURAN).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If network fails and not in cache, return custom JSON error if API request
          if (url.hostname.includes('api.alquran.cloud')) {
            return new Response(
              JSON.stringify({ code: 503, status: 'OFFLINE', data: null }),
              { headers: { 'Content-Type': 'application/json' } }
            );
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // 2. Navigation / HTML Requests -> Network First, fallback to Cached index.html
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME_STATIC).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 3. Static App Assets (JS, CSS, Images, Fonts) -> Stale While Revalidate / Cache First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME_STATIC).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
