'use client'

import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import AdminShell from '@/components/AdminShell'

type Student = { id: string; name: string; email: string; program: string | null; status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DEACTIVATED'; joinedAt: string; lastUpdatedAt: string; enrolledCourses: number; completedCourses: number; certificates: number }
const pageSize = 10
const statusLabel: Record<Student['status'], string> = { ACTIVE: 'Active', SUSPENDED: 'Suspended', PENDING: 'Pending', DEACTIVATED: 'Deactivated' }
const statusStyle: Record<Student['status'], string> = { ACTIVE: 'bg-emerald-50 text-emerald-700', SUSPENDED: 'bg-amber-50 text-amber-700', PENDING: 'bg-blue-50 text-blue-700', DEACTIVATED: 'bg-slate-100 text-slate-600' }

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'ALL' | Student['status']>('ALL')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch('/api/admin/student/students', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to load learners.')
        return response.json() as Promise<{ students: Student[] }>
      })
      .then(({ students: loadedStudents }) => setStudents(loadedStudents))
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load learners.'))
  }, [])

  const filtered = useMemo(() => students.filter((student) => {
    const matchesQuery = `${student.name} ${student.email} ${student.program ?? ''}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (status === 'ALL' || student.status === status)
  }), [query, status, students])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)
  const counts = useMemo(() => ({ ALL: students.length, ACTIVE: students.filter(({ status }) => status === 'ACTIVE').length, PENDING: students.filter(({ status }) => status === 'PENDING').length, SUSPENDED: students.filter(({ status }) => status === 'SUSPENDED').length, DEACTIVATED: students.filter(({ status }) => status === 'DEACTIVATED').length }), [students])

  function changeFilter(next: 'ALL' | Student['status']) { setStatus(next); setPage(1) }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Learners</h1><p className="mt-2 text-xs text-slate-500">Review learner accounts and real enrolment progress.</p></header><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">{(['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED', 'DEACTIVATED'] as const).map((value) => <button key={value} type="button" onClick={() => changeFilter(value)} className={`rounded-full px-3 py-2 text-[10px] font-semibold ${status === value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{value === 'ALL' ? 'All learners' : statusLabel[value]} <span className="ml-1.5 opacity-75">{counts[value]}</span></button>)}</div><div className="py-4"><label className="flex max-w-sm items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search learners</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} className="w-full bg-transparent outline-none" placeholder="Search name, email, or programme" /></label></div>{error && <p className="py-8 text-center text-xs text-red-600">{error}</p>}{!error && students.length === 0 && <p className="py-10 text-center text-xs text-slate-500">No learner accounts yet.</p>}{!error && students.length > 0 && <><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-xs"><thead><tr className="bg-[#f5f8fb] text-slate-600"><th className="px-3 py-3">Learner</th><th className="px-3 py-3">Enrolled</th><th className="px-3 py-3">Completed</th><th className="px-3 py-3">Certificates</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Joined</th><th className="px-3 py-3"></th></tr></thead><tbody>{visible.map((student) => <tr key={student.id} className="border-b border-slate-100"><td className="px-3 py-3.5"><strong className="block text-[#1C1D52]">{student.name}</strong><span className="mt-1 block text-[10px] text-slate-500">{student.email}{student.program ? ` · ${student.program}` : ''}</span></td><td className="px-3 py-3.5">{student.enrolledCourses}</td><td className="px-3 py-3.5">{student.completedCourses}</td><td className="px-3 py-3.5">{student.certificates}</td><td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${statusStyle[student.status]}`}>{statusLabel[student.status]}</span></td><td className="px-3 py-3.5 text-slate-500">{new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(student.joinedAt))}</td><td className="px-3 py-3.5 text-right"><Link href={`/admin/student/students/${student.id}`} className="font-semibold text-blue-600">View</Link></td></tr>)}</tbody></table></div><div className="flex items-center justify-between pt-4 text-[11px] text-slate-500"><span>{filtered.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)} of ${filtered.length}` : 'No matching learners'}</span><div className="flex gap-1"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="rounded-lg p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div></div></>}</section></div></AdminShell>
}
