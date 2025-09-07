'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function OfflineRedirect() {
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {

    const handleOnline = () => {
      setHasRedirected(false)
    }

    const handleOffline = () => {
      // Only redirect if we're not already on the offline page
      if (pathname !== '/offline' && !hasRedirected) {
        setHasRedirected(true)
        router.push('/offline')
      }
    }

    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Also check periodically for network status
    const checkNetworkStatus = () => {
      if (!navigator.onLine && pathname !== '/offline' && !hasRedirected) {
        setHasRedirected(true)
        router.push('/offline')
      }
    }

    // Check every 5 seconds
    const interval = setInterval(checkNetworkStatus, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [router, pathname, hasRedirected])

  // Don't render anything - this is just a utility component
  return null
}
