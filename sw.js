
const CACHE_NAME = 'bc-weather-v2';
// We use relative paths so it works on GitHub Pages subfolders
const STATIC_ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// Install Event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use {cache: 'reload'} to ensure we don't get a stale version during SW update
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'reload'})));
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event: Network-First for API, Cache-First for Assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For API calls (Weather & Roads), try network first, then fallback to cache
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('open511.gov.bc.ca')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For static assets, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
