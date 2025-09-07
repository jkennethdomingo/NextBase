'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('SW registered successfully: ', registration)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('SW update found')
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New SW installed, reloading...')
                  window.location.reload()
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.error('SW registration failed: ', registrationError)
        })

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from SW:', event.data)
      })

      // Check if service worker is controlling the page
      if (navigator.serviceWorker.controller) {
        console.log('Service worker is controlling the page')
      } else {
        console.log('Service worker is not controlling the page yet')
      }
    }
  }, [])

  return null
}