'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    const handleAppInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    try {
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setVisible(false)
        setDeferredPrompt(null)
      }
    } catch {
      // ignore
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-md border bg-background p-3 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-sm">Install Stem Atlas?</span>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          Install
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-xs underline opacity-70 hover:opacity-100"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}


