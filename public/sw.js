const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  './index.html',
  './css/main.css',
  './js/main.js',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Satisfy&display=swap',
  './assets/loader.svg',
]


//cache size limit
// const limitCacheSize = (name, size) => {
//   caches.open(name).then(cache => {
//     cache.keys().then(keys => {
//       if(keys.length > size){
//         cache.delete(keys[0]).then(limitCacheSize(name, size));
//       }
//     })
//   })
// }

self.addEventListener('install', e => {
  e.waitUntil( caches.open(staticCacheName).then(cache => {
    cache.addAll(assets);
  }))
});

//activate the service worker
self.addEventListener('activate', e => {
  e.waitUntil( caches.keys().then(keys => {
    return Promise.all(keys.filter(key => key !== staticCacheName).map(key => caches.delete(key)))
  }))
})

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cacheRequest => {
    return cacheRequest || fetch(e.request).then(fetchRes => {
      return caches.open(dynamicCacheName).then(cache => {
        cache.put(e.request.url, fetchRes.clone());
        return fetchRes;
      })
    })
  }))
})
