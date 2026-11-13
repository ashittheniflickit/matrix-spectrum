// Matrix v9.2 + Spectral Flow v1: online changes win; offline works.
const CACHE='matrix-spectrum-flow-v2-20261113';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png','./icon-512.png'];
self.addEventListener('install',e=>{
 e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
 self.skipWaiting();
});
self.addEventListener('activate',e=>{
 e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('matrix-spectrum-')&&k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 e.respondWith((async()=>{
  try{
   const response=await fetch(req,req.mode==='navigate'?{cache:'no-store'}:undefined);
   if(response.ok){const cache=await caches.open(CACHE);cache.put(req,response.clone()).catch(()=>{})}
   return response;
  }catch(err){
   const cached=await caches.match(req);
   if(cached)return cached;
   if(req.mode==='navigate'){const cachedIndex=await caches.match(new URL('./index.html',self.registration.scope).href);if(cachedIndex)return cachedIndex}
   throw err;
  }
 })());
});
