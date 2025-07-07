const CACHE_NAME = 'block-stacker-v3'; // Bump version to ensure update

const FILES_TO_CACHE = [
  './',
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'constants.ts',
  'components/Board.tsx',
  'components/Cell.tsx',
  'components/InfoPanel.tsx',
  'components/Modal.tsx',
  'components/Controls.tsx',
  'manifest.json',
  'icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Use a robust cache-first strategy.
  // It responds from the cache if the resource is found,
  // otherwise, it fetches from the network.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});