'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, ClipboardList, Clock3, Minus, Trophy } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'
import type { InternshipTaskListResponse } from '@/lib/internship-data'

type TaskKind = 'INDIVIDUAL' | 'GROUP'
type GradeStatus = 'Graded' | 'Pending'

const statusStyles: Record<GradeStatus, string> = {
  Graded: 'bg-[#e8f7eb] text-[#5FBB46]',
  Pending: 'bg-[#fff3df] text-[#ed912e]',
}

function formatSubmissionDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
}

export default function GradesPage() {
  const [data, setData] = useState<InternshipTaskListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [taskType, setTaskType] = useState<TaskKind>('INDIVIDUAL')
  const [statusFilter, setStatusFilter] = useState<'All' | GradeStatus>('All')

  useEffect(() => {
    fetch('/api/internship/tasks')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your grades.')
        return response.json() as Promise<InternshipTaskListResponse>
      })
      .then(setData)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load your grades.'))
      .finally(() => setLoading(false))
  }, [])

  const allTasks = data?.tasks ?? []

  // Grades uses its own simpler binary view (Graded = a numeric score
  // exists, Pending = it doesn't) rather than the Tasks page's more
  // granular status set (Not Started/In Progress/Submitted/etc) - a
  // score can exist before a submission is formally ACCEPTED, so this
  // is intentionally based on `score !== null`, not on `status`.
  const tasksOfType = useMemo(() => allTasks.filter((task) => task.kind === taskType), [allTasks, taskType])
  const gradedTasksOfType = useMemo(() => tasksOfType.filter((task) => task.score !== null), [tasksOfType])

  const visibleSubmissions = useMemo(
    () =>
      tasksOfType.filter((task) => {
        if (statusFilter === 'All') return true
        const gradeStatus: GradeStatus = task.score !== null ? 'Graded' : 'Pending'
        return gradeStatus === statusFilter
      }),
    [statusFilter, tasksOfType],
  )

  const scores = gradedTasksOfType.map((task) => ((task.score ?? 0) / task.maxScore) * 100)
  const averageScore = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0
  const highestScore = scores.length ? Math.round(Math.max(...scores)) : 0
  const lowestScore = scores.length ? Math.round(Math.min(...scores)) : 0
  const completedCount = gradedTasksOfType.length
  const totalCount = tasksOfType.length

  return (
    <InternshipShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1D52]">Grades</h1>
          <div className="inline-flex w-fit rounded-full bg-white p-1 shadow-[0_5px_15px_rgba(28,29,82,0.08)]" role="tablist" aria-label="Task type">
            {(['INDIVIDUAL', 'GROUP'] as TaskKind[]).map((type) => (
              <button
                key={type}
                type="button"
                role="tab"
                aria-selected={taskType === type}
                onClick={() => setTaskType(type)}
                className={`rounded-full px-5 py-2 text-[10px] font-semibold transition ${taskType === type ? 'bg-[#5FBB46] text-white' : 'text-[#1C1D52]'}`}
              >
                {type === 'INDIVIDUAL' ? 'Individual' : 'Group'} Tasks
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">{error}</div>
        )}

        {!error && loading && (
          <div className="h-40 animate-pulse rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]" />
        )}

        {!error && !loading && data && !data.hasProgram && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-[#1C1D52]">No active internship application</h2>
            <p className="mt-2 text-sm text-slate-500">Enroll in an internship program to start seeing grades here.</p>
          </div>
        )}

        {!error && !loading && data && data.hasProgram && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <GradeStat icon={<BarChart3 className="h-5 w-5" />} label="Average Score" value={`${averageScore}%`} tone="blue" />
              <GradeStat icon={<ClipboardList className="h-5 w-5" />} label="Tasks Completed" value={`${completedCount} / ${totalCount}`} tone="green" />
              <GradeStat icon={<Clock3 className="h-5 w-5" />} label="Highest Score" value={scores.length ? `${highestScore}%` : '—'} tone="yellow" />
              <GradeStat icon={<Trophy className="h-5 w-5" />} label="Lowest Score" value={scores.length ? `${lowestScore}%` : '—'} tone="red" />
            </section>

            <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-bold text-[#1C1D52]">{taskType === 'INDIVIDUAL' ? 'Individual' : 'Group'} Task Submissions</h2>
                <label className="relative self-start">
                  <span className="sr-only">Filter submission status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                    className="h-8 appearance-none rounded-lg px-3 pr-7 text-[10px] text-[#1C1D52] shadow-[inset_0_0_0_1px_#cfd5df] outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Graded">Graded</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-slate-500">⌄</span>
                </label>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-[10px]">
                  <thead>
                    <tr className="bg-[#eaf1ff] text-[#1C1D52]">
                      <th className="rounded-l-lg px-3 py-3 font-semibold">Task Name</th>
                      <th className="px-3 py-3 font-semibold">Submission Date</th>
                      <th className="px-3 py-3 font-semibold">Score Obtainable</th>
                      <th className="rounded-r-lg px-3 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSubmissions.map((task) => {
                      const gradeStatus: GradeStatus = task.score !== null ? 'Graded' : 'Pending'
                      return (
                        <tr key={task.id} className="border-b border-[#e7edf7] text-[#1C1D52]">
                          <td className="px-3 py-4 font-medium">{task.title}</td>
                          <td className="px-3 py-4 text-slate-500">{formatSubmissionDate(task.submittedAt)}</td>
                          <td className="px-3 py-4 font-bold">
                            {task.score === null ? (
                              <>
                                <Minus className="inline h-3 w-3" /> <span className="font-normal text-slate-500">/ {task.maxScore}</span>
                              </>
                            ) : (
                              <>
                                {task.score} <span className="font-normal text-slate-500">/ {task.maxScore}</span>
                              </>
                            )}
                          </td>
                          <td className="px-3 py-4">
                            <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[gradeStatus]}`}>{gradeStatus}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {visibleSubmissions.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No submissions match this filter.</p>}
            </section>
          </>
        )}
      </div>
    </InternshipShell>
  )
}

function GradeStat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'blue' | 'green' | 'yellow' | 'red' }) {
  const tones = { blue: 'bg-[#eaf1ff] text-blue-600', green: 'bg-[#e8f7eb] text-[#5FBB46]', yellow: 'bg-[#fff8e6] text-[#f3bb28]', red: 'bg-[#ffebef] text-[#ff5c68]' }
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span>
      <p className="mt-3 text-[10px] text-slate-500">{label}</p>
      <strong className="mt-1 block text-xl text-[#1C1D52]">{value}</strong>
    </div>
  )
}