'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search, Star } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type CourseStatus = 'Published' | 'Draft' | 'Pending' | 'Rejected' | 'Archived'
type Course = {
  slug: string
  name: string
  instructor: string
  category: string
  students: number
  status: CourseStatus
  rating: number | null
  revenue: string
  created: string
}

const courses: Course[] = [
  { slug: 'web-development', name: 'Web Development', instructor: 'Sarah Johnson', category: 'Web Development', students: 450, status: 'Published', rating: 4.8, revenue: '$134,550', created: '2025-10-12' },
  { slug: 'data-science', name: 'Data Science', instructor: 'David Miller', category: 'Data Science', students: 380, status: 'Published', rating: 4.5, revenue: '$113,620', created: '2025-09-01' },
  { slug: 'ui-ux-design', name: 'UI/UX Design', instructor: 'Jessie Cooper', category: 'Design', students: 310, status: 'Published', rating: 4.9, revenue: '$92,690', created: '2025-08-15' },
  { slug: 'python-programming', name: 'Python Programming', instructor: 'Sarah Johnson', category: 'Programming', students: 290, status: 'Published', rating: 4.2, revenue: '$86,710', created: '2025-11-01' },
  { slug: 'digital-marketing', name: 'Digital Marketing', instructor: 'Alex Rivers', category: 'Marketing', students: 180, status: 'Draft', rating: null, revenue: '$0', created: '2025-12-10' },
  { slug: 'advanced-react-patterns', name: 'Advanced React Patterns', instructor: 'Sarah Johnson', category: 'Web Development', students: 0, status: 'Pending', rating: null, revenue: '$0', created: '2025-12-14' },
  { slug: 'machine-learning', name: 'Machine Learning', instructor: 'David Miller', category: 'Data Science', students: 5, status: 'Rejected', rating: 5.0, revenue: '$1,495', created: '2025-10-05' },
  { slug: 'ios-app-development', name: 'iOS App Development', instructor: 'Jessie Cooper', category: 'Mobile Dev', students: 120, status: 'Published', rating: 4.6, revenue: '$35,880', created: '2025-05-10' },
  { slug: 'backend-systems', name: 'Backend Systems', instructor: 'Alex Rivers', category: 'Programming', students: 95, status: 'Published', rating: 4.7, revenue: '$28,405', created: '2025-06-18' },
]

const tabs: { label: string; value: 'All' | CourseStatus }[] = [
  { label: 'All', value: 'All' },
  { label: 'Published', value: 'Published' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending Review', value: 'Pending' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Archived', value: 'Archived' },
]

const statusStyles: Record<CourseStatus, string> = {
  Published: 'bg-[#e8faf7] text-teal-600',
  Draft: 'bg-slate-100 text-slate-500',
  Pending: 'bg-[#fff4c8] text-amber-600',
  Rejected: 'bg-red-50 text-red-500',
  Archived: 'bg-slate-100 text-slate-500',
}

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState<'All' | CourseStatus>('All')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [openCourseMenu, setOpenCourseMenu] = useState<string | null>(null)

  const categories = ['All', ...new Set(courses.map((course) => course.category))]
  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesTab = activeTab === 'All' || course.status === activeTab
        const matchesCategory = category === 'All' || course.category === category
        const searchValue = `${course.name} ${course.instructor} ${course.category}`.toLowerCase()
        return matchesTab && matchesCategory && searchValue.includes(query.toLowerCase())
      }),
    [activeTab, category, query],
  )

  function changeTab(value: 'All' | CourseStatus) {
    setActiveTab(value)
    setPage(1)
  }

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">All Courses</h1>
            <p className="mt-2 text-xs text-slate-500">Manage course content, catalog states, statistics, and submissions</p>
          </div>
          <Link href="/admin/student/courses/new" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Add New Course
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => changeTab(tab.value)}
                className={`rounded-full px-3 py-2 text-[10px] font-semibold transition ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] hover:bg-slate-50'}`}
              >
                {tab.label}
                {tab.value !== 'Archived' && (
                  <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.value === 'All' ? 156 : tab.value === 'Published' ? 98 : tab.value === 'Draft' ? 35 : tab.value === 'Pending' ? 12 : 3}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex w-full max-w-[260px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <span className="sr-only">Search courses</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search courses..."
              />
            </label>

            <label className="relative flex w-fit items-center">
              <span className="sr-only">Filter by category</span>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  setPage(1)
                }}
                className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-[10px] font-medium text-[#1C1D52] outline-none"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-slate-400" />
            </label>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead className="bg-[#f8fbff] text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Instructor</th>
                    <th className="px-3 py-3">Category</th>
                    <th className="px-3 py-3">Students</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Rating</th>
                    <th className="px-3 py-3">Revenue</th>
                    <th className="px-3 py-3">Created</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-[11px] text-[#1C1D52]">
                  {filteredCourses.map((course) => (
                    <tr key={course.slug} className="border-t border-slate-100 align-middle">
                      <td className="px-3 py-3.5 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dceeff] text-xs font-bold text-blue-600">
                            {course.name.slice(0, 2).toUpperCase()}
                          </span>
                          {course.name}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-500">{course.instructor}</td>
                      <td className="px-3 py-3.5 text-slate-500">{course.category}</td>
                      <td className="px-3 py-3.5 text-slate-500">{course.students}</td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${statusStyles[course.status]}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-500">
                        {course.rating ? (
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-[#f4b740] text-[#f4b740]" />
                            {course.rating.toFixed(1)}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-3 py-3.5 text-slate-500">{course.revenue}</td>
                      <td className="px-3 py-3.5 text-slate-500">{course.created}</td>
                      <td className="relative px-3 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => setOpenCourseMenu(openCourseMenu === course.slug ? null : course.slug)}
                          aria-expanded={openCourseMenu === course.slug}
                          aria-label={`Actions for ${course.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {openCourseMenu === course.slug && (
                          <div className="absolute right-3 top-11 z-10 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.14)]">
                            <Link href={`/admin/student/courses/${course.slug}`} className="block rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View course</Link>
                            <Link href={`/admin/student/courses/${course.slug}/edit`} className="block rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Edit course</Link>
                            <Link href={`/admin/student/courses/${course.slug}/archive`} className="block rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Archive course</Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] text-slate-500">
            <span>Showing {filteredCourses.length} of {courses.length} courses</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-blue-500 px-2 font-semibold text-white">{page}</span>
              <button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
