'use client'

import { useEffect, useRef, useState } from 'react'
import { BriefcaseBusiness, Camera, Check, Edit3, MapPin, Phone, UserRound } from 'lucide-react'
import Image from 'next/image'
import InternshipShell from '@/components/InternshipShell'

type InternshipInfo = {
  program: string
  supervisor: string | null
  startDateLabel: string
  endDateLabel: string
  status: 'ACTIVE' | 'ON_HOLD'
  progressPercent: number
  completedTasks: number
  totalTasks: number
  remainingDaysLabel: string
  certifications: string[]
}

type ProfileData = {
  name: string
  email: string
  avatarUrl: string | null
  phone: string
  location: string
  dateOfBirth: string
  gender: string
  skills: string[]
  internship: InternshipInfo | null
}

type Draft = { name: string; phone: string; location: string; dateOfBirth: string; gender: string }

const MAX_AVATAR_BYTES = 2 * 1024 * 1024 // 2MB - stored inline as a data URL (same pattern as course thumbnails elsewhere in this app), so kept modest to avoid bloating every profile fetch.

export default function InternshipProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/internship/profile')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load profile.')
        return response.json() as Promise<ProfileData>
      })
      .then(setProfile)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  function startEditing() {
    if (!profile) return
    setDraft({ name: profile.name, phone: profile.phone, location: profile.location, dateOfBirth: profile.dateOfBirth, gender: profile.gender })
    setEditing(true)
  }

  async function saveEditing() {
    if (!draft) return
    setSaving(true)
    setError(null)
    try {
      const response = await fetch('/api/internship/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to save profile.')
      }
      setProfile((prev) => (prev ? { ...prev, ...draft } : prev))
      setEditing(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus() {
    if (!profile?.internship) return
    const nextStatus = profile.internship.status === 'ACTIVE' ? 'ON_HOLD' : 'ACTIVE'
    setTogglingStatus(true)
    try {
      const response = await fetch('/api/internship/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!response.ok) throw new Error()
      setProfile((prev) => (prev && prev.internship ? { ...prev, internship: { ...prev.internship, status: nextStatus } } : prev))
    } catch {
      setError('Unable to update status.')
    } finally {
      setTogglingStatus(false)
    }
  }

  function handleAvatarClick() {
    avatarInputRef.current?.click()
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file later

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setError('That image is too large - please choose one under 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = async (loadEvent) => {
      const dataUrl = loadEvent.target?.result
      if (typeof dataUrl !== 'string') return

      setSavingAvatar(true)
      setError(null)

      try {
        const response = await fetch('/api/internship/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: dataUrl }),
        })

        if (!response.ok) {
          const body = await response.json().catch(() => null)
          throw new Error(body?.error ?? 'Unable to update your photo.')
        }

        setProfile((prev) => (prev ? { ...prev, avatarUrl: dataUrl } : prev))
      } catch (avatarError) {
        setError(avatarError instanceof Error ? avatarError.message : 'Unable to update your photo.')
      } finally {
        setSavingAvatar(false)
      }
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return <InternshipShell><p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading profile...</p></InternshipShell>
  }

  if (error && !profile) {
    return <InternshipShell><div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div></InternshipShell>
  }

  if (!profile) return null

  const personalFields: [string, string][] = [
    ['Full Name', profile.name || '—'],
    ['Email Address', profile.email],
    ['Phone Number', profile.phone || '—'],
    ['Date of Birth', profile.dateOfBirth || '—'],
    ['Gender', profile.gender || '—'],
    ['Location', profile.location || '—'],
  ]

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="flex flex-col gap-5 rounded-2xl bg-[#5FBB46] p-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:flex-row sm:items-center sm:px-6 sm:py-6">
          <div className="relative shrink-0">
            <Image src={profile.avatarUrl ?? '/avatar-placeholder.png'} alt={profile.name} width={84} height={84} className="h-20 w-20 rounded-full border-2 border-[#1C1D52] object-cover" />
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={savingAvatar}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#1C1D52] text-white shadow-md disabled:opacity-60"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold sm:text-2xl">{profile.name || 'Your name'}</h1>
            {profile.internship && <p className="mt-1 text-xs">{profile.internship.program} Intern</p>}
            {profile.location && <p className="mt-1 text-[10px] text-[#14204f]/65">{profile.location}</p>}
            {savingAvatar && <p className="mt-1 text-[10px] text-[#14204f]/65">Updating photo...</p>}
          </div>
          <button
            type="button"
            onClick={() => (editing ? saveEditing() : startEditing())}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white disabled:opacity-60"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : editing ? 'Done Editing' : 'Edit Profile'}
          </button>
        </section>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-700" role="alert">{error}</p>}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.95fr)]">
          <div className="space-y-5">
            <ProfileSection title="Personal Information" icon={<UserRound className="h-4 w-4" />}>
              {editing && draft ? (
                <div className="space-y-2">
                  <EditRow label="Full Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
                  <StaticRow label="Email Address" value={profile.email} />
                  <EditRow label="Phone Number" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
                  <EditRow label="Date of Birth" type="date" value={draft.dateOfBirth} onChange={(v) => setDraft({ ...draft, dateOfBirth: v })} />
                  <EditRow label="Gender" value={draft.gender} onChange={(v) => setDraft({ ...draft, gender: v })} />
                  <EditRow label="Location" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
                </div>
              ) : (
                <InfoList fields={personalFields} />
              )}
            </ProfileSection>

            {profile.internship && (
              <ProfileSection title="Internship Details" icon={<BriefcaseBusiness className="h-4 w-4" />}>
                <InfoList
                  fields={[
                    ['Program', profile.internship.program],
                    ['Supervisor', profile.internship.supervisor ?? 'Not yet assigned'],
                    ['Start Date', profile.internship.startDateLabel],
                    ['End Date', profile.internship.endDateLabel],
                  ]}
                />
                <div className="flex items-center justify-between border-b border-slate-200 py-2.5 text-[10px]">
                  <span className="text-slate-500">Status</span>
                  <button
                    type="button"
                    onClick={toggleStatus}
                    disabled={togglingStatus}
                    className={`rounded-md px-3 py-1 font-semibold disabled:opacity-60 ${profile.internship.status === 'ACTIVE' ? 'bg-[#5FBB46] text-[#14204f]' : 'bg-amber-100 text-amber-700'}`}
                  >
                    {profile.internship.status === 'ACTIVE' ? 'Active' : 'On Hold'}
                  </button>
                </div>
              </ProfileSection>
            )}
          </div>

          <div className="space-y-5">
            {profile.internship && (
              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
                <h2 className="text-sm font-bold text-[#1C1D52]">Internship Progress</h2>
                <div className="mt-4 flex justify-center">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: `conic-gradient(#5FBB46 0 ${profile.internship.progressPercent}%, #eaf1ff ${profile.internship.progressPercent}% 100%)` }}>
                    <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white">
                      <strong className="text-2xl text-[#1C1D52]">{profile.internship.progressPercent}%</strong>
                      <span className="text-[9px] text-slate-500">Completed</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 divide-x border-t border-slate-200 pt-3 text-center">
                  <div><span className="block text-[9px] text-slate-500">Remaining</span><strong className="mt-1 block text-xs text-[#1C1D52]">{profile.internship.remainingDaysLabel}</strong></div>
                  <div><span className="block text-[9px] text-slate-500">Tasks Done</span><strong className="mt-1 block text-xs text-[#1C1D52]">{profile.internship.completedTasks} / {profile.internship.totalTasks}</strong></div>
                </div>
              </section>
            )}

            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
              <h2 className="text-sm font-bold text-[#1C1D52]">Skills &amp; Expertise</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.length > 0 ? profile.skills.map((skill) => <span key={skill} className="rounded-md bg-[#eaf1ff] px-3 py-1.5 text-[9px] font-semibold text-[#1C1D52]">{skill}</span>) : <p className="text-[10px] text-slate-400">No skills added yet.</p>}
              </div>
              {profile.internship && (
                <>
                  <h3 className="mt-5 text-xs font-semibold text-slate-500">Certifications Earned</h3>
                  <div className="mt-3 space-y-2">
                    {profile.internship.certifications.length > 0 ? (
                      profile.internship.certifications.map((certification) => (
                        <p key={certification} className="flex items-center gap-2 text-[10px] text-[#1C1D52]"><Check className="h-3.5 w-3.5 text-[#5FBB46]" />{certification}</p>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-400">No certifications earned yet.</p>
                    )}
                  </div>
                </>
              )}
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Contact Details</h2></div>
              <p className="mt-3 flex items-center gap-2 text-[10px] text-slate-500"><Phone className="h-3 w-3" />{profile.phone || 'No phone number on file'}</p>
            </section>
          </div>
        </div>
      </div>
    </InternshipShell>
  )
}

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2><span className="text-blue-500">{icon}</span></div><div className="mt-3">{children}</div></section>
}

function InfoList({ fields }: { fields: [string, string][] }) {
  return <div>{fields.map(([label, value]) => <div key={label} className="flex flex-col gap-1 border-b border-slate-200 py-2.5 text-[10px] sm:flex-row sm:items-center sm:justify-between"><span className="text-slate-500">{label}</span><strong className="text-[#1C1D52]">{value}</strong></div>)}</div>
}

function EditRow({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <div className="flex flex-col gap-1 border-b border-slate-200 py-2.5 text-[10px] sm:flex-row sm:items-center sm:justify-between"><span className="text-slate-500">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="rounded border border-slate-200 px-2 py-1 text-right font-semibold text-[#1C1D52] outline-none focus:border-[#5FBB46]" /></div>
}

function StaticRow({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-col gap-1 border-b border-slate-200 py-2.5 text-[10px] sm:flex-row sm:items-center sm:justify-between"><span className="text-slate-500">{label}</span><strong className="text-[#1C1D52]">{value}</strong></div>
}