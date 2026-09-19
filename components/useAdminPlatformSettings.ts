'use client'

import { useEffect, useState } from 'react'

import type { PlatformSettingsPayload } from '@/lib/platform-settings-payload'

export function useAdminPlatformSettings() {
  const [settings, setSettings] = useState<PlatformSettingsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/student/settings', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to load settings.')
        return response.json() as Promise<PlatformSettingsPayload>
      })
      .then(setSettings)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load settings.'))
  }, [])

  async function save(payload: Record<string, unknown>) {
    setSaving(true)
    setMessage('')
    try {
      const response = await fetch('/api/admin/student/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to save settings.')
      setSettings(await response.json() as PlatformSettingsPayload)
      setMessage('Settings saved.')
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return { settings, error, saving, message, save }
}
