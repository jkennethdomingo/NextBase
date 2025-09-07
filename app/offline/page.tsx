'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { WifiOff, Wifi, Home, RotateCcw, CheckCircle } from 'lucide-react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-lg mx-auto text-center px-6">
        {/* Status Icon */}
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-500 ${
            isOnline 
              ? 'bg-emerald-100 dark:bg-emerald-950/30' 
              : 'bg-slate-100 dark:bg-slate-800'
          }`}>
            {isOnline ? (
              <Wifi className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <WifiOff className="w-16 h-16 text-slate-500 dark:text-slate-400" />
            )}
          </div>

          {/* Title */}
          <h1 className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
            isOnline 
              ? 'text-emerald-900 dark:text-emerald-100' 
              : 'text-foreground'
          }`}>
            {isOnline ? 'Back Online!' : 'No Connection'}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {isOnline 
              ? 'Your internet connection has been restored. Redirecting you back to the app...' 
              : 'Please check your internet connection and try again. Some features may be limited while offline.'
            }
          </p>
          
          {/* Online Status Badge */}
          {isOnline && (
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-200 font-medium">
                Connection restored
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Homepage
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retry Connection
          </button>
        </div>

        {/* App Info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">NextBase PWA</p>
            <p>Powered by Next.js & Supabase</p>
          </div>
        </div>
      </div>
    </div>
  )
}