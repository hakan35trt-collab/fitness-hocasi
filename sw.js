// Sürüm yükseltirken bu değeri VE version.json dosyasını değiştir.
const VERSION = '2.0.1';
const CACHE = 'fitness-hocasi-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=' + VERSION,
  './js/app.js?v=' + VERSION,
  './manifest.webmanifest',
  './version.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.ico',
  './favicon-32.png',
  './program-gorsel.jpg',
  './beslenme-gorsel.jpg',
  './img/bg-db.webp',
  './img/body.webp',
  './img/bottle.webp',
  './img/ex-0-0.webp',
  './img/ex-0-1.webp',
  './img/ex-0-2.webp',
  './img/ex-0-3.webp',
  './img/ex-0-4.webp',
  './img/ex-0-5.webp',
  './img/ex-0-6.webp',
  './img/ex-0-7.webp',
  './img/ex-1-0.webp',
  './img/ex-1-1.webp',
  './img/ex-1-2.webp',
  './img/ex-1-3.webp',
  './img/ex-1-4.webp',
  './img/ex-1-5.webp',
  './img/ex-1-6.webp',
  './img/ex-1-7.webp',
  './img/ex-2-0.webp',
  './img/ex-2-1.webp',
  './img/ex-2-2.webp',
  './img/ex-2-3.webp',
  './img/ex-2-4.webp',
  './img/ex-2-5.webp',
  './img/ex-2-6.webp',
  './img/ex-2-7.webp',
  './img/f1.webp',
  './img/f2.webp',
  './img/f3.webp',
  './img/f4.webp',
  './img/f5.webp',
  './img/food-top.webp',
  './img/hdr-logo.webp',
  './img/hdr-man.webp',
  './img/hero-db.webp',
  './img/hero-man.webp',
  './img/logo.webp',
  './img/m1.webp',
  './img/m2.webp',
  './img/m3.webp',
  './img/m4.webp',
  './img/prog-man.webp',
  './img/prog-top.webp',
  './img/splash.webp'
];

// Otomatik güncelleme: yeni sürüm kurulur kurulmaz devreye girer.
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'})))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('fitness-hocasi-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data.type === 'GET_VERSION' && e.ports[0]) e.ports[0].postMessage(VERSION);
});

function isNetworkFirst(url) {
  const p = url.pathname;
  return p.endsWith('/') || p.endsWith('/index.html') || p.endsWith('/version.json');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate' || isNetworkFirst(url)) {
    e.respondWith(fetch(req, {cache: 'no-store'}).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return res;
  })));
});
