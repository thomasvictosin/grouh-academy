'use client'

import { Camera, CheckCircle2, KeyRound, Save, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import AdminShell from '@/components/AdminShell'

const initialProfile = {
  name: 'Ada Johnson',
  email: 'ada.johnson@grouhacademy.com',
  role: 'Internship Administrator',
  phone: '+234 801 234 5678',
  timezone: 'Africa/Lagos',
  bio: 'Coordinates internship operations, assessments, mentor support, and cohort delivery.',
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile)
  const [saved, setSaved] = useState(false)
  const [passwordState, setPasswordState] = useState({ current: '', next: '', confirm: '' })
  const [passwordSaved, setPasswordSaved] = useState(false)

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1200px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Account</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Admin profile</h1>
            <p className="mt-2 text-xs text-slate-500">Manage your internship admin account, account information, and security settings.</p>
          </div>
          <button type="button" onClick={() => setSaved(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Save profile
          </button>
        </header>

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[28px] bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#edf3ff]">
                  <Image src="/avatar-placeholder.png" alt="Admin avatar" width={80} height={80} className="h-full w-full object-cover" />
                </div>
                <button type="button" className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1C1D52] text-white shadow-lg">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1C1D52]">{profile.name}</h2>
                <p className="mt-1 text-xs text-slate-500">{profile.role}</p>
                <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e8faf7] px-2 py-1 text-[9px] font-semibold text-teal-600"><ShieldCheck className="h-3 w-3" /> Account verified</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Full name" value={profile.name} onChange={(value) => setProfile((current) => ({ ...current, name: value }))} />
              <Field label="Email" value={profile.email} onChange={(value) => setProfile((current) => ({ ...current, email: value }))} />
              <Field label="Phone number" value={profile.phone} onChange={(value) => setProfile((current) => ({ ...current, phone: value }))} />
              <Field label="Timezone" value={profile.timezone} onChange={(value) => setProfile((current) => ({ ...current, timezone: value }))} />
              <label className="block text-[10px] font-semibold text-slate-500">
                Bio
                <textarea rows={4} value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
              </label>
            </div>

            {saved && <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#e8faf7] p-3 text-[10px] font-semibold text-teal-700"><CheckCircle2 className="h-4 w-4" /> Profile updated successfully.</div>}
          </section>

          <section className="rounded-[28px] bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ff] text-[#1C1D52]">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Account security</h2>
                <p className="mt-1 text-[10px] text-slate-500">Update your password to maintain secure access to the internship workspace.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <FieldPassword label="Current password" value={passwordState.current} onChange={(value) => setPasswordState((current) => ({ ...current, current: value }))} />
              <FieldPassword label="New password" value={passwordState.next} onChange={(value) => setPasswordState((current) => ({ ...current, next: value }))} />
              <FieldPassword label="Confirm password" value={passwordState.confirm} onChange={(value) => setPasswordState((current) => ({ ...current, confirm: value }))} />
            </div>

            <button type="button" onClick={() => setPasswordSaved(true)} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              Change password
            </button>

            {passwordSaved && <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#edf3ff] p-3 text-[10px] font-semibold text-[#1C1D52]"><CheckCircle2 className="h-4 w-4" /> Password updated successfully.</div>}
          </section>
        </div>
      </div>
    </AdminShell>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-[10px] font-semibold text-slate-500">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
    </label>
  )
}

function FieldPassword({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-[10px] font-semibold text-slate-500">
      {label}
      <input type="password" value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
    </label>
  )
}
