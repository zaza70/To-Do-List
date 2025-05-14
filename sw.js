// Service Worker for To-Do List App
const CACHE_NAME = 'todo-app-v2';
const STATIC_CACHE_NAME = 'todo-app-static-v2';
const DYNAMIC_CACHE_NAME = 'todo-app-dynamic-v2';
const TASKS_CACHE_NAME = 'todo-app-tasks-v2';

// Assets to cache immediately during installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/dashboard.html',
  '/dashboard.css',
  '/dashboard.js',
  '/backup.html',
  '/backup.js',
  '/settings.html',
  '/settings.css',
  '/settings.js',
  '/welcome.js',
  '/keyboard.js',
  '/drag-drop.js',
  '/tooltips.css',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, TASKS_CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated and controlling clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - improved caching strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Handle tasks data specially
  if (url.pathname.includes('tasks') ||
      event.request.url.endsWith('tasks.json') ||
      event.request.headers.get('Accept').includes('application/json')) {
    return event.respondWith(handleTasksRequest(event));
  }

  // For page navigations, use network-first strategy
  if (event.request.mode === 'navigate') {
    return event.respondWith(handleNavigationRequest(event));
  }

  // For static assets, use cache-first strategy
  return event.respondWith(handleStaticAssetRequest(event));
});

// Handle tasks data requests with a special strategy
async function handleTasksRequest(event) {
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(event.request);

    // Clone the response to store in cache
    const responseToCache = networkResponse.clone();

    // Store in tasks cache
    const cache = await caches.open(TASKS_CACHE_NAME);
    await cache.put(event.request, responseToCache);

    // Return the network response
    return networkResponse;
  } catch (error) {
    console.log('Fetch failed for tasks; falling back to cache', error);

    // If network fails, try to get from cache
    const cachedResponse = await caches.match(event.request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cached data, return empty tasks array
    if (event.request.headers.get('Accept').includes('application/json')) {
      return new Response(JSON.stringify({ tasks: [] }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // If all else fails, show offline page
    return caches.match('/offline.html');
  }
}

// Handle navigation requests with network-first strategy
async function handleNavigationRequest(event) {
  try {
    // Try network first
    const networkResponse = await fetch(event.request);

    // Clone the response to store in cache
    const responseToCache = networkResponse.clone();

    // Store in dynamic cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    await cache.put(event.request, responseToCache);

    return networkResponse;
  } catch (error) {
    console.log('Fetch failed for navigation; falling back to cache', error);

    // If network fails, try to get from cache
    const cachedResponse = await caches.match(event.request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cached page, show offline page
    return caches.match('/offline.html');
  }
}

// Handle static asset requests with cache-first strategy
async function handleStaticAssetRequest(event) {
  // Try cache first
  const cachedResponse = await caches.match(event.request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // If not in cache, try network
  try {
    const networkResponse = await fetch(event.request);

    // Only cache valid responses from our origin
    if (networkResponse &&
        networkResponse.status === 200 &&
        networkResponse.type === 'basic') {

      // Clone the response to store in cache
      const responseToCache = networkResponse.clone();

      // Store in dynamic cache
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      await cache.put(event.request, responseToCache);
    }

    return networkResponse;
  } catch (error) {
    console.log('Fetch failed for static asset', error);

    // For images, return a placeholder
    if (event.request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#999">Image</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    // For other assets, just return an error response
    return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
}

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  } else if (event.tag === 'sync-pending-changes') {
    event.waitUntil(syncPendingChanges());
  }
});

// Function to sync tasks when back online
async function syncTasks() {
  try {
    // In a real app, this would send data to a server
    // For this demo, we'll just log that sync happened
    console.log('Background sync executed for tasks');

    // Get all clients
    const clients = await self.clients.matchAll();

    // Send message to clients
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        message: 'تمت مزامنة المهام بنجاح'
      });
    });

    // Clear the pending changes queue after successful sync
    const tasksCache = await caches.open(TASKS_CACHE_NAME);
    await tasksCache.put('pending-changes', new Response(JSON.stringify([])));

    return true;
  } catch (error) {
    console.error('Error syncing tasks:', error);
    return false;
  }
}

// Function to sync pending changes when back online
async function syncPendingChanges() {
  try {
    console.log('Syncing pending changes');

    // Get pending changes from cache
    const tasksCache = await caches.open(TASKS_CACHE_NAME);
    const pendingChangesResponse = await tasksCache.match('pending-changes');

    if (!pendingChangesResponse) {
      console.log('No pending changes to sync');
      return true;
    }

    const pendingChanges = await pendingChangesResponse.json();

    if (!pendingChanges || pendingChanges.length === 0) {
      console.log('No pending changes to sync');
      return true;
    }

    console.log(`Found ${pendingChanges.length} pending changes to sync`);

    // In a real app, you would send these changes to the server
    // For this demo, we'll just log them
    console.log('Pending changes:', pendingChanges);

    // Get all clients
    const clients = await self.clients.matchAll();

    // Send message to clients
    clients.forEach(client => {
      client.postMessage({
        type: 'PENDING_CHANGES_SYNCED',
        message: `تمت مزامنة ${pendingChanges.length} من التغييرات المعلقة`,
        changes: pendingChanges
      });
    });

    // Clear the pending changes queue after successful sync
    await tasksCache.put('pending-changes', new Response(JSON.stringify([])));

    return true;
  } catch (error) {
    console.error('Error syncing pending changes:', error);
    return false;
  }
}

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data) {
    if (event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    } else if (event.data.type === 'ADD_PENDING_CHANGE') {
      addPendingChange(event.data.change);
    }
  }
});

// Add a change to the pending changes queue
async function addPendingChange(change) {
  try {
    const tasksCache = await caches.open(TASKS_CACHE_NAME);
    const pendingChangesResponse = await tasksCache.match('pending-changes');

    let pendingChanges = [];

    if (pendingChangesResponse) {
      pendingChanges = await pendingChangesResponse.json();
    }

    // Add the new change with timestamp
    pendingChanges.push({
      ...change,
      timestamp: Date.now()
    });

    // Store the updated pending changes
    await tasksCache.put('pending-changes', new Response(JSON.stringify(pendingChanges)));

    console.log('Added pending change:', change);

    // Try to register a sync if supported
    if ('SyncManager' in self) {
      try {
        await self.registration.sync.register('sync-pending-changes');
        console.log('Sync registered for pending changes');
      } catch (error) {
        console.error('Failed to register sync:', error);
      }
    }
  } catch (error) {
    console.error('Error adding pending change:', error);
  }
}
