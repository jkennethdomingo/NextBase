// Industry-standard, minimal and robust SW for Next.js app-router
const PRECACHE_VERSION = 'v1'
const RUNTIME_VERSION = 'v1'
const PRECACHE_NAME = `next-base-precache-${PRECACHE_VERSION}`
const RUNTIME_NAME = `next-base-runtime-${RUNTIME_VERSION}`
const OFFLINE_URL = '/offline'

// Core assets that should always be available offline
const PRECACHE_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/favicon.ico',
]

// Install: precache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(PRECACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch((error) => console.warn('Precache failed:', error))
  )
})

// Activate: clean old caches and take control
self.addEventListener('activate', (event) => {
  const allowed = new Set([PRECACHE_NAME, RUNTIME_NAME])
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(
          names.map((name) => (allowed.has(name) ? undefined : caches.delete(name)))
        )
      )
      .then(() => self.clients.claim())
  )
})

// Runtime strategies
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)

  // Only handle same-origin GET requests
  if (request.method !== 'GET' || url.origin !== self.location.origin) return

  // Skip Next.js API routes and server actions
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_next/static/chunks/pages/api/') ||
      request.headers.get('Next-Action')) {
    return
  }

  // Network-first for navigations to avoid serving stale HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request)
          // Only cache successful responses
          if (networkResponse.ok) {
            const runtime = await caches.open(RUNTIME_NAME)
            runtime.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          console.log('Navigation network failed, trying cache:', error.message)
          
          // Try cached version first
          const cached = await caches.match(request)
          if (cached) return cached
          
          // Fallback to offline page
          const offline = await caches.match(OFFLINE_URL)
          if (offline) return offline
          
          // Last resort: redirect to home
          return Response.redirect('/', 302)
        }
      })()
    )
    return
  }

  // Stale-while-revalidate for Next static assets (CSS/JS/chunks)
  if (url.pathname.startsWith('/_next/static/') ||
      request.destination === 'script' ||
      request.destination === 'style') {
    event.respondWith(
      (async () => {
        const runtime = await caches.open(RUNTIME_NAME)
        const cached = await runtime.match(request)
        
        // Background update
        const networkPromise = fetch(request)
          .then((network) => {
            if (network && network.ok) {
              runtime.put(request, network.clone())
            }
            return network
          })
          .catch(() => undefined)
        
        // Return cached immediately, or wait for network
        return cached || networkPromise || fetch(request)
      })()
    )
    return
  }

  // Cache-first for fonts, images, and other static assets
  if (request.destination === 'font' || 
      request.destination === 'image' ||
      request.destination === 'manifest') {
    event.respondWith(
      (async () => {
        const runtime = await caches.open(RUNTIME_NAME)
        const cached = await runtime.match(request)
        if (cached) return cached
        
        try {
          const network = await fetch(request)
          if (network && network.ok) {
            runtime.put(request, network.clone())
          }
          return network
        } catch (error) {
          console.log('Static asset fetch failed:', error.message)
          throw error
        }
      })()
    )
    return
  }

  // Default: network-first with cache fallback
  event.respondWith(
    (async () => {
      try {
        const network = await fetch(request)
        if (network && network.ok) {
          const runtime = await caches.open(RUNTIME_NAME)
          runtime.put(request, network.clone())
        }
        return network
      } catch (error) {
        console.log('Default fetch failed, trying cache:', error.message)
        const cached = await caches.match(request)
        if (cached) return cached
        throw new Error(`Network error and no cache for ${url.pathname}`)
      }
    })()
  )
})