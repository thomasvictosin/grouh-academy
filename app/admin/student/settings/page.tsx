"use client"

import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'
import AdminSettings, { SettingsActions, SettingsField, SettingsSelect, SettingsToggle } from '@/components/AdminSettings'
import type { PlatformSettingsPayload } from '@/lib/platform-settings-payload'

const languages = ['English (US)', 'English (UK)', 'French', 'Portuguese']
const timezones = ['Africa/Lagos', 'Africa/Accra', 'Europe/London', 'America/New_York', 'UTC']

export default function StudentLmsSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettingsPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    fetch('/api/admin/student/settings', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to load settings.')
        return response.json() as Promise<PlatformSettingsPayload>
      })
      .then(setSettings)
      .catch((error) => setLoadError(error instanceof Error ? error.message : 'Unable to load settings.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const payload = {
      academyName: formData.get('academyName'),
      supportEmail: formData.get('supportEmail'),
      platformUrl: formData.get('platformUrl'),
      defaultLanguage: formData.get('defaultLanguage'),
      timezone: formData.get('timezone'),
      maxUploadSizeMb: Number(formData.get('maxUploadSizeMb')),
      courseEnrollmentEnabled: formData.has('courseEnrollmentEnabled'),
      allowStudentRegistration: formData.has('allowStudentRegistration'),
      enableCourseReviews: formData.has('enableCourseReviews'),
      autoApproveCourses: formData.has('autoApproveCourses'),
      maintenanceMode: formData.has('maintenanceMode'),
    }

    setSaving(true)
    setSavedMessage('')
    try {
      const response = await fetch('/api/admin/student/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to save settings.')
      const updated = await response.json()
      setSettings(updated)
      setSavedMessage('Settings saved.')
      window.setTimeout(() => setSavedMessage(''), 2500)
    } catch (error) {
      setSavedMessage(error instanceof Error ? error.message : 'Unable to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AdminShell workspace="student"><AdminSettings active="general" title="Learning Platform" description="Set the defaults and learner-facing rules that govern the course experience."><p className="pt-5 text-xs text-slate-400">Loading LMS settings...</p></AdminSettings></AdminShell>
  }

  if (loadError || !settings) {
    return <AdminShell workspace="student"><AdminSettings active="general" title="Learning Platform" description="Set the defaults and learner-facing rules that govern the course experience."><p className="pt-5 text-xs text-red-600">{loadError ?? 'Unable to load settings.'}</p></AdminSettings></AdminShell>
  }

  return (
    <AdminShell workspace="student">
      <AdminSettings active="general" title="Learning Platform" description="Set the defaults and learner-facing rules that govern the course experience.">
        <form className="pt-5" onSubmit={handleSubmit}>
          <h3 className="text-sm font-bold text-[#1C1D52]">Academy details</h3>
          <p className="mt-1 text-[11px] text-slate-500">Used in learner communications and across the public learning experience.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsField label="Academy Name" name="academyName" defaultValue={settings.academyName} />
            <SettingsField label="Learner Support Email" name="supportEmail" type="email" defaultValue={settings.supportEmail} />
            <SettingsField label="Public Platform URL" name="platformUrl" type="url" defaultValue={settings.platformUrl ?? ''} placeholder="https://academy.example.com" />
            <SettingsField label="Maximum Avatar Upload (MB)" name="maxUploadSizeMb" type="number" defaultValue={String(settings.maxUploadSizeMb)} />
            <SettingsSelect label="Default Language" name="defaultLanguage" defaultValue={settings.defaultLanguage} options={languages} />
            <SettingsSelect label="Academy Timezone" name="timezone" defaultValue={settings.timezone} options={timezones} />
          </div>

          <div className="mt-7 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-[#1C1D52]">Learner Access and Course Workflow</h3>
            <div className="mt-3 divide-y divide-slate-100">
              <SettingsToggle label="Allow Learner Registration" name="allowStudentRegistration" defaultChecked={settings.allowStudentRegistration} description="Allow new learners to create an account. Existing learners can still sign in." />
              <SettingsToggle label="Allow Course Enrolments" name="courseEnrollmentEnabled" defaultChecked={settings.courseEnrollmentEnabled} description="Make course enrolment available to learners. Use this for planned enrolment pauses." />
              <SettingsToggle label="Allow Course Reviews" name="enableCourseReviews" defaultChecked={settings.enableCourseReviews} description="Let enrolled learners leave ratings and feedback for completed courses." />
              <SettingsToggle label="Automatically Publish Instructor Courses" name="autoApproveCourses" defaultChecked={settings.autoApproveCourses} description="Publish submitted courses without administrator review. Keep this off while your catalogue is curated." />
            </div>
          </div>

          <div className="mt-7 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-[#1C1D52]">Operational Access</h3>
            <div className="mt-3 divide-y divide-slate-100">
              <SettingsToggle label="Maintenance Mode" name="maintenanceMode" defaultChecked={settings.maintenanceMode} description="Temporarily restrict non-administrator access while planned maintenance is in progress." />
            </div>
          </div>

          <SettingsActions saving={saving} savedMessage={savedMessage} />
        </form>
      </AdminSettings>
    </AdminShell>
  )
}
