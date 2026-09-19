'use client'

import { ArrowLeft, BriefcaseBusiness, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import Image from 'next/image'
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

export default function MentorDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [mentor, setMentor] = useState<MentorRecord | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/internship/mentors', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Mentor request failed (${response.status}).`)
        const payload = (await response.json()) as { mentors?: MentorRecord[] }
        const match = payload.mentors?.find((value) => value.id === params.slug)
        if (!match) {
          throw new Error('Mentor profile not found.')
        }
        setMentor(match)
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load mentor details.'))
      .finally(() => setLoading(false))
  }, [params.slug])

  const handleRemove = async () => {
    if (!mentor) return
    setRemoving(true)
    try {
      const response = await fetch(`/api/admin/internship/mentors?id=${encodeURIComponent(mentor.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Unable to remove this mentor.')
      router.push('/admin/internship/mentors')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to remove this mentor.')
    } finally {
      setRemoving(false)
      setConfirmingRemove(false)
    }
  }

  if (loading) return <div className="mx-auto max-w-[1100px] p-6 text-sm text-slate-500">Loading mentor profile…</div>
  if (error || !mentor) return <div className="mx-auto max-w-[1100px] p-6 text-sm text-red-600">{error ?? 'Mentor not found.'}</div>

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/mentors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to mentors
      </Link>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_28px_rgba(28,29,82,0.08)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-[#f8fbff] to-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#edf3ff] ring-4 ring-white">
                {mentor.avatarUrl ? <Image src={mentor.avatarUrl} alt={mentor.name} width={80} height={80} unoptimized className="h-full w-full object-cover" /> : <UserRound className="h-8 w-8 text-[#1C1D52]" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Mentor profile</p>
                <h1 className="mt-2 text-3xl font-semibold text-[#1C1D52]">{mentor.name}</h1>
                <p className="mt-2 text-sm text-slate-500">{mentor.track}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#e8faf7] px-3 py-1.5 text-[9px] font-semibold text-teal-600">{mentor.status}</span>
              <Link href={`/admin/internship/mentors/${params.slug}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">
                <Save className="h-3.5 w-3.5" />
                Edit profile
              </Link>
              <button type="button" onClick={() => setConfirmingRemove(true)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-semibold text-red-700">
                <Trash2 className="h-3.5 w-3.5" />
                Remove mentor
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-[24px] bg-[#f8fbff] p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Bio</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">{mentor.bio}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <InfoTile label="Expertise" value={mentor.expertise} icon={BriefcaseBusiness} />
              <InfoTile label="Availability" value={mentor.availability} icon={ShieldCheck} />
              <InfoTile label="Interns" value={`${mentor.internCount}`} icon={UserRound} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Profile summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <PillRow label="Email" value={mentor.email} />
                <PillRow label="Phone" value={mentor.phone} />
                <PillRow label="Track" value={mentor.track} />
                <PillRow label="Institution" value={mentor.institution} />
                <PillRow label="Location" value={mentor.location} />
                <PillRow label="Profile strength" value={`${mentor.profileCompletion}%`} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {confirmingRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-[0_18px_40px_rgba(28,29,82,0.16)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-600">Confirmation</p>
            <h2 className="mt-3 text-xl font-semibold text-[#1C1D52]">Are you sure you want to remove this mentor?</h2>
            <p className="mt-3 text-sm text-slate-500">This action will deactivate the mentor from the internship system.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmingRemove(false)} className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-semibold text-[#1C1D52]">Cancel</button>
              <button type="button" disabled={removing} onClick={handleRemove} className="rounded-lg bg-red-600 px-3 py-2 text-[10px] font-semibold text-white disabled:opacity-60">
                {removing ? 'Removing…' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoTile({ label, value, icon: Icon }: { label: string; value: string; icon: typeof BriefcaseBusiness }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3ff] text-[#1C1D52]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[9px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1C1D52]">{value}</p>
    </div>
  )
}

function PillRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-[#1C1D52]">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </p>
  )
}
