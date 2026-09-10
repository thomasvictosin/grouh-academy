'use client'

import { useMemo, useState } from 'react'
import { BarChart3, ClipboardList, Clock3, Minus, Trophy } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'

type TaskType = 'Individual' | 'Group'
type TaskStatus = 'Graded' | 'Pending'

type Submission = {
  name: string
  type: TaskType
  date: string
  score: number | null
  outOf: number
  status: TaskStatus
}

const submissions: Submission[] = [
  { name: 'API Integration Assignment', type: 'Individual', date: 'Aug 15, 2026', score: 85, outOf: 100, status: 'Graded' },
  { name: 'Database Schema Design', type: 'Individual', date: 'Aug 10, 2026', score: 92, outOf: 100, status: 'Graded' },
  { name: 'Frontend Component Build', type: 'Individual', date: 'Aug 05, 2026', score: 78, outOf: 80, status: 'Graded' },
  { name: 'REST API Documentation', type: 'Individual', date: 'Aug 20, 2026', score: 68, outOf: 80, status: 'Graded' },
  { name: 'Unit Testing Exercise', type: 'Individual', date: 'Aug 22, 2026', score: 95, outOf: 100, status: 'Graded' },
  { name: 'Code Review Practice', type: 'Individual', date: 'Aug 25, 2026', score: 45, outOf: 50, status: 'Graded' },
  { name: 'Deployment Pipeline Setup', type: 'Individual', date: 'Aug 28, 2026', score: null, outOf: 100, status: 'Pending' },
  { name: 'Security Audit Report', type: 'Individual', date: 'Aug 29, 2026', score: null, outOf: 100, status: 'Pending' },
  { name: 'Team Sprint Presentation', type: 'Group', date: 'Aug 30, 2026', score: 88, outOf: 100, status: 'Graded' },
  { name: 'Collaborative Feature Build', type: 'Group', date: 'Sep 02, 2026', score: null, outOf: 100, status: 'Pending' },
]

const statusStyles: Record<TaskStatus, string> = {
  Graded: 'bg-[#e8f7eb] text-[#5FBB46]',
  Pending: 'bg-[#fff3df] text-[#ed912e]',
}

export default function GradesPage() {
  const [taskType, setTaskType] = useState<TaskType>('Individual')
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>('All')

  const visibleSubmissions = useMemo(
    () => submissions.filter((submission) => submission.type === taskType && (statusFilter === 'All' || submission.status === statusFilter)),
    [statusFilter, taskType],
  )
  const gradedSubmissions = submissions.filter((submission) => submission.type === taskType && submission.score !== null)
  const scores = gradedSubmissions.map((submission) => (submission.score! / submission.outOf) * 100)
  const averageScore = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : 0
  const highestScore = scores.length ? Math.round(Math.max(...scores)) : 0
  const lowestScore = scores.length ? Math.round(Math.min(...scores)) : 0
  const completedCount = gradedSubmissions.length
  const totalCount = submissions.filter((submission) => submission.type === taskType).length

  return (
    <InternshipShell>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-[#1C1D52]">Grades</h1>
          <div className="inline-flex w-fit rounded-full bg-white p-1 shadow-[0_5px_15px_rgba(28,29,82,0.08)]" role="tablist" aria-label="Task type">
            {(['Individual', 'Group'] as TaskType[]).map((type) => (
              <button key={type} type="button" role="tab" aria-selected={taskType === type} onClick={() => setTaskType(type)} className={`rounded-full px-5 py-2 text-[10px] font-semibold transition ${taskType === type ? 'bg-[#5FBB46] text-white' : 'text-[#1C1D52]'}`}>
                {type} Tasks
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <GradeStat icon={<BarChart3 className="h-5 w-5" />} label="Average Score" value={`${averageScore}%`} tone="blue" />
          <GradeStat icon={<ClipboardList className="h-5 w-5" />} label="Tasks Completed" value={`${completedCount} / ${totalCount}`} tone="green" />
          <GradeStat icon={<Clock3 className="h-5 w-5" />} label="Highest Score" value={`${highestScore} / 100`} tone="yellow" />
          <GradeStat icon={<Trophy className="h-5 w-5" />} label="Lowest Score" value={`${lowestScore} / 100`} tone="red" />
        </section>

        <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold text-[#1C1D52]">{taskType} Task Submissions</h2>
            <label className="relative self-start">
              <span className="sr-only">Filter submission status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-8 appearance-none rounded-lg px-3 pr-7 text-[10px] text-[#1C1D52] shadow-[inset_0_0_0_1px_#cfd5df] outline-none">
                <option value="All">All Statuses</option>
                <option value="Graded">Graded</option>
                <option value="Pending">Pending</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-slate-500">⌄</span>
            </label>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[10px]">
              <thead><tr className="bg-[#eaf1ff] text-[#1C1D52]"><th className="rounded-l-lg px-3 py-3 font-semibold">Task Name</th><th className="px-3 py-3 font-semibold">Submission Date</th><th className="px-3 py-3 font-semibold">Score Obtainable</th><th className="rounded-r-lg px-3 py-3 font-semibold">Status</th></tr></thead>
              <tbody>{visibleSubmissions.map((submission) => <tr key={submission.name} className="border-b border-[#e7edf7] text-[#1C1D52]"><td className="px-3 py-4 font-medium">{submission.name}</td><td className="px-3 py-4 text-slate-500">{submission.date}</td><td className="px-3 py-4 font-bold">{submission.score === null ? <><Minus className="inline h-3 w-3" /> <span className="font-normal text-slate-500">/ {submission.outOf}</span></> : <>{submission.score} <span className="font-normal text-slate-500">/ {submission.outOf}</span></>}</td><td className="px-3 py-4"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[submission.status]}`}>{submission.status}</span></td></tr>)}</tbody>
            </table>
          </div>
          {visibleSubmissions.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No submissions match this filter.</p>}
        </section>
      </div>
    </InternshipShell>
  )
}

function GradeStat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'blue' | 'green' | 'yellow' | 'red' }) {
  const tones = { blue: 'bg-[#eaf1ff] text-blue-600', green: 'bg-[#e8f7eb] text-[#5FBB46]', yellow: 'bg-[#fff8e6] text-[#f3bb28]', red: 'bg-[#ffebef] text-[#ff5c68]' }
  return <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span><p className="mt-3 text-[10px] text-slate-500">{label}</p><strong className="mt-1 block text-xl text-[#1C1D52]">{value}</strong></div>
}
