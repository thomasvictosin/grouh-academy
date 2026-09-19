'use client'

import { CheckCircle2, Save } from 'lucide-react'
import { useState } from 'react'
import AdminShell from '@/components/AdminShell'

type ToggleState = {
  autoAssignMentors: boolean
  requirePaymentVerification: boolean
  sendApplicationAlerts: boolean
  enableAssessmentReminders: boolean
  autoActivateCourses: boolean
  autoStartCohorts: boolean
  notifyOnTaskSubmission: boolean
  notifyOnPaymentUpdate: boolean
  enableTrackBasedRouting: boolean
}

const initialState: ToggleState = {
  autoAssignMentors: true,
  requirePaymentVerification: true,
  sendApplicationAlerts: true,
  enableAssessmentReminders: true,
  autoActivateCourses: true,
  autoStartCohorts: true,
  notifyOnTaskSubmission: true,
  notifyOnPaymentUpdate: true,
  enableTrackBasedRouting: true,
}

export default function InternshipSettingsPage() {
  const [settings, setSettings] = useState<ToggleState>(initialState)
  const [saved, setSaved] = useState(false)

  const toggle = (key: keyof ToggleState) => {
    setSettings((current) => ({ ...current, [key]: !current[key] }))
    setSaved(false)
  }

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1200px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Internship admin controls</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Settings</h1>
            <p className="mt-2 text-xs text-slate-500">Configure the internship system covering schedules, fees, tracks, tasks, notifications, and day-to-day operations.</p>
          </div>
          <button type="button" onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Save settings
          </button>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <SectionTitle title="Internship configuration" description="Core operational behavior for the internship workspace." />
              <SettingCard label="Auto assign mentors" description="Route new interns to available mentors automatically." enabled={settings.autoAssignMentors} onToggle={() => toggle('autoAssignMentors')} />
              <SettingCard label="Require payment verification" description="Block assessment access until the acceptance fee is confirmed." enabled={settings.requirePaymentVerification} onToggle={() => toggle('requirePaymentVerification')} />
              <SettingCard label="Auto-start active cohorts" description="Open a cohort as soon as its configured start date is reached." enabled={settings.autoStartCohorts} onToggle={() => toggle('autoStartCohorts')} />
              <SettingCard label="Send application alerts" description="Notify admins whenever a new application is submitted." enabled={settings.sendApplicationAlerts} onToggle={() => toggle('sendApplicationAlerts')} />
            </div>

            <div className="space-y-4">
              <SectionTitle title="Track and task configuration" description="Controls that shape each internship track and task flow." />
              <SettingCard label="Enable track-based routing" description="Keep mentors, tasks, and programs filtered by track." enabled={settings.enableTrackBasedRouting} onToggle={() => toggle('enableTrackBasedRouting')} />
              <SettingCard label="Assessment reminders" description="Send nudges before assessments and key deadlines." enabled={settings.enableAssessmentReminders} onToggle={() => toggle('enableAssessmentReminders')} />
              <SettingCard label="Task review notifications" description="Alert admins when task submissions are received." enabled={settings.notifyOnTaskSubmission} onToggle={() => toggle('notifyOnTaskSubmission')} />
              <SettingCard label="Payment/fee notifications" description="Surface payment events and milestone status updates." enabled={settings.notifyOnPaymentUpdate} onToggle={() => toggle('notifyOnPaymentUpdate')} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
              <SectionTitle title="Tier and fee configuration" description="Application and payment rules for the internship program." />
              <Field label="Default application fee" value="₦100,000" />
              <Field label="Premium tier 1 amount" value="₦100,000" />
              <Field label="Premium tier 2 amount" value="₦400,000" />
              <Field label="Assessment pass score" value="70%" />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
              <SectionTitle title="Course and scheduling setup" description="Rules for when courses and internship flows become active." />
              <SettingCard label="Auto-activate courses" description="Start courses automatically when their schedule becomes active." enabled={settings.autoActivateCourses} onToggle={() => toggle('autoActivateCourses')} />
              <Field label="Default cohort length" value="6 weeks" />
              <Field label="Default course start day" value="Monday" />
              <Field label="Default program timezone" value="Africa/Lagos" />
            </div>
          </div>

          {saved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8faf7] p-3 text-[10px] font-semibold text-teal-700">
              <CheckCircle2 className="h-4 w-4" />
              Internship settings saved successfully.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-[#1C1D52]">{title}</p>
      <p className="mt-1 text-[10px] text-slate-500">{description}</p>
    </div>
  )
}

function SettingCard({ label, description, enabled, onToggle }: { label: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#1C1D52]">{label}</p>
          <p className="mt-1 text-[10px] text-slate-500">{description}</p>
        </div>
        <button type="button" aria-pressed={enabled} onClick={onToggle} className={`relative h-6 w-11 rounded-full transition ${enabled ? 'bg-[#5FBB46]' : 'bg-slate-300'}`}>
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${enabled ? 'right-1' : 'left-1'}`} />
        </button>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-[10px] font-semibold text-slate-500">
      {label}
      <input value={value} readOnly className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
    </label>
  )
}
