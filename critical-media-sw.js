/* History Lab — Critical media runtime cache
   Caches only a small allowlist of high-value remote teaching media after first successful load.
   Works on deployed HTTPS pages; file:// local previews continue without a service worker. */
const CACHE_NAME = 'historylab-critical-media-v1';
const CRITICAL_FILENAMES = [
  'Sumer_satellite_map.jpg',
  'Aegean-Sea.map.png',
  'Extent_of_the_Roman_Republic_and_the_Roman_Empire_between_218_BC_and_117_AD.png',
  'Roman%20Empire%20%28117%20AD%29.png',
  'Roman_Empire_%28117_AD%29.png',
  'RomansAndGermansDetailedMap.jpg',
  'Biblica_Open_Bible_Map_18_The_Roman_Empire_and_the_Early_Church.png',
  'Invasions_of_the_Roman_Empire_1.png',
  'Migration_of_Early_Slavs.png',
  'Rome_Baths_of_Caracalla_2020_P05.jpg'
];

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('historylab-critical-media-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isCriticalMedia(request){
  if(request.destination !== 'image') return false;
  const url = request.url;
  return CRITICAL_FILENAMES.some(name => url.includes(name));
}

self.addEventListener('fetch', event => {
  if(!isCriticalMedia(event.request)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, {ignoreSearch:true});
    if(cached) return cached;
    try{
      const response = await fetch(event.request);
      if(response && (response.ok || response.type === 'opaque')){
        await cache.put(event.request, response.clone());
      }
      return response;
    }catch(err){
      const fallback = await cache.match(event.request, {ignoreSearch:true});
      if(fallback) return fallback;
      throw err;
    }
  })());
});
