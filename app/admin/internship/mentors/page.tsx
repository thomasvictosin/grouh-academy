'use client'

import { ChevronDown, MapPin, MoreHorizontal, Plus, Search, Star, UserRound } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

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

const statusStyles = {
  Available: 'bg-[#e8faf7] text-teal-600',
  Busy: 'bg-[#fff0d8] text-orange-600',
  'At capacity': 'bg-red-100 text-red-500',
}

export default function InternshipMentorsPage() {
  const [mentors, setMentors] = useState<MentorRecord[]>([])
  const [query, setQuery] = useState('')
  const [track, setTrack] = useState('All')
  const [error, setError] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/mentors', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Mentor request failed (${response.status}).`)
        const payload = (await response.json()) as { mentors?: MentorRecord[] }
        setMentors(payload.mentors ?? [])
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : 'Mentor data is unavailable.')
      })
  }, [])

  const availableTracks = useMemo(() => ['All', ...new Set(mentors.map((mentor) => mentor.track))], [mentors])

  const visibleMentors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return mentors.filter((mentor) => {
      const matchesTrack = track === 'All' || mentor.track === track
      const searchValue = `${mentor.name} ${mentor.email} ${mentor.track} ${mentor.expertise}`.toLowerCase()
      return matchesTrack && (!normalizedQuery || searchValue.includes(normalizedQuery))
    })
  }, [mentors, query, track])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Internship support</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Mentors</h1>
            <p className="mt-2 text-xs text-slate-500">Profiles, assignments, and availability across the internship tracks.</p>
          </div>
          <Link href="/admin/internship/mentors/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Add mentor
          </Link>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
        {!error && !mentors.length && <p className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">Loading mentor roster…</p>}

        {mentors.length > 0 && (
          <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
            <div className="flex flex-col gap-3 pb-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex w-full max-w-[320px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
                <Search className="h-3.5 w-3.5" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search mentor, track, or expertise" />
              </label>
              <FilterSelect label="Track" value={track} onChange={setTrack} options={availableTracks} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleMentors.map((mentor) => (
                <article key={mentor.id} className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 shadow-[0_10px_24px_rgba(28,29,82,0.04)] transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#edf3ff] text-[#1C1D52] ring-2 ring-white ring-offset-2 ring-offset-slate-50">
                        {mentor.avatarUrl ? <Image src={mentor.avatarUrl} alt={mentor.name} width={48} height={48} unoptimized className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#1C1D52]">{mentor.name}</h2>
                        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-slate-500">{mentor.track}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyles[mentor.status]}`}>{mentor.status}</span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-3 shadow-[inset_0_0_0_1px_#edf0f5]">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Profile strength</span>
                      <span className="font-semibold text-[#1C1D52]">{mentor.profileCompletion}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${mentor.profileCompletion}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-[11px] text-slate-600">
                    <p><span className="font-semibold text-[#1C1D52]">Expertise:</span> {mentor.expertise}</p>
                    <p className="line-clamp-3">{mentor.bio}</p>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{mentor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Star className="h-3.5 w-3.5" />
                      <span>{mentor.internCount} active intern{mentor.internCount === 1 ? '' : 's'}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
                    <div className="text-[10px] text-slate-500">
                      <p>{mentor.institution}</p>
                      <p className="mt-1">{mentor.availability}</p>
                    </div>
                    <div className="relative">
                      <button type="button" aria-label={`More actions for ${mentor.name}`} onClick={() => setOpenMenuId(openMenuId === mentor.id ? null : mentor.id)} className="rounded-lg bg-[#f3f6fb] p-2 text-[#1C1D52] hover:bg-[#e8edf7]">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                      {openMenuId === mentor.id && (
                        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                          <Link href={`/admin/internship/mentors/${mentor.id}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View profile</Link>
                          <Link href={`/admin/internship/mentors/${mentor.id}/edit`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Edit profile</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex w-fit items-center">
      <span className="sr-only">Filter by {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />
    </label>
  )
}
