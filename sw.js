const CACHE_NAME = 'ginaedy-v30';
const urlsToCache = ['./','./index.html','./manifest.json','./1.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  if(e.request.url.includes('script.google.com')){ e.respondWith(fetch(e.request)); return; }
  if(e.request.url.includes('index.html') || e.request.url.endsWith('/') || e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{
      const clone=r.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, clone));
      return r;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
