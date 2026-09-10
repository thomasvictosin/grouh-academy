'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const mentors = [
  { id: 'MTR-101', name: 'Maya Brooks', track: 'Software Development', interns: 7, rating: '4.9', status: 'Available' },
  { id: 'MTR-102', name: 'Grace Sanni', track: 'Product Design', interns: 5, rating: '4.8', status: 'Busy' },
  { id: 'MTR-103', name: 'Ada Smith', track: 'Data Analytics', interns: 9, rating: '4.7', status: 'At capacity' },
]

const statusStyles = {
  Available: 'bg-[#e8faf7] text-teal-600',
  Busy: 'bg-[#fff0d8] text-orange-600',
  'At capacity': 'bg-red-100 text-red-500',
}

export default function InternshipMentorsPage() {
  const [query, setQuery] = useState('')
  const [track, setTrack] = useState('All')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const visibleMentors = useMemo(() => mentors.filter((mentor) => {
    const matchesTrack = track === 'All' || mentor.track === track
    const searchValue = `${mentor.id} ${mentor.name} ${mentor.track}`.toLowerCase()
    return matchesTrack && searchValue.includes(query.toLowerCase())
  }), [query, track])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Mentors</h1>
            <p className="mt-2 text-xs text-slate-500">Manage mentor capacity, assignments, and feedback coverage.</p>
          </div>
          <Link href="/admin/internship/mentors/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Add mentor
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search mentor name" />
            </label>
            <FilterSelect label="Track" value={track} onChange={setTrack} options={['All', 'Software Development', 'Product Design', 'Data Analytics']} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-[10px]">
              <thead>
                <tr className="bg-[#f5f8fb] text-slate-600">
                  <th className="px-3 py-3 font-semibold">Mentor</th>
                  <th className="px-3 py-3 font-semibold">Track</th>
                  <th className="px-3 py-3 font-semibold">Interns</th>
                  <th className="px-3 py-3 font-semibold">Rating</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleMentors.slice((page - 1) * 8, page * 8).map((mentor) => (
                  <tr key={mentor.id} className="border-b border-slate-100 text-[#1C1D52]">
                    <td className="px-3 py-3.5">
                      <div>
                        <p className="font-bold">{mentor.name}</p>
                        <p className="mt-1 text-[9px] text-slate-500">{mentor.id}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-500">{mentor.track}</td>
                    <td className="px-3 py-3.5 text-slate-500">{mentor.interns}</td>
                    <td className="px-3 py-3.5 text-slate-500">{mentor.rating}</td>
                    <td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[mentor.status as keyof typeof statusStyles]}`}>{mentor.status}</span></td>
                    <td className="relative px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/internship/mentors/${mentor.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">View</Link>
                        <button type="button" aria-label={`More actions for ${mentor.id}`} onClick={() => setOpenMenuId(openMenuId === mentor.id ? null : mentor.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100">
                          <MoreHorizontal className="inline h-3.5 w-3.5" />
                        </button>
                      </div>
                      {openMenuId === mentor.id && (
                        <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                          <Link href={`/admin/internship/mentors/${mentor.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View profile</Link>
                          <Link href={`/admin/internship/mentors/${mentor.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/edit`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Edit profile</Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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
