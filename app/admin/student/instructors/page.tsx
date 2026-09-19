'use client'

import { Award, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type InstructorStatus = 'Active' | 'Pending' | 'Suspended'

type Instructor = {
  id: string
  name: string
  specialty: string
  rating: number
  courses: number
  students: number
  revenue: string
  status: InstructorStatus
  email: string
  phone: string
  location: string
}

const statusStyles: Record<InstructorStatus, string> = {
  Active: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff4c8] text-amber-600',
  Suspended: 'bg-red-50 text-red-500',
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    void fetchInstructors()
  }, [])

  async function fetchInstructors() {
    try {
      const response = await fetch('/api/admin/student/instructors')
      if (!response.ok) {
        throw new Error('Unable to load instructors')
      }

      const payload = (await response.json()) as { instructors?: Instructor[] }
      setInstructors(payload.instructors ?? [])
      setMessage(null)
    } catch {
      setMessage('Unable to load instructors from the database.')
    }
  }

  async function handleDelete(instructor: Instructor) {
    if (!window.confirm(`Remove ${instructor.name} from the instructor directory?`)) {
      return
    }

    try {
      const response = await fetch('/api/admin/student/instructors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: instructor.id }),
      })

      if (!response.ok) {
        throw new Error('Unable to remove instructor')
      }

      setInstructors((current) => current.filter((item) => item.id !== instructor.id))
      setOpenMenu(null)
      setMessage(`${instructor.name} was removed successfully.`)
    } catch {
      setMessage('Unable to remove this instructor.')
    }
  }

  const visibleInstructors = useMemo(
    () =>
      instructors.filter((instructor) =>
        `${instructor.name} ${instructor.specialty}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [instructors, query],
  )

  const pageCount = Math.max(1, Math.ceil(visibleInstructors.length / 6))
  const totalActive = instructors.filter((instructor) => instructor.status === 'Active').length
  const pendingApprovals = instructors.filter((instructor) => instructor.status === 'Pending').length
  const suspended = instructors.filter((instructor) => instructor.status === 'Suspended').length

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Instructors Directory</h1>
            <p className="mt-2 text-xs text-slate-500">Monitor performance, course creation metrics, and active teaching coverage.</p>
          </div>
          <Link href="/admin/student/instructors/new" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Add Instructor
          </Link>
        </header>

        {message && (
          <p className="rounded-lg bg-[#e8f7eb] px-4 py-3 text-xs font-semibold text-[#397d3a]" role="status">
            {message}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <InstructorStat icon={<Users className="h-4 w-4" />} value={String(instructors.length)} label="Total Instructors" change="Live" />
          <InstructorStat icon={<Users className="h-4 w-4" />} value={String(totalActive)} label="Active Instructors" change="Live" />
          <InstructorStat icon={<Award className="h-4 w-4" />} value={String(pendingApprovals)} label="Pending Approvals" change="Live" negative />
          <InstructorStat icon={<Users className="h-4 w-4" />} value={String(suspended)} label="Suspended" change="Live" />
        </div>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#1C1D52]">All Educators</h2>
            <label className="flex w-full max-w-[220px] items-center gap-2 rounded-full bg-[#f3f6fb] px-3 py-2 text-[10px] text-slate-400">
              <span className="h-2 w-2 rounded-full bg-slate-500" />
              <span className="sr-only">Search educators</span>
              <Search className="h-3 w-3" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search educator..."
              />
            </label>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleInstructors.slice((page - 1) * 6, page * 6).map((instructor) => (
              <article key={instructor.id} className="rounded-2xl border border-slate-100 p-4 shadow-[0_6px_18px_rgba(28,29,82,0.04)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dceeff] text-sm font-bold text-blue-600">
                      {instructor.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1C1D52]">{instructor.name}</h3>
                      <p className="mt-1 text-[10px] text-slate-500">{instructor.specialty}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenu(openMenu === instructor.id ? null : instructor.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f6fb] text-slate-500"
                      aria-label={`Toggle actions for ${instructor.name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenu === instructor.id && (
                      <div className="absolute right-0 top-10 z-10 w-40 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                        <Link href={`/admin/student/instructors/${instructor.id}`} onClick={() => setOpenMenu(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">
                          View profile
                        </Link>
                        <Link href="/admin/student/courses" onClick={() => setOpenMenu(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">
                          View courses
                        </Link>
                        <Link href={`/admin/student/instructors/${instructor.id}/edit`} onClick={() => setOpenMenu(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">
                          Edit profile
                        </Link>
                        <button type="button" onClick={() => handleDelete(instructor)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-red-600 hover:bg-red-50">
                          Remove instructor
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-[10px] font-semibold text-[#1C1D52]">{instructor.rating.toFixed(1)}</span>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${statusStyles[instructor.status]}`}>
                    {instructor.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-[#f7f9fc] p-2">
                    <p className="text-[9px] uppercase text-slate-400">Courses</p>
                    <p className="mt-1 text-sm font-bold text-[#1C1D52]">{instructor.courses}</p>
                  </div>
                  <div className="rounded-xl bg-[#f7f9fc] p-2">
                    <p className="text-[9px] uppercase text-slate-400">Students</p>
                    <p className="mt-1 text-sm font-bold text-[#1C1D52]">{instructor.students}</p>
                  </div>
                  <div className="rounded-xl bg-[#f7f9fc] p-2">
                    <p className="text-[9px] uppercase text-slate-400">Revenue</p>
                    <p className="mt-1 text-xs font-bold text-[#1C1D52]">{instructor.revenue}</p>
                  </div>
                </div>
              </article>
            ))}

            {visibleInstructors.length === 0 && (
              <p className="py-12 text-center text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                No instructors match the current search.
              </p>
            )}
          </div>

          {visibleInstructors.length > 6 && (
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] font-medium text-slate-500">
              <span>
                Showing {visibleInstructors.length ? (page - 1) * 6 + 1 : 0}-{Math.min(page * 6, visibleInstructors.length)} of {visibleInstructors.length} instructors
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#1C1D52] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-3 w-3" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  disabled={page >= pageCount}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#1C1D52] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

function InstructorStat({ icon, value, label, change, negative = false }: { icon: React.ReactNode; value: string; label: string; change: string; negative?: boolean }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
      <div className="flex items-start justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span>
        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${negative ? 'bg-red-50 text-red-500' : 'bg-[#e8faf7] text-teal-500'}`}>
          {negative ? '▼' : '▲'} {change}
        </span>
      </div>
      <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
      <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
    </div>
  )
}
