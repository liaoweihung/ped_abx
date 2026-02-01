// 每當您修改 index.html 後，請務必修改這裡的版本號
// 例如：從 'v1' 改成 'v2'，或是用日期 'v20251230'
// 只要這個字串改變，使用者的瀏覽器就會知道「有新版本了」，進而重新下載。
const CACHE_NAME = 'pediatric-calc-v20260201'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icon.png',
  './manifest.json'
  './injectables.html'
  './icon_inj.png',
];

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  // 強制立即接管頁面 (Skip Waiting)
  self.skipWaiting();
});

// 啟用 Service Worker 並清除舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 如果快取名稱跟現在的不一樣，就刪除舊的
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 讓新的 SW 立即控制所有客戶端
  return self.clients.claim();
});

// 攔截請求：優先使用快取，失敗才連網，或者採用「網路優先」策略
// 為了確保醫療資訊準確，建議改用「網路優先 (Network First)」策略
// 或是「Stale-While-Revalidate」策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 就算有快取，我們也在背景去抓新的（下次打開就是新的）
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });
      // 如果有快取就先給快取（速度快），沒有就給網路回應
      return cachedResponse || fetchPromise;
    })
  );
});




