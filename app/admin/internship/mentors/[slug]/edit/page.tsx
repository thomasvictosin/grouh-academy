'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type MentorRecord = {
  id: string
  name: string
  email: string
  track: string
  expertise: string
  bio: string
  availability: string
  status: 'Available' | 'Busy' | 'At capacity'
  internCount: number
  avatarUrl: string | null
  location: string
  institution: string
  phone: string
  profileCompletion: number
}

export default function EditMentorPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [mentor, setMentor] = useState<MentorRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', track: '', expertise: '', bio: '', availability: '', institution: '', location: '', phone: '' })

  useEffect(() => {
    fetch('/api/admin/internship/mentors', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Mentor request failed (${response.status}).`)
        const payload = (await response.json()) as { mentors?: MentorRecord[] }
        const match = payload.mentors?.find((value) => value.id === params.slug)
        if (!match) throw new Error('Mentor not found.')
        setMentor(match)
        setForm({
          name: match.name,
          email: match.email,
          track: match.track,
          expertise: match.expertise,
          bio: match.bio,
          availability: match.availability,
          institution: match.institution,
          location: match.location,
          phone: match.phone,
        })
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load this mentor.'))
  }, [params.slug])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!mentor) return
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/internship/mentors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: mentor.id,
          name: form.name,
          email: form.email,
          track: form.track,
          expertise: form.expertise,
          bio: form.bio,
          availability: form.availability,
          institution: form.institution,
          location: form.location,
          phone: form.phone,
        }),
      })
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string }
        throw new Error(payload?.error || 'Unable to save the mentor profile.')
      }
      router.push(`/admin/internship/mentors/${mentor.id}`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save the mentor profile.')
    } finally {
      setSaving(false)
    }
  }

  if (!mentor && !error) return <div className="mx-auto max-w-[1000px] p-6 text-sm text-slate-500">Loading mentor details…</div>

  return (
    <div className="mx-auto max-w-[1000px] space-y-5 p-6">
      <Link href="/admin/internship/mentors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to mentors
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Edit mentor</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">Update mentor details</h1>
          </div>
          <button type="submit" form="mentor-edit-form" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>

        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}

        <form id="mentor-edit-form" onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Full name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Field label="Email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <Field label="Track" value={form.track} onChange={(value) => setForm((current) => ({ ...current, track: value }))} />
          <Field label="Expertise" value={form.expertise} onChange={(value) => setForm((current) => ({ ...current, expertise: value }))} />
          <Field label="Institution" value={form.institution} onChange={(value) => setForm((current) => ({ ...current, institution: value }))} />
          <Field label="Phone number" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          <Field label="Location" value={form.location} onChange={(value) => setForm((current) => ({ ...current, location: value }))} />
          <Field label="Availability" value={form.availability} onChange={(value) => setForm((current) => ({ ...current, availability: value }))} />
          <div className="md:col-span-2">
            <label className="block text-[10px] font-semibold text-slate-500">
              Bio
              <textarea value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} rows={5} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
            </label>
          </div>
        </form>
      </section>
    </div>
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
