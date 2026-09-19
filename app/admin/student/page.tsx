'use client'

import { ArrowRight, BookOpen, CircleCheck, ClipboardCheck, CreditCard, GraduationCap, Info, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const periods = ['7 Days', '30 Days', '3 Months', '6 Months', '12 Months'] as const
type Period = (typeof periods)[number]
type Point = { day: string; count: number }
type Dashboard = {
  overview: Array<{ value: string; label: string }>
  performanceCourses: Array<{ id: string; title: string; instructor: string; category: string; periods: Record<Period, number> }>
  enrollmentTrendData: Record<Period, Point[]>
  financials: Array<{ label: string; value: string; detail: string }>
  actions: Array<{ label: string; value: number; href: string; detail: string }>
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2>{children}</section> }
function KpiCard({ item, index }: { item: Dashboard['overview'][number]; index: number }) {
  const icon = index < 2 ? <Users className="h-4 w-4" /> : index === 2 ? <GraduationCap className="h-4 w-4" /> : index === 5 ? <ClipboardCheck className="h-4 w-4" /> : index === 6 ? <Users className="h-4 w-4" /> : index === 7 ? <CircleCheck className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />
  return <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span><strong className="mt-4 block text-xl text-[#1C1D52]">{item.value}</strong><span className="mt-1 block text-[10px] text-slate-500">{item.label}</span></div>
}

export default function StudentAdminDashboard() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('30 Days')
  useEffect(() => { fetch('/api/admin/student/dashboard', { cache: 'no-store' }).then(async (response) => { if (!response.ok) throw new Error(`Dashboard data request failed (${response.status}).`); return response.json() as Promise<Dashboard> }).then(setData).catch((reason) => setError(reason instanceof Error ? reason.message : 'Dashboard data is unavailable.')) }, [])
  const courses = useMemo(() => [...(data?.performanceCourses ?? [])].map((course) => ({ ...course, count: course.periods[period] })).filter((course) => course.count > 0).sort((a, b) => b.count - a.count).slice(0, 5), [data, period])
  const points = data?.enrollmentTrendData[period] ?? []
  const max = Math.max(...points.map(({ count }) => count), 1)
  const total = points.reduce((sum, point) => sum + point.count, 0)
  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5">
    <header className="rounded-2xl bg-[#5FBB46] px-7 py-6"><h1 className="text-2xl font-semibold text-[#14204f] sm:text-3xl">Learning operations</h1><p className="mt-2 text-xs text-[#14204f]/75">A current view of learners, enrollment health, reviews, and payments.</p></header>
    {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
    {!error && !data && <p className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">Loading dashboard…</p>}
    {data && <><div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{data.overview.slice(0, 5).map((item, index) => <KpiCard key={item.label} item={item} index={index} />)}</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">{data.overview.slice(5, 8).map((item, index) => <KpiCard key={item.label} item={item} index={index + 5} />)}</div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]"><div className="space-y-5">
        <Panel title="New enrollments"><PeriodPicker value={period} onChange={setPeriod} /><div className="mt-5 grid h-44 items-end gap-2 rounded-xl bg-[#f8fbff] p-4" style={{ gridTemplateColumns: `repeat(${Math.max(points.length, 1)}, minmax(0, 1fr))` }}>{points.map((point) => <div key={point.day} className="flex h-full min-w-0 flex-col justify-end"><span className="mb-1 text-center text-[9px] font-semibold text-[#1C1D52]">{point.count}</span><div className="rounded-t-md bg-[#5FBB46]" style={{ height: `${Math.max((point.count / max) * 100, point.count ? 8 : 1)}%` }} title={`${point.day}: ${point.count} enrollments`} /><span className="mt-2 truncate text-center text-[8px] text-slate-500">{point.day}</span></div>)}</div><p className="mt-3 text-[10px] text-slate-500">{total} new active or completed enrollments in this period.</p></Panel>
        <Panel title="Top courses by new enrollments"><p className="mt-1 text-[10px] text-slate-500">Ranked from actual active and completed enrollments in the selected period.</p><div className="mt-4 space-y-2">{courses.length ? courses.map((course, index) => <div key={course.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fbff] px-3 py-3"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#1C1D52]">{index + 1}. {course.title}</p><p className="mt-1 truncate text-[10px] text-slate-500">{course.instructor} · {course.category}</p></div><strong className="shrink-0 text-xs text-[#1C1D52]">{course.count}</strong></div>) : <p className="py-6 text-center text-xs text-slate-500">No qualifying enrollments in this period.</p>}</div></Panel>
      </div><div className="space-y-5"><Panel title="Payment status"><div className="mt-4 space-y-3">{data.financials.map((item) => <div key={item.label} className="rounded-xl bg-[#f8fbff] p-3"><p className="text-[10px] text-slate-500">{item.label}</p><strong className="mt-1 block text-base text-[#1C1D52]">{item.value}</strong><p className="mt-1 text-[9px] text-slate-500">{item.detail}</p></div>)}</div></Panel><Panel title="Needs attention"><div className="mt-4 space-y-2">{data.actions.map((action, index) => <Link key={action.label} href={action.href} className="flex items-center gap-3 rounded-xl bg-[#f8fbff] p-3 transition hover:bg-slate-100"><span className="rounded-lg bg-white p-2 text-blue-500 shadow-sm">{index === 2 ? <CreditCard className="h-4 w-4" /> : <Info className="h-4 w-4" />}</span><span className="min-w-0 flex-1"><strong className="block text-[11px] text-[#1C1D52]">{action.value} {action.label.toLowerCase()}</strong><span className="mt-1 block text-[9px] text-slate-500">{action.detail}</span></span><ArrowRight className="h-4 w-4 shrink-0 text-slate-400" /></Link>)}</div></Panel></div></div>
    </>}
  </div></AdminShell>
}
function PeriodPicker({ value, onChange }: { value: Period; onChange: (value: Period) => void }) { return <div className="mt-4 flex flex-wrap gap-2">{periods.map((period) => <button key={period} type="button" onClick={() => onChange(period)} className={`rounded-full px-3 py-1 text-[9px] font-semibold ${value === period ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{period}</button>)}</div> }
