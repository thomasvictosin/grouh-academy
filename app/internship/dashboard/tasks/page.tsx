'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Bell, Users, UserRound } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'
import type { InternshipTaskListResponse } from '@/lib/internship-data'

const statusStyles = {
  yellow: 'bg-yellow-100 text-yellow-700',
  slate: 'bg-slate-100 text-slate-500',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-600',
}

const alertToneStyles = {
  orange: 'bg-orange-100 text-orange-900',
  green: 'bg-slate-100 text-[#1C1D52]',
  red: 'bg-red-100 text-red-900',
  slate: 'bg-slate-100 text-slate-600',
}

const alertDotStyles = {
  orange: 'bg-orange-500',
  green: 'bg-[#22c56e]',
  red: 'bg-red-500',
  slate: 'bg-slate-400',
}

export default function TasksPage() {
  const [data, setData] = useState<InternshipTaskListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [taskFilter, setTaskFilter] = useState<'All' | 'INDIVIDUAL' | 'GROUP'>('All')

  useEffect(() => {
    fetch('/api/internship/tasks')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your tasks.')
        return response.json() as Promise<InternshipTaskListResponse>
      })
      .then(setData)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load your tasks.'))
      .finally(() => setLoading(false))
  }, [])

  const allTasks = data?.tasks ?? []
  const visibleDeadlines = taskFilter === 'All' ? allTasks : allTasks.filter((task) => task.kind === taskFilter)

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-7"><h1 className="text-3xl font-bold tracking-tight">My Tasks</h1><p className="mt-2 text-xs text-[#14204f]/75">Track your individual and group assignments.</p></section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">{error}</div>
        )}

        {!error && loading && (
          <div className="h-40 animate-pulse rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]" />
        )}

        {!error && !loading && data && !data.hasProgram && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-[#1C1D52]">No active internship application</h2>
            <p className="mt-2 text-sm text-slate-500">Enroll in an internship program to start seeing tasks here.</p>
          </div>
        )}

        {!error && !loading && data && data.hasProgram && (
          <>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[#1C1D52]"><UserRound className="h-4 w-4" /></span><span className="rounded-lg bg-[#1C1D52] px-3 py-1.5 text-[10px] font-bold text-white">{data.stats.activeIndividual} Active Tasks</span></div><h2 className="mt-4 text-base font-bold text-[#1C1D52]">Individual Tasks</h2><p className="mt-2 text-xs text-slate-500">Weekly assignments from your tutor</p><button type="button" onClick={() => setTaskFilter('INDIVIDUAL')} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1C1D52]">View Tasks <ArrowRight className="h-3 w-3" /></button></section>
                <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f7eb] text-[#5FBB46]"><Users className="h-4 w-4" /></span><span className="rounded-lg bg-[#5FBB46] px-3 py-1.5 text-[10px] font-bold text-white">{data.stats.activeGroup} Active Tasks</span></div><h2 className="mt-4 text-base font-bold text-[#1C1D52]">Group Tasks</h2><p className="mt-2 text-xs text-slate-500">Bi-weekly collaborative assignments</p><button type="button" onClick={() => setTaskFilter('GROUP')} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#5FBB46]">View Tasks <ArrowRight className="h-3 w-3" /></button></section>
                <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                  {[
                    ['Pending', data.stats.pending, 'orange'],
                    ['Submitted', data.stats.submitted, 'green'],
                    ['Overdue', data.stats.overdue, 'red'],
                  ].map(([label, value, color]) => (
                    <div key={label as string} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{label}</span>
                        <span className={`h-2 w-2 rounded-full ${color === 'orange' ? 'bg-orange-500' : color === 'green' ? 'bg-[#22c56e]' : 'bg-red-500'}`} />
                      </div>
                      <strong className="mt-3 block text-2xl text-[#1C1D52]">{value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#1C1D52]"><Bell className="h-4 w-4" />Recent Alerts</h2>
                <div className="mt-4 space-y-2">
                  {data.alerts.length > 0 ? (
                    data.alerts.map((alert) => (
                      <div key={alert.id} className={`flex gap-2 rounded-xl p-3 text-[10px] leading-4 ${alertToneStyles[alert.tone]}`}>
                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${alertDotStyles[alert.tone]}`} />
                        <span>
                          {alert.text}
                          <span className="mt-0.5 block text-[9px] text-slate-400">{alert.postedLabel}</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No alerts yet.</p>
                  )}
                </div>
              </section>
            </div>

            <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-[#1C1D52]">Upcoming Deadlines</h2>
                <label className="relative self-start">
                  <span className="sr-only">Filter tasks</span>
                  <select
                    value={taskFilter}
                    onChange={(event) => setTaskFilter(event.target.value as typeof taskFilter)}
                    className="h-9 appearance-none rounded-lg px-8 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d6dbe5] outline-none"
                  >
                    <option value="All">All Tasks</option>
                    <option value="INDIVIDUAL">Individual Tasks</option>
                    <option value="GROUP">Group Tasks</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-slate-500">⌄</span>
                </label>
              </div>

              {visibleDeadlines.length > 0 ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[680px] border-collapse text-left text-[10px]">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-500">
                        <th className="pb-3 font-semibold">Assignment Name</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Due Date</th>
                        <th className="pb-3 font-semibold">Time Left</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleDeadlines.map((task) => (
                        <tr key={task.id} className="border-b border-slate-200 text-[#1C1D52]">
                          <td className="py-4 font-semibold">{task.title}</td>
                          <td className={`py-4 ${task.kind === 'GROUP' ? 'text-[#5FBB46]' : ''}`}>{task.kind === 'GROUP' ? 'Group' : 'Individual'}</td>
                          <td className="py-4">{task.dueDateLabel ?? '—'}</td>
                          <td className={`py-4 ${task.timeLeftLabel === 'Overdue' || task.timeLeftLabel.includes('hour') || task.timeLeftLabel.includes('minute') ? 'font-bold text-red-500' : ''}`}>{task.timeLeftLabel}</td>
                          <td className="py-4"><span className={`rounded-lg px-2 py-1 text-[9px] font-semibold ${statusStyles[task.tone]}`}>{task.status}</span></td>
                          <td className="py-4 font-bold">{task.scoreLabel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-5 text-xs text-slate-500">No tasks match this filter yet.</p>
              )}

              <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>Showing {visibleDeadlines.length} of {allTasks.length} deadlines</span>
                <a href="/internship/dashboard/grades" className="font-semibold text-blue-600">View My Grades →</a>
              </div>
            </section>
          </>
        )}
      </div>
    </InternshipShell>
  )
}