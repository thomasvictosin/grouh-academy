'use client'

import { BookOpen, Info } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const periods = ['7 Days', '30 Days', '3 Months', '6 Months', '12 Months'] as const

type Period = (typeof periods)[number]

type PerformanceCourse = {
  title: string
  instructor: string
  category: string
  publishedAt: string
  periods: Record<Period, number>
}

const categoryColors: Record<string, string> = {
  'Web Development': 'bg-blue-500',
  'Data Science': 'bg-[#5FBB46]',
  Design: 'bg-violet-500',
  Marketing: 'bg-amber-500',
  Programming: 'bg-cyan-500',
  'Mobile Dev': 'bg-pink-500',
}

function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6 ${className}`}><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2>{children}</section>
}

type DashboardPayload = {
  stats: Array<{ value: string; label: string; change: string; tone: 'blue' | 'red' }>
  performanceCourses: PerformanceCourse[]
  revenueStats: Array<{ label: string; value: string; detail: string; tone: string }>
  revenueSources: Array<{ name: string; value: string; share: number; color: string }>
  enrollmentTrendData: Record<Period, Array<{ day: string; count: number }>>
}

export default function StudentAdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardPayload | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    async function loadDashboard() {
      try {
        const response = await fetch('/api/admin/student/dashboard')

        if (!response.ok) {
          setDashboardError(`Dashboard data request failed (${response.status}).`)
          return
        }

        const payload = (await response.json()) as DashboardPayload

        if (isActive) {
          setDashboardError(null)
          setDashboardData(payload)
        }
      } catch {
        if (isActive) {
          setDashboardError('Dashboard data is unavailable. Check the development database and server logs.')
        }
      }
    }

    loadDashboard()

    return () => {
      isActive = false
    }
  }, [])

  const stats = dashboardData?.stats ?? []
  const performanceCourses = dashboardData?.performanceCourses ?? []
  const revenueStats = dashboardData?.revenueStats ?? []
  const revenueSources = dashboardData?.revenueSources ?? []
  const enrollmentTrendData = dashboardData?.enrollmentTrendData ?? {
    '7 Days': [],
    '30 Days': [],
    '3 Months': [],
    '6 Months': [],
    '12 Months': [],
  }

  const [selectedPeriod, setSelectedPeriod] = useState<Period>('30 Days')
  const [selectedEnrollmentPeriod, setSelectedEnrollmentPeriod] = useState<Period>('30 Days')
  const [hoveredEnrollmentPoint, setHoveredEnrollmentPoint] = useState<{ day: string; count: number; x: number; y: number } | null>(null)

  const coursesForSelectedPeriod = useMemo(
    () =>
      [...performanceCourses]
        .map((course) => ({
          ...course,
          studentCount: course.periods[selectedPeriod],
        }))
        .sort((a, b) => b.studentCount - a.studentCount),
    [selectedPeriod],
  )

  const topCourses = coursesForSelectedPeriod.slice(0, 10)
  const maxStudents = Math.max(...coursesForSelectedPeriod.map((course) => course.studentCount), 1)

  const enrollmentSeries = useMemo(() => enrollmentTrendData[selectedEnrollmentPeriod], [selectedEnrollmentPeriod])

  const enrollmentStats = useMemo(() => {
    const total = enrollmentSeries.reduce((sum, point) => sum + point.count, 0)
    const average = enrollmentSeries.length > 0 ? Math.round(total / enrollmentSeries.length) : 0
    const peak = enrollmentSeries.reduce((highest, point) => (point.count > highest.count ? point : highest), { day: '—', count: 0 })

    return {
      total,
      average,
      peak,
    }
  }, [enrollmentSeries])

  const categoryLeaderboard = useMemo(() => {
    const totals = new Map<string, number>()

    coursesForSelectedPeriod.forEach((course) => {
      totals.set(course.category, (totals.get(course.category) ?? 0) + course.studentCount)
    })

    return [...totals.entries()].sort((a, b) => b[1] - a[1])
  }, [coursesForSelectedPeriod])

  const keyInsights = useMemo(() => {
    const leadingCourse = coursesForSelectedPeriod[0]
    const laggingCourse = coursesForSelectedPeriod[coursesForSelectedPeriod.length - 1]
    const [leadingCategory, leadingCategoryTotal] = categoryLeaderboard[0] ?? ['N/A', 0]

    const insights = [] as Array<{ title: string; detail: string; accent: string }>

    if (leadingCourse) {
      insights.push({
        title: `${leadingCourse.title} leads the period`,
        detail: `${leadingCourse.studentCount} students enrolled in ${selectedPeriod}.`,
        accent: 'bg-blue-500',
      })
    }

    if (leadingCategoryTotal > 0) {
      insights.push({
        title: `${leadingCategory} is the strongest category`,
        detail: `${leadingCategoryTotal} students are currently represented across this category in ${selectedPeriod}.`,
        accent: 'bg-[#5FBB46]',
      })
    }

    if (laggingCourse) {
      insights.push({
        title: `${laggingCourse.title} needs attention`,
        detail: `${laggingCourse.studentCount} students are enrolled, which is the lowest in the current dataset.`,
        accent: 'bg-violet-500',
      })
    }

    if (insights.length === 0) {
      insights.push({
        title: 'No course data available yet',
        detail: 'Once enrollments are created in the development database, insights will update automatically.',
        accent: 'bg-slate-400',
      })
    }

    return insights
  }, [categoryLeaderboard, coursesForSelectedPeriod, selectedPeriod])

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-7 py-6">
          <h1 className="text-2xl font-semibold text-[#14204f] sm:text-3xl">Learning Dashboard Overview</h1>
          <p className="mt-2 text-xs text-[#14204f]/75">Real-time operations, analytics, performance trends, and action logs.</p>
        </section>

        {dashboardError && (
          <section className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">
            {dashboardError}
          </section>
        )}

        {!dashboardError && dashboardData && stats.length === 0 && (
          <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            No dashboard records are available in the development database yet.
          </section>
        )}

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
          {stats.map(({ value, label, change, tone }) => (
            <div key={label} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <div className="flex items-start justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${tone === 'red' ? 'bg-red-50 text-red-500' : 'bg-[#e8faf7] text-teal-500'}`}>
                  ▲ {change}
                </span>
              </div>
              <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
              <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <Panel title="Course Performance">
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {periods.map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setSelectedPeriod(period)}
                      className={`rounded-full px-3 py-1 text-[8px] font-semibold transition ${selectedPeriod === period ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>

                <div className="group relative">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-56 rounded-xl border border-slate-200 bg-white p-2 text-[10px] leading-5 text-slate-600 shadow-[0_12px_28px_rgba(28,29,82,0.14)] group-hover:block">
                    Top-performing courses are ranked using the current period’s student enrollment and take-up data. The bar colors reflect each course category to make quick comparisons easier.
                  </span>
                </div>
              </div>

              <div className="mt-5 flex h-44 items-end justify-between gap-2 rounded-xl bg-[#f8fbff] px-3 pb-3 pt-6">
                {topCourses.map((course, index) => {
                  const barHeight = Math.max((course.studentCount / maxStudents) * 100, 12)
                  const barColor = categoryColors[course.category] ?? 'bg-slate-500'

                  return (
                    <div key={`${course.title}-${selectedPeriod}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className="flex h-full w-full items-end justify-center">
                        <span
                          title={`${course.title} • ${course.studentCount} students • Instructor: ${course.instructor} • Published: ${course.publishedAt}`}
                          className={`w-3 rounded-t-md ${barColor} transition-all duration-200 hover:brightness-110`}
                          style={{ height: `${barHeight}%` }}
                          aria-label={`${course.title} has ${course.studentCount} students in the ${selectedPeriod} period`}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] font-semibold text-slate-500">#{index + 1}</span>
                        <span className="w-full text-center text-[7px] font-medium text-slate-500">{course.title.length > 16 ? `${course.title.slice(0, 16)}...` : course.title}</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 space-y-2">
                {topCourses.map((course, index) => (
                  <div key={`${course.title}-list-${selectedPeriod}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-[#f8fbff] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[9px] font-bold text-blue-600">{index + 1}</span>
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold text-[#1C1D52]">{course.title}</p>
                        <p className="text-[9px] text-slate-500">{course.instructor}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[8px] font-semibold ${categoryColors[course.category] ?? 'bg-slate-500'} text-white`}>
                        {course.category}
                      </span>
                      <span className="text-right text-[10px] font-bold text-[#1C1D52]">{course.studentCount} students</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Enrollment Overview">
            <div className="mt-4 flex flex-wrap gap-2">
              {periods.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setSelectedEnrollmentPeriod(period)}
                  className={`rounded-full px-3 py-1 text-[8px] font-semibold transition ${selectedEnrollmentPeriod === period ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {period}
                </button>
              ))}
            </div>

            <p className="mt-4 text-[10px] text-slate-500">Trend line of registrations per day</p>
            <div className="relative mt-3 h-32 rounded-lg bg-[#f8fbff] p-2">
              {hoveredEnrollmentPoint && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-[0_8px_20px_rgba(28,29,82,0.12)]"
                  style={{
                    left: `${(hoveredEnrollmentPoint.x / 300) * 100}%`,
                    top: `${(hoveredEnrollmentPoint.y / 120) * 100}%`,
                  }}
                >
                  <p className="text-[9px] font-semibold text-[#1C1D52]">{hoveredEnrollmentPoint.day}</p>
                  <p className="text-[8px] text-slate-500">{hoveredEnrollmentPoint.count} enrollments</p>
                </div>
              )}

              <svg viewBox="0 0 300 120" className="h-full w-full" aria-label="Enrollment overview chart">
                <defs>
                  <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#5FBB46" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#5FBB46" stopOpacity="0.08" />
                  </linearGradient>
                </defs>
                <path d="M0 86 C40 70, 55 60, 80 64 S125 54, 150 48 S200 28, 230 34 S270 18, 300 20 L300 120 L0 120 Z" fill="url(#chartFill)" />
                <path d="M0 86 C40 70, 55 60, 80 64 S125 54, 150 48 S200 28, 230 34 S270 18, 300 20" fill="none" stroke="#5FBB46" strokeWidth="2" strokeLinecap="round" />

                {enrollmentSeries.map((point, index) => {
                  const x = (index / Math.max(enrollmentSeries.length - 1, 1)) * 280 + 10
                  const y = 100 - (point.count / Math.max(Math.max(...enrollmentSeries.map((item) => item.count)), 1)) * 70

                  return (
                    <g key={`${point.day}-${selectedEnrollmentPeriod}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={4}
                        fill="#5FBB46"
                        stroke="#ffffff"
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredEnrollmentPoint({ day: point.day, count: point.count, x, y })}
                        onMouseLeave={() => setHoveredEnrollmentPoint(null)}
                        onFocus={() => setHoveredEnrollmentPoint({ day: point.day, count: point.count, x, y })}
                        onBlur={() => setHoveredEnrollmentPoint(null)}
                        tabIndex={0}
                      />
                      <title>{`${point.day}: ${point.count} enrollments`}</title>
                    </g>
                  )
                })}
              </svg>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
              <div className="rounded-xl bg-[#f8fbff] p-3">
                <p className="text-slate-500">Total</p>
                <strong className="mt-1 block text-[#1C1D52]">{enrollmentStats.total}</strong>
              </div>
              <div className="rounded-xl bg-[#f8fbff] p-3">
                <p className="text-slate-500">Avg/day</p>
                <strong className="mt-1 block text-[#1C1D52]">{enrollmentStats.average}</strong>
              </div>
              <div className="rounded-xl bg-[#f8fbff] p-3">
                <p className="text-slate-500">Peak day</p>
                <strong className="mt-1 block text-[#1C1D52]">{enrollmentStats.peak.day} · {enrollmentStats.peak.count}</strong>
              </div>
            </div>
          </Panel>

          <Panel title="Revenue Overview">
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px]">
                {revenueStats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#f8fbff] p-3">
                    <p className="text-slate-500">{item.label}</p>
                    <strong className={`mt-1 block text-base text-[#1C1D52] ${item.tone}`}>{item.value}</strong>
                    <span className="mt-1 block text-[9px] text-slate-500">{item.detail}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {revenueSources.map((source) => (
                  <div key={source.name}>
                    <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{source.name}</span>
                      <span className="font-semibold text-[#1C1D52]">{source.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`${source.color} h-2 rounded-full`} style={{ width: `${source.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Key Insights">
              <div className="mt-4 space-y-3">
                {keyInsights.map((insight) => (
                  <div key={insight.title} className="flex items-start gap-3 rounded-xl bg-[#f8fbff] p-3">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${insight.accent}`} />
                    <div>
                      <p className="text-[10px] font-semibold text-[#1C1D52]">{insight.title}</p>
                      <p className="mt-1 text-[9px] leading-5 text-slate-500">{insight.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
