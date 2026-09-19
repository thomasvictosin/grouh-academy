'use client'

import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type EnrolleeRow = {
  id: string
  name: string
  email: string
  track: string
  onboarding: string
  experienceLevel: string
  availability: string
  motivation: string
  examScore: number | null
  attempts: number
  cohort: string
  status: string
  lastUpdated: string
}

const pageSize = 8

export default function InternshipEnrolleesPage() {
  const [rows, setRows] = useState<EnrolleeRow[]>([])
  const [query, setQuery] = useState('')
  const [track, setTrack] = useState('All')
  const [cohort, setCohort] = useState('All')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/enrollees', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Enrollees data request failed (${response.status}).`)
        const payload = (await response.json()) as { enrolleeRows?: EnrolleeRow[] }
        setRows(payload.enrolleeRows ?? [])
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : 'Enrollees data is unavailable.')
      })
  }, [])

  const filteredRows = useMemo(() => {
    const searchQuery = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesTrack = track === 'All' || row.track === track
      const matchesCohort = cohort === 'All' || row.cohort === cohort
      const searchable = `${row.name} ${row.email} ${row.track} ${row.cohort} ${row.experienceLevel} ${row.availability}`.toLowerCase()
      return matchesTrack && matchesCohort && (!searchQuery || searchable.includes(searchQuery))
    })
  }, [cohort, query, rows, track])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize)

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Follow-up queue</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Enrollees</h1>
            <p className="mt-2 text-xs text-slate-500">Users who completed onboarding and the entrance exam but have not yet paid the acceptance fee.</p>
          </div>
          <div className="rounded-xl bg-[#eef4ff] px-3 py-2 text-right text-[#14204f]">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1C1D52]/70">Pending payment</p>
            <p className="mt-1 text-lg font-bold">{rows.length}</p>
          </div>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
        {!error && !rows.length && <p className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">Loading enrollee list…</p>}

        {rows.length > 0 && (
          <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
            <div className="flex flex-col gap-3 pb-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex w-full max-w-[330px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
                <Search className="h-3.5 w-3.5" />
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value)
                    setPage(1)
                  }}
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                  placeholder="Search by name, email, track, or cohort"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <FilterSelect label="Track" value={track} onChange={(next) => {
                  setTrack(next)
                  setPage(1)
                }} options={['All', ...new Set(rows.map((row) => row.track))]} />
                <FilterSelect label="Cohort" value={cohort} onChange={(next) => {
                  setCohort(next)
                  setPage(1)
                }} options={['All', ...new Set(rows.map((row) => row.cohort))]} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border-collapse text-left text-[10px]">
                <thead>
                  <tr className="bg-[#f5f8fb] text-slate-600">
                    <th className="px-3 py-3 font-semibold">Name</th>
                    <th className="px-3 py-3 font-semibold">Email</th>
                    <th className="px-3 py-3 font-semibold">Track</th>
                    <th className="px-3 py-3 font-semibold">Cohort</th>
                    <th className="px-3 py-3 font-semibold">Onboarding</th>
                    <th className="px-3 py-3 font-semibold">Exam score</th>
                    <th className="px-3 py-3 font-semibold">Attempts</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 align-top text-[#1C1D52]">
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="font-bold">{row.name}</p>
                          <p className="mt-1 text-[9px] text-slate-500">{row.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{row.email}</td>
                      <td className="px-3 py-3.5 text-slate-600">{row.track}</td>
                      <td className="px-3 py-3.5 text-slate-600">{row.cohort}</td>
                      <td className="max-w-[260px] px-3 py-3.5 text-slate-600">
                        <div className="space-y-1">
                          <p><span className="font-semibold text-[#1C1D52]">Experience:</span> {row.experienceLevel}</p>
                          <p><span className="font-semibold text-[#1C1D52]">Availability:</span> {row.availability}</p>
                          <p className="text-[9px] leading-5 text-slate-500">{row.motivation}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-full px-2 py-1 font-semibold ${row.examScore !== null && row.examScore >= 70 ? 'bg-[#e8faf7] text-teal-600' : 'bg-[#fff0d8] text-amber-600'}`}>
                          {row.examScore !== null ? `${row.examScore}%` : '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{row.attempts}</td>
                      <td className="px-3 py-3.5">
                        <span className="rounded-full bg-[#edf3ff] px-2 py-1 font-semibold text-[#1C1D52]">{row.status === 'PENDING' ? 'Acceptance fee pending' : 'Awaiting payment'}</span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{row.lastUpdated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredRows.length ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, filteredRows.length)} of {filteredRows.length} enrollees
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <button
                    key={number}
                    type="button"
                    onClick={() => setPage(number)}
                    className={`h-8 w-8 rounded-lg text-[10px] ${page === number ? 'bg-[#1C1D52] text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
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
          <option key={option} value={option}>
            {label}: {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />
    </label>
  )
}
