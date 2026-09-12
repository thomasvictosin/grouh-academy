'use client'

import Link from 'next/link'
import { Check, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type Course = { id: string; slug: string; title: string; status: string; category?: { name: string } | null; creator?: { name: string | null } | null; instructors: Array<{ instructor: { name: string | null } }>; _count: { enrollments: number }; rating: number | null; createdAt: string }

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/api/courses?manage=1')
        if (!response.ok) throw new Error('Unable to load courses.')
        const data = await response.json() as Course[]
        setCourses(data)
      } catch {
        setMessage('Unable to load courses.')
      }
    }
    void loadCourses()
  }, [])
  const visibleCourses = useMemo(() => courses.filter((course) => (status === 'All' || course.status === status) && `${course.title} ${course.category?.name ?? ''}`.toLowerCase().includes(query.toLowerCase())), [courses, query, status])
  async function review(slug: string, nextStatus: 'PUBLISHED' | 'REJECTED') { const response = await fetch(`/api/courses/${slug}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: nextStatus }) }); if (!response.ok) { setMessage('Unable to update course status.'); return } setCourses((items) => items.map((course) => course.slug === slug ? { ...course, status: nextStatus } : course)); setMessage(nextStatus === 'PUBLISHED' ? 'Course published.' : 'Course rejected.') }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">All Courses</h1><p className="mt-2 text-xs text-slate-500">Manage course content, review submissions, and publish approved courses.</p></div><Link href="/admin/student/courses/new" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]"><Plus className="h-4 w-4" />Add New Course</Link></header>{message && <p className="rounded-lg bg-[#e8f7eb] px-4 py-3 text-xs font-semibold text-[#397d3a]" role="status">{message}</p>}<section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row"><label className="flex flex-1 items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search courses</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="Search courses..." /></label><select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-medium text-[#1C1D52]"><option>All</option><option>DRAFT</option><option>PENDING_REVIEW</option><option>PUBLISHED</option><option>REJECTED</option><option>ARCHIVED</option></select></div><div className="mt-5 overflow-x-auto"><table className="min-w-[760px] w-full border-collapse text-left"><thead className="bg-[#f8fbff] text-[10px] uppercase tracking-[0.08em] text-slate-500"><tr><th className="px-3 py-3">Course</th><th className="px-3 py-3">Instructor</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Students</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Actions</th></tr></thead><tbody className="text-[11px] text-[#1C1D52]">{visibleCourses.map((course) => <tr key={course.id} className="border-t border-slate-100"><td className="px-3 py-3.5 font-semibold"><Link href={`/admin/student/courses/${course.slug}`} className="hover:text-blue-600">{course.title}</Link></td><td className="px-3 py-3.5 text-slate-500">{course.instructors[0]?.instructor.name ?? course.creator?.name ?? 'Grouh Academy'}</td><td className="px-3 py-3.5 text-slate-500">{course.category?.name ?? 'Uncategorized'}</td><td className="px-3 py-3.5 text-slate-500">{course._count.enrollments}</td><td className="px-3 py-3.5"><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold">{course.status}</span></td><td className="px-3 py-3.5 text-right">{course.status === 'PENDING_REVIEW' && <span className="inline-flex gap-2"><button type="button" onClick={() => void review(course.slug, 'PUBLISHED')} className="inline-flex items-center gap-1 rounded-lg bg-[#5FBB46] px-2.5 py-2 text-[10px] font-bold text-[#14204f]"><Check className="h-3 w-3" />Publish</button><button type="button" onClick={() => void review(course.slug, 'REJECTED')} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-2 text-[10px] font-bold text-red-600"><X className="h-3 w-3" />Reject</button></span>}</td></tr>)}</tbody></table></div>{visibleCourses.length === 0 && <p className="py-12 text-center text-sm text-slate-500">No courses match the current filters.</p>}</section></div></AdminShell>
}
