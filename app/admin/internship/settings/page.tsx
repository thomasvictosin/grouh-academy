'use client'

import { CheckCircle2, Save } from 'lucide-react'
import { useState } from 'react'
import AdminShell from '@/components/AdminShell'

export default function InternshipSettingsPage() {
  const [saved, setSaved] = useState(false)

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1200px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Settings</h1>
            <p className="mt-2 text-xs text-slate-500">Configure internship admin preferences, checks, and notification workflows.</p>
          </div>
          <button type="button" onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Save settings
          </button>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <SettingCard label="Auto assign mentors" description="Automatically route new interns to available mentors." />
            <SettingCard label="Require payment verification" description="Block assessment access until fee verification completes." />
            <SettingCard label="Send application alerts" description="Alert coordinators when new applications arrive." />
            <SettingCard label="Enable assessment reminders" description="Send reminders when internship assessments are nearing the due date." />
          </div>

          {saved && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8faf7] p-3 text-[10px] font-semibold text-teal-700">
              <CheckCircle2 className="h-4 w-4" />
              Settings saved successfully.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

function SettingCard({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#1C1D52]">{label}</p>
          <p className="mt-1 text-[10px] text-slate-500">{description}</p>
        </div>
        <button type="button" className="relative h-6 w-11 rounded-full bg-[#5FBB46]">
          <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
        </button>
      </div>
    </div>
  )
}
