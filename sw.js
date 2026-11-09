// Service Worker: App-Shell offline verfügbar machen.
// Same-Origin (HTML, CSS, JS, Icons): Network-first, Cache als Fallback,
// damit Updates sofort ankommen. CDN (Chart.js, feste Version): Cache-first.
// Supabase und alle anderen Anfragen werden nicht berührt (Daten bleiben live).
const CACHE = 'healthcheck-v3';
const CDN_HOST = 'cdnjs.cloudflare.com';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([
      './', './index.html', './css/styles.css',
      './js/supabase.js', './js/app.js', './js/pwa.js',
      './manifest.json', './icons/icon-192.png', './icons/icon-512.png',
      './icons/apple-touch-icon.png'
    ])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  if (url.hostname === CDN_HOST) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
  }
  // Alles andere (z. B. Supabase): direkt ans Netz, kein Caching.
});
