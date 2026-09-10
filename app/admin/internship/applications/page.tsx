'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const applications = [
  { id: 'APP-1201', name: 'Chinedu Adebayo', track: 'Product Design', status: 'Pending', source: 'Website', date: '2026-09-08' },
  { id: 'APP-1202', name: 'Ada Nwosu', track: 'Software Development', status: 'Reviewed', source: 'Referral', date: '2026-09-07' },
  { id: 'APP-1203', name: 'Tobi Akin', track: 'Data Analytics', status: 'Pending', source: 'LinkedIn', date: '2026-09-06' },
  { id: 'APP-1204', name: 'Joy Eze', track: 'Product Design', status: 'Accepted', source: 'Website', date: '2026-09-05' },
]

const statusStyles = {
  Pending: 'bg-[#fff0d8] text-orange-600',
  Reviewed: 'bg-[#e8faf7] text-teal-600',
  Accepted: 'bg-[#dff1ff] text-blue-600',
}

export default function InternshipApplicationsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const visibleApplications = useMemo(() => applications.filter((item) => {
    const matchesStatus = status === 'All' || item.status === status
    const searchValue = `${item.id} ${item.name} ${item.track}`.toLowerCase()
    return matchesStatus && searchValue.includes(query.toLowerCase())
  }), [query, status])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Applications</h1>
            <p className="mt-2 text-xs text-slate-500">Review new submissions, accepted learners, and pending decisions.</p>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search applicant name" />
            </label>
            <div className="flex flex-wrap gap-2">
              <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', 'Pending', 'Reviewed', 'Accepted']} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-[10px]">
              <thead>
                <tr className="bg-[#f5f8fb] text-slate-600">
                  <th className="px-3 py-3 font-semibold">Applicant</th>
                  <th className="px-3 py-3 font-semibold">Track</th>
                  <th className="px-3 py-3 font-semibold">Source</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.slice((page - 1) * 8, page * 8).map((application) => (
                  <tr key={application.id} className="border-b border-slate-100 text-[#1C1D52]">
                    <td className="px-3 py-3.5">
                      <div>
                        <p className="font-bold">{application.name}</p>
                        <p className="mt-1 text-[9px] text-slate-500">{application.id}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-slate-500">{application.track}</td>
                    <td className="px-3 py-3.5 text-slate-500">{application.source}</td>
                    <td className="px-3 py-3.5 text-slate-500">{application.date}</td>
                    <td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[application.status as keyof typeof statusStyles]}`}>{application.status}</span></td>
                    <td className="relative px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/internship/applications/${application.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">View</Link>
                        <button type="button" aria-label={`More actions for ${application.id}`} onClick={() => setOpenMenuId(openMenuId === application.id ? null : application.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100">
                          <MoreHorizontal className="inline h-3.5 w-3.5" />
                        </button>
                      </div>
                      {openMenuId === application.id && (
                        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                          <Link href={`/admin/internship/applications/${application.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View application</Link>
                          <Link href={`/admin/internship/applications/${application.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/review`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Review</Link>
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
