'use client'

import Image from 'next/image'
import { Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type ProfileData = {
  name: string
  email: string
  phone: string
  bio: string
  country: string
  state: string
  institution: string
  program: string
  enrollmentDate: string
  studentId: string | null
  skills: string[]
  stats: {
    activeCourses: number
    completedCourses: number
    certificates: number
    totalLearningHours: string
  }
}

type ProfileDraft = Omit<ProfileData, 'stats' | 'studentId' | 'skills'> & { skillsText: string }

function toDraft(profile: ProfileData): ProfileDraft {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    bio: profile.bio,
    country: profile.country,
    state: profile.state,
    institution: profile.institution,
    program: profile.program,
    enrollmentDate: profile.enrollmentDate,
    skillsText: profile.skills.join(', '),
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [draft, setDraft] = useState<ProfileDraft | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/student/profile')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load profile.')
        return response.json() as Promise<ProfileData>
      })
      .then(setProfile)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    setSaving(true)
    setError(null)

    const skills = draft.skillsText.split(',').map((s) => s.trim()).filter(Boolean)

    try {
      const response = await fetch('/api/student/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, skills }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Unable to save profile.')
      }
      setProfile((prev) => (prev ? { ...prev, ...draft, skills } : prev))
      setEditing(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2500)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading profile...</p>
  }

  if (error && !profile) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div>
  }

  if (!profile) return null

  const location = [profile.state, profile.country].filter(Boolean).join(', ')

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1><p className="mt-2 text-xs text-[#14204f]/75">Keep your learner identity and contact details current.</p></section>
      <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:flex-row sm:items-center sm:px-6"><Image src="/avatar-placeholder.png" alt={profile.name} width={80} height={80} className="h-20 w-20 rounded-full object-cover" /><div className="min-w-0 flex-1"><h2 className="text-xl font-bold text-[#1C1D52]">{profile.name}</h2><p className="mt-1 text-xs text-[#5FBB46]">Student</p>{location && <p className="mt-1 text-[10px] text-slate-500">{location}</p>}</div><button type="button" onClick={() => { setDraft(toDraft(profile)); setEditing(true) }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1C1D52] px-4 py-2 text-[10px] font-semibold text-white"><Pencil className="h-3.5 w-3.5" />Edit Profile</button></section>
      {saved && <p className="rounded-lg bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700" role="status">Profile changes saved.</p>}
      {error && profile && <p className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-700" role="alert">{error}</p>}
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Personal Information</h2><dl className="mt-4 space-y-3 text-[10px]"><div><dt className="uppercase text-slate-400">Full Name</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.name}</dd></div><div><dt className="uppercase text-slate-400">Email Address</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.email}</dd></div><div><dt className="uppercase text-slate-400">Phone Number</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.phone || '—'}</dd></div><div><dt className="uppercase text-slate-400">Bio / About</dt><dd className="mt-1 max-w-lg leading-4 text-slate-600">{profile.bio || '—'}</dd></div></dl></section>
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Education Details</h2><dl className="mt-4 space-y-3 text-[10px]"><div><dt className="uppercase text-slate-400">Institution</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.institution || '—'}</dd></div><div><dt className="uppercase text-slate-400">Program / Major</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.program || '—'}</dd></div><div><dt className="uppercase text-slate-400">Enrollment Date</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.enrollmentDate || '—'}</dd></div><div><dt className="uppercase text-slate-400">Student ID</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{profile.studentId}</dd></div></dl></section>
      </div>
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Learning Statistics</h2><div className="mt-3 grid grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4"><div className="py-2 text-center"><strong className="block text-xl text-[#1C1D52]">{profile.stats.activeCourses}</strong><span className="text-[9px] text-slate-500">Active Courses</span></div><div className="py-2 text-center"><strong className="block text-xl text-[#5FBB46]">{profile.stats.completedCourses}</strong><span className="text-[9px] text-slate-500">Completed Courses</span></div><div className="py-2 text-center"><strong className="block text-xl text-blue-500">{profile.stats.certificates}</strong><span className="text-[9px] text-slate-500">Certificates Earned</span></div><div className="py-2 text-center"><strong className="block text-xl text-[#1C1D52]">{profile.stats.totalLearningHours}</strong><span className="text-[9px] text-slate-500">Total Learning Hours</span></div></div></section>
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Skills &amp; Interests</h2><div className="mt-3 flex flex-wrap gap-2">{profile.skills.length > 0 ? profile.skills.map((skill) => <span key={skill} className="rounded-md bg-blue-100 px-3 py-1.5 text-[9px] font-medium text-[#1C1D52]">{skill}</span>) : <p className="text-[10px] text-slate-400">No skills added yet.</p>}</div></section>
      {editing && draft && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1D52]/50 p-4"><form onSubmit={saveProfile} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-[#1C1D52]">Edit profile</h2><button type="button" onClick={() => setEditing(false)} aria-label="Close edit profile"><X className="h-5 w-5 text-slate-500" /></button></div><div className="mt-5 space-y-3"><label className="block text-xs font-semibold text-[#1C1D52]">Full name<input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Phone<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-semibold text-[#1C1D52]">State<input value={draft.state} onChange={(event) => setDraft({ ...draft, state: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Country<input value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label></div><label className="block text-xs font-semibold text-[#1C1D52]">Bio<textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} rows={3} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Institution<input value={draft.institution} onChange={(event) => setDraft({ ...draft, institution: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Program / Major<input value={draft.program} onChange={(event) => setDraft({ ...draft, program: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Enrollment date<input type="date" value={draft.enrollmentDate} onChange={(event) => setDraft({ ...draft, enrollmentDate: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-[#1C1D52]">Skills (comma separated)<input value={draft.skillsText} onChange={(event) => setDraft({ ...draft, skillsText: event.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label></div><button disabled={saving} className="mt-5 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f] disabled:opacity-60">{saving ? 'Saving…' : 'Save profile'}</button></form></div>}
    </div>
  )
}