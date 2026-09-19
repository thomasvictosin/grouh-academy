'use client'

import { CalendarRange, Filter, PencilLine, Plus, RefreshCcw, Save, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type ProgramOption = { id: string; name: string }
type CohortRecord = {
  id: string
  name: string
  slug: string
  description: string | null
  programId: string
  programName: string
  trackName: string
  startDate: string
  endDate: string
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
  startDateLabel: string
  endDateLabel: string
  monthLabel: string
}

type CohortFormState = {
  id: string | null
  name: string
  programId: string
  startDate: string
  endDate: string
  description: string
}

const initialForm: CohortFormState = {
  id: null,
  name: '',
  programId: '',
  startDate: '',
  endDate: '',
  description: '',
}

const statusStyles: Record<CohortRecord['status'], string> = {
  UPCOMING: 'bg-sky-100 text-sky-700',
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  COMPLETED: 'bg-slate-200 text-slate-700',
}

export default function InternshipCohortsPage() {
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [cohorts, setCohorts] = useState<CohortRecord[]>([])
  const [form, setForm] = useState<CohortFormState>(initialForm)
  const [filters, setFilters] = useState({ track: 'all', month: 'all' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadCohorts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/internship/cohorts', { cache: 'no-store' })
      if (!response.ok) throw new Error(`Cohort request failed (${response.status}).`)
      const payload = (await response.json()) as { programs?: ProgramOption[]; cohorts?: CohortRecord[] }
      const nextPrograms = payload.programs ?? []
      const nextCohorts = payload.cohorts ?? []
      setPrograms(nextPrograms)
      setCohorts(nextCohorts)
      setForm((current) => {
        if (current.programId) return current
        return { ...current, programId: nextPrograms[0]?.id ?? '' }
      })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load cohorts.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCohorts()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadCohorts])

  const filteredCohorts = useMemo(() => {
    return cohorts.filter((cohort) => {
      const matchesTrack = filters.track === 'all' || cohort.programName === filters.track || cohort.trackName === filters.track
      const matchesMonth = filters.month === 'all' || cohort.monthLabel === filters.month
      return matchesTrack && matchesMonth
    })
  }, [cohorts, filters])

  const nextCohort = useMemo(
    () => [...cohorts].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).find((cohort) => cohort.status !== 'COMPLETED') ?? null,
    [cohorts],
  )

  const summary = useMemo(() => {
    const active = cohorts.filter((cohort) => cohort.status === 'ACTIVE').length
    const upcoming = cohorts.filter((cohort) => cohort.status === 'UPCOMING').length
    return { active, upcoming, total: cohorts.length }
  }, [cohorts])

  const monthOptions = useMemo(() => {
    return [...new Set(cohorts.map((cohort) => cohort.monthLabel).filter(Boolean))].sort()
  }, [cohorts])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.name.trim() || !form.programId || !form.startDate || !form.endDate) {
      setError('Select a track, name the cohort, and provide both dates.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/internship/cohorts', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Unable to save the cohort.')

      setSuccess(form.id ? 'Cohort updated successfully.' : 'Cohort created successfully.')
      setForm(initialForm)
      setFilters((current) => ({ ...current, track: 'all', month: 'all' }))
      if (programs.length > 0) {
        setForm((current) => ({ ...current, programId: programs[0].id }))
      }
      await loadCohorts()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save the cohort.')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(cohort: CohortRecord) {
    setForm({
      id: cohort.id,
      name: cohort.name,
      programId: cohort.programId,
      startDate: cohort.startDate.slice(0, 10),
      endDate: cohort.endDate.slice(0, 10),
      description: cohort.description ?? '',
    })
    setError(null)
    setSuccess(null)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this cohort? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/admin/internship/cohorts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Unable to delete the cohort.')
      setSuccess('Cohort deleted successfully.')
      if (form.id === id) {
        setForm(initialForm)
      }
      await loadCohorts()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete the cohort.')
    }
  }

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="rounded-[28px] bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_30px_rgba(95,187,70,0.2)] sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#14204f]/70">Internship scheduling</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Cohorts</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white">
              <CalendarRange className="h-4 w-4" />
              Next cohort: {nextCohort ? nextCohort.startDateLabel : 'None scheduled'}
            </div>
          </div>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
        {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</p>}

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Available cohorts" value={String(summary.total)} detail="All scheduled cohorts" />
          <MetricCard label="Active" value={String(summary.active)} detail="Currently running" />
          <MetricCard label="Upcoming" value={String(summary.upcoming)} detail="Opening soon" />
        </section>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Schedule overview</p>
                <h2 className="mt-2 text-lg font-bold text-[#1C1D52]">Available cohort</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select value={filters.track} onChange={(event) => setFilters((current) => ({ ...current, track: event.target.value }))} className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[10px] font-medium text-[#1C1D52] outline-none">
                    <option value="all">All tracks</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.name}>{program.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select value={filters.month} onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))} className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-[10px] font-medium text-[#1C1D52] outline-none">
                    <option value="all">All start months</option>
                    {monthOptions.map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => setFilters({ track: 'all', month: 'all' })} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-medium text-slate-600">
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>

            {loading ? (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Loading cohort schedule…</p>
            ) : filteredCohorts.length === 0 ? (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">No cohorts match the current filters.</p>
            ) : (
              <div className="mt-6 space-y-3">
                {filteredCohorts.map((cohort) => (
                  <div key={cohort.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#1C1D52]">{cohort.name}</h3>
                          <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyles[cohort.status]}`}>{cohort.status}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{cohort.programName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleEdit(cohort)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[9px] font-semibold text-slate-700">
                          <PencilLine className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDelete(cohort.id)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-[9px] font-semibold text-red-600">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-[#f8fbff] p-3">
                        <p className="text-[9px] uppercase tracking-[0.08em] text-slate-500">Start date</p>
                        <p className="mt-2 text-sm font-semibold text-[#1C1D52]">{cohort.startDateLabel}</p>
                      </div>
                      <div className="rounded-xl bg-[#f8fbff] p-3">
                        <p className="text-[9px] uppercase tracking-[0.08em] text-slate-500">End date</p>
                        <p className="mt-2 text-sm font-semibold text-[#1C1D52]">{cohort.endDateLabel}</p>
                      </div>
                    </div>

                    {cohort.description && <p className="mt-3 text-[10px] leading-5 text-slate-600">{cohort.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#5FBB46]" />
              <h2 className="text-lg font-bold text-[#1C1D52]">{form.id ? 'Edit cohort' : 'Create cohort'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="block text-[10px] font-semibold text-slate-500">
                Cohort name
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="Software Development November Cohort" />
              </label>

              <label className="block text-[10px] font-semibold text-slate-500">
                Internship track
                <select value={form.programId} onChange={(event) => setForm((current) => ({ ...current, programId: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
                  <option value="">Select a track</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>{program.name}</option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-semibold text-slate-500">
                  Start date
                  <input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
                </label>

                <label className="block text-[10px] font-semibold text-slate-500">
                  End date
                  <input type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
                </label>
              </div>

              <label className="block text-[10px] font-semibold text-slate-500">
                Description
                <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} rows={4} className="mt-2 block min-h-[110px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="Optional description for this cohort." />
              </label>

              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-4 py-3 text-xs font-semibold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-60">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving…' : form.id ? 'Update cohort' : 'Save cohort'}
                </button>
                {form.id && (
                  <button type="button" onClick={() => setForm(initialForm)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </AdminShell>
  )
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
      <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[#1C1D52]">{value}</p>
      <p className="mt-1 text-[10px] text-slate-500">{detail}</p>
    </div>
  )
}
