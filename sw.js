importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js')

const { precaching, routing, strategies } = workbox;

const {registerRoute} = workbox.routing;
const {CacheFirst, NetworkFirst} = workbox.strategies;
const {CacheableResponse, CacheableResponsePlugin} = workbox.cacheableResponse;

self.skipWaiting(); // 跳过等待，立即激活 SW
// self.clients.claim(); // 控制所有同源客户端，确保使用新缓存策略，不要用？

// 离线优先，安装后立即生效
self.addEventListener('install', (event) => {
  const urls = [{
    url: "data.js",
    revision: null
  }, {
    url: "utils.js",
    revision: null
  }, {
    url: "lang.js",
    revision: null
  }, {
    url: "script.js",
    revision: null
  }, {
    url: "tailwind.css",
    revision: null
  }, {
    url: "main.css",
    revision: null
  }, {
    url: "registerSW.js",
    revision: null
  }, {
    url: "index.html",
    revision: null
  }, {
    url: "manifest.webmanifest",
    revision: null
  }];

  const precacheManifest = urls.map((url) => {
    return {
      url: url.url,
      revision: url.revision || null
    };
  });

  precaching.precacheAndRoute(precacheManifest);
});

// 清理缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.filter((cacheName) => {
        return cacheName.startsWith('workbox-');
      }).map((cacheName) => {
        return caches.delete(cacheName);
      })
    );
  }));
});

// registerRoute(({request}) => request.destination === 'style', new CacheFirst());
registerRoute(({request}) => {
  console.log('request.destination', request.destination)
  return /script|document/.test(request.destination)
}, new NetworkFirst({
  networkTimeoutSeconds: 3,
  cacheName: 'static-resources-critical',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200],
    }),
  ],
}));

registerRoute(({request}) => {
  console.log('request.destination', request.destination)
  return /image|style/.test(request.destination)
}, new CacheFirst({
  networkTimeoutSeconds: 3,
  cacheName: 'static-resources',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [200],
    }),
  ],
}));

// // 处理 navigation 请求
// routing.registerRoute(
//   new strategies.NetworkFirst({
//     cacheName: 'navigation-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       })
//     ]
//   }),
//   // new workbox.NavigationRoute(({ event }) => {
//   //   return '/';
//   // })
// );
