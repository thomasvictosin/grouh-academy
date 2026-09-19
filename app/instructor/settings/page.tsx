'use client'

import Image from 'next/image'
import { Bell, Check, ImagePlus, Lock, Moon, Save, Settings2, Sun, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { InstructorPage } from '@/components/InstructorPage'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Notifications = { emailNotifications: boolean; courseUpdates: boolean; assignmentReminders: boolean; gradeNotifications: boolean }
type Settings = { profileVisible: boolean; notifications: Notifications; theme: 'LIGHT' | 'DARK'; language: string; timezone: string }
type Profile = { name: string; email: string; phone: string; avatarUrl: string }

const initialSettings: Settings = { profileVisible: true, notifications: { emailNotifications: true, courseUpdates: true, assignmentReminders: false, gradeNotifications: true }, theme: 'LIGHT', language: 'English (US)', timezone: 'GMT+1 (West Africa Time)' }
const initialProfile: Profile = { name: '', email: '', phone: '', avatarUrl: '' }

export default function InstructorSettingsPage() {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const photoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void Promise.all([fetch('/api/instructor/settings', { cache: 'no-store' }), fetch('/api/instructor/profile', { cache: 'no-store' })])
      .then(async ([settingsResponse, profileResponse]) => {
        if (!settingsResponse.ok || !profileResponse.ok) throw new Error('Settings unavailable')
        const [settingsData, profileData] = await Promise.all([settingsResponse.json(), profileResponse.json()])
        setSettings({ ...initialSettings, ...settingsData, notifications: { ...initialSettings.notifications, ...(settingsData.notifications ?? {}) } })
        setProfile({ ...initialProfile, ...profileData })
      })
      .catch(() => setMessage('Your settings could not be loaded right now.'))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (key: keyof Notifications) => setSettings((current) => ({ ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } }))

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true); setMessage('')
    try {
      const formData = new FormData(); formData.append('file', file)
      const response = await fetch('/api/instructor/settings/avatar', { method: 'POST', body: formData })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Unable to upload photo.')
      setProfile((current) => ({ ...current, avatarUrl: body.avatarUrl }))
      setMessage('Profile photo updated.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to upload photo.') } finally { setUploading(false); event.target.value = '' }
  }

  async function saveSettings() {
    setSaving(true); setMessage('')
    try {
      const [settingsResponse, profileResponse] = await Promise.all([
        fetch('/api/instructor/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }),
        fetch('/api/instructor/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) }),
      ])
      const [settingsBody, profileBody] = await Promise.all([settingsResponse.json(), profileResponse.json()])
      if (!settingsResponse.ok || !profileResponse.ok) throw new Error(settingsBody.error ?? profileBody.error ?? 'Unable to save settings.')
      setMessage('Settings saved successfully.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save settings.') } finally { setSaving(false) }
  }

  async function updatePassword() {
    if (newPassword.length < 8) { setPasswordMessage('Use at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setPasswordMessage('Passwords do not match.'); return }
    const { error } = await createSupabaseBrowserClient().auth.updateUser({ password: newPassword })
    if (error) { setPasswordMessage(error.message); return }
    setNewPassword(''); setConfirmPassword(''); setPasswordMessage('Password updated successfully.')
  }

  const initials = (profile.name || 'Instructor').split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
  if (loading) return <InstructorPage title="Settings" description="Manage your instructor account and teaching preferences."><div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-sm">Loading settings...</div></InstructorPage>

  return <InstructorPage title="Settings" description="Manage your instructor account and teaching preferences."><div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><SettingsHeading icon={<UserRound className="h-5 w-5" />} title="Profile & photo" description="Update the identity learners see on your courses." /><div className="mt-6 flex items-center gap-4"><div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#dceeff] text-xl font-bold text-[#1C1D52]">{profile.avatarUrl ? <Image src={profile.avatarUrl} alt="Instructor profile" width={80} height={80} unoptimized className="h-full w-full object-cover" /> : initials}</div><input ref={photoInput} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadAvatar} className="hidden" /><div><button type="button" onClick={() => photoInput.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg bg-[#e8f7eb] px-3 py-2 text-[10px] font-bold text-[#397d3a] disabled:opacity-60"><ImagePlus className="h-3.5 w-3.5" />{uploading ? 'Uploading...' : 'Change photo'}</button><p className="mt-2 text-[10px] text-slate-500">PNG, JPG, or WebP. Platform upload limit applies.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Display name" value={profile.name} onChange={(value) => setProfile({ ...profile, name: value })} /><Field label="Phone number" value={profile.phone} onChange={(value) => setProfile({ ...profile, phone: value })} /><Field label="Email address" value={profile.email} disabled onChange={() => undefined} /></div></section>
    <div className="space-y-5"><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><SettingsHeading icon={<Bell className="h-5 w-5" />} title="Teaching notifications" description="Choose the updates that need your attention." /><div className="mt-5 space-y-3"><Toggle label="Email notifications" description="Account and teaching updates by email." enabled={settings.notifications.emailNotifications} onToggle={() => toggle('emailNotifications')} /><Toggle label="Course updates" description="Course publication and catalog activity." enabled={settings.notifications.courseUpdates} onToggle={() => toggle('courseUpdates')} /><Toggle label="Assignment reminders" description="Submission and grading reminders." enabled={settings.notifications.assignmentReminders} onToggle={() => toggle('assignmentReminders')} /><Toggle label="Grade notifications" description="Alerts when learners need assessment feedback." enabled={settings.notifications.gradeNotifications} onToggle={() => toggle('gradeNotifications')} /></div></section><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><SettingsHeading icon={<Lock className="h-5 w-5" />} title="Security" description="Keep access to your instructor workspace protected." /><div className="mt-5 grid gap-3"><Field label="New password" value={newPassword} onChange={setNewPassword} type="password" /><Field label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} type="password" /></div><button type="button" onClick={updatePassword} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#1C1D52]"><Lock className="h-4 w-4" />Update password</button>{passwordMessage && <p className="mt-3 text-[10px] font-semibold text-slate-600" role="status">{passwordMessage}</p>}</section></div>
  </div><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><SettingsHeading icon={<Settings2 className="h-5 w-5" />} title="Workspace preferences" description="Set only the defaults that affect your daily teaching workflow." /><div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="block text-xs font-bold text-[#1C1D52]">Timezone<select value={settings.timezone} onChange={(event) => setSettings({ ...settings, timezone: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option>GMT+1 (West Africa Time)</option><option>GMT</option><option>UTC</option></select></label><label className="block text-xs font-bold text-[#1C1D52]">Language<select value={settings.language} onChange={(event) => setSettings({ ...settings, language: event.target.value })} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option>English (US)</option><option>English (UK)</option><option>French</option></select></label><div><p className="text-xs font-bold text-[#1C1D52]">Theme</p><div className="mt-2 grid grid-cols-2 rounded-lg bg-slate-100 p-1"><button type="button" onClick={() => setSettings({ ...settings, theme: 'LIGHT' })} className={`rounded-md py-2 text-[10px] font-bold ${settings.theme === 'LIGHT' ? 'bg-white text-[#397d3a] shadow-sm' : 'text-slate-500'}`}><Sun className="mr-1 inline h-3.5 w-3.5" />Light</button><button type="button" onClick={() => setSettings({ ...settings, theme: 'DARK' })} className={`rounded-md py-2 text-[10px] font-bold ${settings.theme === 'DARK' ? 'bg-[#1C1D52] text-white' : 'text-slate-500'}`}><Moon className="mr-1 inline h-3.5 w-3.5" />Dark</button></div></div></div><div className="mt-5 border-t border-slate-100 pt-5"><Toggle label="Show profile to learners" description="Allow learners to see your instructor profile on published courses." enabled={settings.profileVisible} onToggle={() => setSettings({ ...settings, profileVisible: !settings.profileVisible })} /></div></section><div className="flex flex-wrap items-center gap-3"><button type="button" onClick={saveSettings} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f] disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save changes'}</button>{message && <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600" role="status"><Check className="h-3.5 w-3.5 text-[#5FBB46]" />{message}</span>}</div></InstructorPage>
}

function Field({ label, value, onChange, disabled = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean; type?: 'text' | 'password' }) { return <label className="block text-xs font-bold text-[#1C1D52]">{label}<input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal disabled:bg-slate-50 disabled:text-slate-400" /></label> }
function Toggle({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) { return <button type="button" onClick={onToggle} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left"><span><span className="block text-xs font-bold text-[#1C1D52]">{label}</span><span className="mt-1 block text-[10px] text-slate-500">{description}</span></span><span className={`inline-flex h-6 w-11 shrink-0 rounded-full p-1 ${enabled ? 'bg-[#5FBB46]' : 'bg-slate-300'}`}><span className={`h-4 w-4 rounded-full bg-white shadow transition ${enabled ? 'translate-x-5' : ''}`} /></span></button> }
function SettingsHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600">{icon}</span><div><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2><p className="mt-1 text-[10px] text-slate-500">{description}</p></div></div> }
