'use client'

import { useEffect, useState } from 'react'
import { Bell, LockKeyhole, Save, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const panelClass = 'rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6'
const inputClass = 'mt-1.5 h-10 w-full rounded-lg bg-[#F3F6FB] px-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#5FBB46]' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
}

type Notifications = {
  mentorshipMessages: boolean
  assignmentReminders: boolean
  gradeNotifications: boolean
  meetingReminders: boolean
}

type SettingsData = {
  profileVisible: boolean
  notifications: Notifications
  theme: 'LIGHT' | 'DARK'
  language: string
  timezone: string
}

type ProfileFields = { name: string; email: string; bio: string }

const notificationRows: [keyof Notifications, string][] = [
  ['mentorshipMessages', 'Mentor and group messages'],
  ['assignmentReminders', 'Assignment reminders'],
  ['gradeNotifications', 'Grade updates'],
  ['meetingReminders', 'Meeting reminders'],
]

export default function InternshipSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [profileFields, setProfileFields] = useState<ProfileFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/student/settings').then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch('/api/student/profile').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([settingsData, profileData]) => {
        setSettings({
          profileVisible: settingsData.profileVisible,
          notifications: {
            mentorshipMessages: settingsData.notifications.mentorshipMessages,
            assignmentReminders: settingsData.notifications.assignmentReminders,
            gradeNotifications: settingsData.notifications.gradeNotifications,
            meetingReminders: settingsData.notifications.meetingReminders ?? false,
          },
          theme: settingsData.theme,
          language: settingsData.language,
          timezone: settingsData.timezone,
        })
        setProfileFields({ name: profileData.name, email: profileData.email, bio: profileData.bio })
      })
      .catch(() => setLoadError('Unable to load settings.'))
      .finally(() => setLoading(false))
  }, [])

  function toggleNotification(key: keyof Notifications) {
    setSettings((current) => (current ? { ...current, notifications: { ...current.notifications, [key]: !current.notifications[key] } } : current))
  }

  async function saveProfile() {
    if (!settings || !profileFields) return
    setSaving(true)
    setSaveMessage('')
    try {
      const [settingsResponse, profileResponse] = await Promise.all([
        fetch('/api/student/settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileVisible: settings.profileVisible,
            notifications: settings.notifications,
            theme: settings.theme,
            language: settings.language,
            timezone: settings.timezone,
          }),
        }),
        fetch('/api/student/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: profileFields.name, bio: profileFields.bio }),
        }),
      ])
      if (!settingsResponse.ok || !profileResponse.ok) throw new Error()
      setSaveMessage('Profile settings saved')
      window.setTimeout(() => setSaveMessage(''), 2500)
    } catch {
      setSaveMessage('Unable to save changes.')
    } finally {
      setSaving(false)
    }
  }

  async function updatePassword(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.closest('form')
    const newPassword = form?.querySelector<HTMLInputElement>('input[name="new-password"]')?.value ?? ''
    const confirmation = form?.querySelector<HTMLInputElement>('input[name="confirm-password"]')?.value ?? ''
    setPasswordMessage(null)
    if (newPassword.length < 8 || newPassword !== confirmation) {
      setPasswordMessage(newPassword.length < 8 ? 'Use at least 8 characters.' : 'New passwords do not match.')
      return
    }
    const { error } = await createSupabaseBrowserClient().auth.updateUser({ password: newPassword })
    setPasswordMessage(error ? error.message : 'Password updated successfully.')
  }

  if (loading) {
    return <InternshipShell><p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading settings...</p></InternshipShell>
  }
  if (loadError || !settings || !profileFields) {
    return <InternshipShell><div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{loadError ?? 'Unable to load settings.'}</div></InternshipShell>
  }

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Intern Settings</h1><p className="mt-2 text-xs text-[#14204f]/75">Manage your internship profile, notifications, security, and workspace preferences.</p></section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={panelClass}>
            <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Profile Settings</h2></div>
            <div className="mt-5 space-y-3">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Full Name<input className={inputClass} value={profileFields.name} onChange={(e) => setProfileFields({ ...profileFields, name: e.target.value })} /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Email Address<input className={inputClass} type="email" value={profileFields.email} disabled title="Changing your email requires verification and isn't editable here yet." /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">About You<textarea className="mt-1.5 min-h-20 w-full resize-none rounded-lg bg-[#F3F6FB] px-3 py-2 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" value={profileFields.bio} onChange={(e) => setProfileFields({ ...profileFields, bio: e.target.value })} /></label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={saveProfile} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#4aaa3e] disabled:opacity-60"><Save className="h-3.5 w-3.5" />{saving ? 'Saving…' : 'Save Changes'}</button>
                {saveMessage && <span className="text-[10px] font-semibold text-[#397d3a]">{saveMessage}</span>}
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <section className={panelClass}>
              <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#5FBB46]" /><h2 className="text-sm font-bold text-[#1C1D52]">Notification Preferences</h2></div>
              <div className="mt-4 divide-y divide-slate-200 border-t border-slate-200">
                {notificationRows.map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-4 py-3">
                    <div><h3 className="text-[10px] font-semibold text-[#1C1D52]">{label}</h3><p className="mt-1 text-[9px] text-slate-500">Receive updates in your internship workspace.</p></div>
                    <Toggle checked={settings.notifications[key]} onChange={() => toggleNotification(key)} />
                  </div>
                ))}
              </div>
            </section>
            <section className={panelClass}>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Privacy</h2></div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div><h3 className="text-[10px] font-semibold text-[#1C1D52]">Profile visibility</h3><p className="mt-1 text-[9px] text-slate-500">Allow your cohort and mentor to view your progress.</p></div>
                <Toggle checked={settings.profileVisible} onChange={() => setSettings({ ...settings, profileVisible: !settings.profileVisible })} />
              </div>
            </section>
          </div>

          <section className={panelClass}>
            <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#f0a629]" /><h2 className="text-sm font-bold text-[#1C1D52]">Password &amp; Security</h2></div>
            <form className="mt-5 space-y-3">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Current Password<input name="current-password" className={inputClass} type="password" placeholder="Enter current password" /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">New Password<input name="new-password" className={inputClass} type="password" placeholder="Enter a new password" minLength={8} /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Confirm New Password<input name="confirm-password" className={inputClass} type="password" placeholder="Confirm new password" minLength={8} /></label>
              <button type="button" onClick={updatePassword} className="rounded-lg bg-[#1C1D52] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#292b6d]">Update Password</button>
              {passwordMessage && <p className="text-[10px] font-semibold text-[#397d3a]">{passwordMessage}</p>}
            </form>
          </section>

          <section className={panelClass}>
            <div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#5FBB46]" /><h2 className="text-sm font-bold text-[#1C1D52]">Workspace Preferences</h2></div>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-[#1C1D52]">Theme</p>
                <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-[#F3F6FB] p-1">
                  <button type="button" onClick={() => setSettings({ ...settings, theme: 'LIGHT' })} className={`rounded-md py-2 text-[10px] ${settings.theme === 'LIGHT' ? 'bg-white font-semibold text-[#5FBB46] shadow-sm' : 'text-slate-500'}`}>Light</button>
                  <button type="button" onClick={() => setSettings({ ...settings, theme: 'DARK' })} className={`rounded-md py-2 text-[10px] ${settings.theme === 'DARK' ? 'bg-[#1C1D52] font-semibold text-white shadow-sm' : 'text-slate-500'}`}>Dark</button>
                </div>
              </div>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Timezone<select className={inputClass} value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}><option>GMT+1 (West Africa Time)</option><option>GMT</option><option>GMT-5 (Eastern Time)</option></select></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Language<select className={inputClass} value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}><option>English (US)</option><option>French</option><option>Portuguese</option></select></label>
            </div>
          </section>
        </div>
      </div>
    </InternshipShell>
  )
}