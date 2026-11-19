/* Lotus app service worker: pages and the vault always try the network first, so updates arrive; pictures come from the cache. */
var V='lotus-v1';
/* a slow or stuck host never leaves a white screen: after 5 seconds the saved copy opens */
function net(r,o){return new Promise(function(ok,no){var t=setTimeout(function(){no(new Error('slow'))},5000);fetch(r,o).then(function(x){clearTimeout(t);ok(x)},function(e){clearTimeout(t);no(e)})})}
self.addEventListener('install',function(e){self.skipWaiting();e.waitUntil(caches.open(V).then(function(c){return c.addAll(['./','index.html','manifest.webmanifest','img/cle.jpg','img/cle-tall.jpg','icons/icon-192.png','icons/apple-180.png'])}).catch(function(){}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);if(u.origin!==location.origin)return;
 var img=/\.(png|jpe?g|webp|svg)$/i.test(u.pathname);
 if(img){e.respondWith(caches.match(r).then(function(m){var n=fetch(r).then(function(res){if(res.ok){var c=res.clone();caches.open(V).then(function(x){x.put(r,c)})}return res});if(m){e.waitUntil(n.catch(function(){}));return m}return n}));return}
 e.respondWith((r.mode==='navigate'?net(r):fetch(r,{cache:'no-cache'})).then(function(res){if(res.ok&&!/[?&]c=/.test(u.search)){var c=res.clone();caches.open(V).then(function(x){
   if(/\/vault\/[ab]\.bin$/.test(u.pathname))x.keys().then(function(ks){ks.forEach(function(k){var ku=new URL(k.url);if(ku.pathname===u.pathname&&ku.search!==u.search)x.delete(k)})});
   x.put(r,c)})}return res}).catch(function(){return caches.match(r,{ignoreSearch:/index\.json$/.test(u.pathname)}).then(function(m){return m||caches.match('index.html')})}))});
