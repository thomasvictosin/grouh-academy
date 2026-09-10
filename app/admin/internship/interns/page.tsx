'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const interns = [
  { id: 'INT-1001', name: 'Amaka Okafor', track: 'Software Development', assessment: 'Assessment Alpha', progress: '78%', status: 'On track', mentor: 'Maya Brooks' },
  { id: 'INT-1002', name: 'Daniel Mensah', track: 'Product Design', assessment: 'Assessment Beta', progress: '61%', status: 'Needs attention', mentor: 'Grace Sanni' },
  { id: 'INT-1003', name: 'Ifeoma Nwosu', track: 'Software Development', assessment: 'Assessment Alpha', progress: '92%', status: 'On track', mentor: 'Maya Brooks' },
  { id: 'INT-1004', name: 'Samuel Ojo', track: 'Data Analytics', assessment: 'Assessment Gamma', progress: '54%', status: 'At risk', mentor: 'Ada Smith' },
]

const statusStyles = {
  'On track': 'bg-[#e8faf7] text-teal-600',
  'Needs attention': 'bg-[#fff0d8] text-orange-600',
  'At risk': 'bg-red-100 text-red-500',
}

export default function InternshipInternsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [track, setTrack] = useState('All')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const visibleInterns = useMemo(() => interns.filter((intern) => {
    const matchesStatus = status === 'All' || intern.status === status
    const matchesTrack = track === 'All' || intern.track === track
    const searchValue = `${intern.id} ${intern.name} ${intern.track} ${intern.mentor}`.toLowerCase()
    return matchesStatus && matchesTrack && searchValue.includes(query.toLowerCase())
  }), [query, status, track])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Interns</h1>
            <p className="mt-2 text-xs text-slate-500">Track learner progress, mentor coverage, and assessment outcomes.</p>
          </div>
          <Link href="/admin/internship/interns/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Add new intern
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search intern name or mentor"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', 'On track', 'Needs attention', 'At risk']} />
              <FilterSelect label="Track" value={track} onChange={setTrack} options={['All', 'Software Development', 'Product Design', 'Data Analytics']} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-[10px]">
              <thead>
                <tr className="bg-[#f5f8fb] text-slate-600">
                  <th className="px-3 py-3 font-semibold">Intern</th>
                  <th className="px-3 py-3 font-semibold">Track</th>
                  <th className="px-3 py-3 font-semibold">Assessment</th>
                  <th className="px-3 py-3 font-semibold">Progress</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Mentor</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleInterns.slice((page - 1) * 8, page * 8).map((intern) => (
                  <tr key={intern.id} className="border-b border-slate-100 text-[#1C1D52]">
                    <td className="px-3 py-3.5">
                      <div>
                        <p className="font-bold">{intern.name}</p>
                        <p className="mt-1 text-[9px] text-slate-500">{intern.id}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-500">{intern.track}</td>
                    <td className="px-3 py-3.5 text-slate-500">{intern.assessment}</td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: intern.progress }} />
                        </div>
                        <span className="font-semibold">{intern.progress}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[intern.status as keyof typeof statusStyles]}`}>{intern.status}</span></td>
                    <td className="px-3 py-3.5 text-slate-500">{intern.mentor}</td>
                    <td className="relative px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/internship/interns/${intern.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">View</Link>
                        <button type="button" aria-label={`More actions for ${intern.id}`} onClick={() => setOpenMenuId(openMenuId === intern.id ? null : intern.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100">
                          <MoreHorizontal className="inline h-3.5 w-3.5" />
                        </button>
                      </div>
                      {openMenuId === intern.id && (
                        <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                          <Link href={`/admin/internship/interns/${intern.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View profile</Link>
                          <Link href={`/admin/internship/interns/${intern.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/edit`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Edit details</Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {visibleInterns.length ? (page - 1) * 8 + 1 : 0}-{Math.min(page * 8, visibleInterns.length)} of {visibleInterns.length} interns</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40">
                <ChevronLeft className="h-3 w-3" />
                Previous
              </button>
              {[1, 2, 3].map((number) => (
                <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 rounded-lg text-[10px] ${page === number ? 'bg-blue-500 text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}>
                  {number}
                </button>
              ))}
              <button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8]">
                Next
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
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
