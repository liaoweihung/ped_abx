const CACHE_NAME = 'peds-dose-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon.png',
  './manifest.json'
];

// 安裝時快取檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 攔截請求：如果有快取就用快取（離線模式），沒有才上網抓
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});