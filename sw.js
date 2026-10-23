/* RoboKomputer — Service Worker (cache aset statis) */
var VERSION = 'rk-v1';
var PRECACHE = VERSION + '-pre';
var RUNTIME = VERSION + '-run';

var PRECACHE_URLS = [
    './',
    './index.html',
    './style.css',
    './favicon.svg',
    './images/favicon-32.png',
    './images/img-1.webp',
    './images/img-2.webp',
    './images/img-3.webp',
    './images/img-4.webp',
    './images/img-5.webp',
    './images/img-6.jpg',
    './images/lynk-id.png',
    './images/goggle-red.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(PRECACHE).then(function (cache) {
            return cache.addAll(PRECACHE_URLS);
        }).then(function () {
            return self.skipWaiting();
        }).catch(function () {})
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key.indexOf(VERSION) !== 0;
            }).map(function (key) {
                return caches.delete(key);
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

function isCacheable(url, request) {
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (request.headers.get('range')) return false;
    if (/\.mp4$/i.test(url.pathname)) return false;
    if (/goatcounter|laobi\.icu|trycloudflare\.com/.test(url.host)) return false;
    if (url.origin === self.location.origin) return true;
    return /cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(url.host);
}

function putInCache(request, response) {
    if (!response) return;
    if (!response.ok && response.type !== 'opaque') return;
    var copy = response.clone();
    caches.open(RUNTIME).then(function (cache) {
        cache.put(request, copy);
    }).catch(function () {});
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;

    var url;
    try { url = new URL(request.url); } catch (err) { return; }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then(function (response) {
                putInCache(request, response);
                return response;
            }).catch(function () {
                return caches.match(request).then(function (cached) {
                    return cached || caches.match('./index.html');
                });
            })
        );
        return;
    }

    if (!isCacheable(url, request)) return;

    event.respondWith(
        caches.match(request).then(function (cached) {
            var network = fetch(request).then(function (response) {
                putInCache(request, response);
                return response;
            }).catch(function () {
                return cached;
            });
            return cached || network;
        })
    );
});
