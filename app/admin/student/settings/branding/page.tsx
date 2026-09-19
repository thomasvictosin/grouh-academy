'use client'

import AdminShell from '@/components/AdminShell'
import AdminSettings, { SettingsActions, SettingsField } from '@/components/AdminSettings'
import { useAdminPlatformSettings } from '@/components/useAdminPlatformSettings'

export default function BrandingSettingsPage() {
  const { settings, error, saving, message, save } = useAdminPlatformSettings()
  return <AdminShell workspace="student"><AdminSettings active="branding" title="Academy identity" description="Control the learner-facing academy name and support contact.">{error && <p className="pt-5 text-xs text-red-600">{error}</p>}{!settings && !error && <p className="pt-5 text-xs text-slate-500">Loading settings...</p>}{settings && <form className="pt-5" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void save({ academyName: data.get('academyName'), supportEmail: data.get('supportEmail'), platformUrl: data.get('platformUrl') }) }}><div className="grid gap-4 sm:grid-cols-2"><SettingsField label="Academy name" name="academyName" defaultValue={settings.academyName} /><SettingsField label="Support email" name="supportEmail" type="email" defaultValue={settings.supportEmail} /><SettingsField label="Public platform URL" name="platformUrl" type="url" defaultValue={settings.platformUrl ?? ''} placeholder="https://academy.example.com" /></div><p className="mt-5 text-[11px] text-slate-500">Visual colours, typography, and logo placement are managed in the application design system, not stored as inactive settings.</p><SettingsActions saving={saving} savedMessage={message} /></form>}</AdminSettings></AdminShell>
}
