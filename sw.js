const V="salonbook-v3",FILES=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 e.respondWith((async()=>{
  const cache=await caches.open(V),cached=await cache.match(e.request);
  if(cached)return cached;
  try{
   const response=await fetch(e.request);
   if(response.ok&&url.origin===self.location.origin)await cache.put(e.request,response.clone());
   return response;
  }catch(error){
   if(e.request.mode==="navigate"){
    const page=await cache.match("index.html");
    if(page)return page;
   }
   throw error;
  }
 })());
});
