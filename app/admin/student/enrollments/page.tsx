'use client'

import { CalendarDays, CheckCircle2, ChevronDown, Clock3, Download, GraduationCap, Search, TrendingUp, Users, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type EnrollmentStatus = 'Confirmed' | 'Pending' | 'Waitlist' | 'Cancelled'
type Enrollment = {
  student: string
  course: string
  instructor: string
  enrollmentDate: string
  source: 'Direct' | 'Referral' | 'Campaign'
  status: EnrollmentStatus
  progress: number
  amount: string
}

const enrollments: Enrollment[] = [
  { student: 'Emma Thompson', course: 'Web Development', instructor: 'Sarah Johnson', enrollmentDate: '2025-02-15', source: 'Direct', status: 'Confirmed', progress: 82, amount: '$299' },
  { student: 'James Wilson', course: 'Data Science Fundamentals', instructor: 'David Miller', enrollmentDate: '2025-02-14', source: 'Referral', status: 'Pending', progress: 38, amount: '$199' },
  { student: 'Sofia Rodriguez', course: 'UI/UX Design Mastery', instructor: 'Jessie Cooper', enrollmentDate: '2025-02-12', source: 'Campaign', status: 'Confirmed', progress: 76, amount: '$299' },
  { student: 'Liam Chen', course: 'Python Programming', instructor: 'Sarah Johnson', enrollmentDate: '2025-02-10', source: 'Direct', status: 'Waitlist', progress: 22, amount: '$199' },
  { student: 'Olivia Patel', course: 'Digital Marketing', instructor: 'Alex Rivers', enrollmentDate: '2025-02-09', source: 'Referral', status: 'Cancelled', progress: 0, amount: '$99' },
  { student: 'Noah Kim', course: 'Machine Learning', instructor: 'David Miller', enrollmentDate: '2025-02-08', source: 'Campaign', status: 'Confirmed', progress: 91, amount: '$399' },
  { student: 'Ava Martinez', course: 'iOS App Development', instructor: 'Jessie Cooper', enrollmentDate: '2025-02-06', source: 'Direct', status: 'Pending', progress: 45, amount: '$299' },
  { student: 'Ethan Brooks', course: 'Advanced React', instructor: 'Sarah Johnson', enrollmentDate: '2025-02-05', source: 'Referral', status: 'Confirmed', progress: 68, amount: '$199' },
]

const tabs: { label: string; value: 'All' | EnrollmentStatus; count: number }[] = [
  { label: 'All Enrollments', value: 'All', count: enrollments.length },
  { label: 'Confirmed', value: 'Confirmed', count: enrollments.filter((item) => item.status === 'Confirmed').length },
  { label: 'Pending', value: 'Pending', count: enrollments.filter((item) => item.status === 'Pending').length },
  { label: 'Waitlist', value: 'Waitlist', count: enrollments.filter((item) => item.status === 'Waitlist').length },
  { label: 'Cancelled', value: 'Cancelled', count: enrollments.filter((item) => item.status === 'Cancelled').length },
]

const statusStyles: Record<EnrollmentStatus, string> = {
  Confirmed: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Waitlist: 'bg-violet-100 text-violet-600',
  Cancelled: 'bg-red-100 text-red-500',
}

const progressStyles: Record<EnrollmentStatus, string> = {
  Confirmed: 'bg-[#5FBB46]',
  Pending: 'bg-blue-500',
  Waitlist: 'bg-violet-500',
  Cancelled: 'bg-slate-400',
}

const courseOptions = ['All Courses', 'Web Development', 'Data Science Fundamentals', 'UI/UX Design Mastery', 'Python Programming', 'Digital Marketing', 'Machine Learning', 'iOS App Development', 'Advanced React']
const sourceOptions = ['All Sources', 'Direct', 'Referral', 'Campaign']
const dateOptions = ['This Month', 'This Quarter', 'This Year']

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex w-fit items-center">
      <span className="sr-only">Filter by {label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none"
      >
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

function StatCard({ icon, value, label, change, negative = false }: { icon: React.ReactNode; value: string; label: string; change: string; negative?: boolean }) {
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

export default function AdminEnrollmentsPage() {
  const [activeTab, setActiveTab] = useState<'All' | EnrollmentStatus>('All')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All Courses')
  const [source, setSource] = useState('All Sources')
  const [date, setDate] = useState('This Month')
  const [page, setPage] = useState(1)

  const visibleEnrollments = useMemo(
    () =>
      enrollments.filter((enrollment) => {
        const matchesTab = activeTab === 'All' || enrollment.status === activeTab
        const searchValue = `${enrollment.student} ${enrollment.course} ${enrollment.instructor}`.toLowerCase()
        const matchesQuery = searchValue.includes(query.toLowerCase())
        const matchesCourse = course === 'All Courses' || enrollment.course === course
        const matchesSource = source === 'All Sources' || enrollment.source === source
        const matchesDate = date === 'This Month' || date === 'This Quarter' || date === 'This Year'

        return matchesTab && matchesQuery && matchesCourse && matchesSource && matchesDate
      }),
    [activeTab, course, date, query, source],
  )

  const stats = [
    { icon: <Users className="h-4 w-4" />, value: '1,247', label: 'New enrollments', change: '12.4%' },
    { icon: <GraduationCap className="h-4 w-4" />, value: '892', label: 'Active learners', change: '8.2%' },
    { icon: <TrendingUp className="h-4 w-4" />, value: '76%', label: 'Course completion', change: '5.1%' },
    { icon: <CalendarDays className="h-4 w-4" />, value: '186', label: 'Pending approvals', change: '3.4%', negative: true },
  ]

  const handleExportCsv = () => {
    const rows = [
      ['Student', 'Course', 'Instructor', 'Enrollment Date', 'Source', 'Status', 'Progress', 'Amount'],
      ...enrollments.map((enrollment) => [
        enrollment.student,
        enrollment.course,
        enrollment.instructor,
        enrollment.enrollmentDate,
        enrollment.source,
        enrollment.status,
        `${enrollment.progress}%`,
        enrollment.amount,
      ]),
    ]

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'student-enrollments.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Enrollments</h1>
            <p className="mt-2 text-xs text-slate-500">Track student registrations, admissions flow, and onboarding progress across the student admin workspace.</p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </header>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              change={stat.change}
              negative={stat.negative}
            />
          ))}
        </div>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value)
                  setPage(1)
                }}
                className={`rounded-full px-3 py-2 text-[10px] font-semibold transition ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] hover:bg-slate-50'}`}
              >
                {tab.label}
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <span className="sr-only">Search enrollments</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setPage(1)
                }}
                className="w-full bg-transparent outline-none placeholder:text-slate-400"
                placeholder="Search student or course..."
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <FilterSelect label="Course" value={course} onChange={setCourse} options={courseOptions} />
              <FilterSelect label="Source" value={source} onChange={setSource} options={sourceOptions} />
              <FilterSelect label="Date" value={date} onChange={setDate} options={dateOptions} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                  <th className="px-3 py-2 font-semibold">Student</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold">Instructor</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Source</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Progress</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {visibleEnrollments.map((enrollment) => (
                  <tr key={`${enrollment.student}-${enrollment.course}`} className="rounded-2xl bg-[#f8fbff] text-[10px] text-slate-600 shadow-[inset_0_0_0_1px_#edf2f7]">
                    <td className="rounded-l-2xl px-3 py-3 font-semibold text-[#1C1D52]">{enrollment.student}</td>
                    <td className="px-3 py-3">{enrollment.course}</td>
                    <td className="px-3 py-3">{enrollment.instructor}</td>
                    <td className="px-3 py-3">{enrollment.enrollmentDate}</td>
                    <td className="px-3 py-3">{enrollment.source}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 font-semibold ${statusStyles[enrollment.status]}`}>
                        {enrollment.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${progressStyles[enrollment.status]}`}
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-[#1C1D52]">{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="rounded-r-2xl px-3 py-3 font-semibold text-[#1C1D52]">{enrollment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing <span className="font-semibold text-[#1C1D52]">{visibleEnrollments.length}</span> of <span className="font-semibold text-[#1C1D52]">{enrollments.length}</span> enrollments
            </p>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setPage((current) => Math.max(current - 1, 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-[#1C1D52] hover:bg-slate-50">
                Prev
              </button>
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 font-semibold text-[#1C1D52]">Page {page}</span>
              <button type="button" onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-[#1C1D52] hover:bg-slate-50">
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
