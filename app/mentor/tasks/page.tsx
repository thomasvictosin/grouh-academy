'use client'

import { CheckCircle2, ClipboardList, Clock3, Users, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { MentorBadge, MentorPage } from '@/components/MentorPage'

const tasks = [
  { title: 'Build a responsive dashboard', type: 'Individual', cohort: 'Cohort A · Software Development', due: 'Sep 12, 2026', assigned: '8 interns', status: 'Active' },
  { title: 'Write a product discovery brief', type: 'Group', cohort: 'Cohort A · Product Design', due: 'Sep 15, 2026', assigned: '6 interns', status: 'Active' },
  { title: 'API documentation exercise', type: 'Individual', cohort: 'Cohort B · Software Development', due: 'Sep 5, 2026', assigned: '10 interns', status: 'Closed' },
]

type TaskType = 'All' | 'Individual' | 'Group'

export default function MentorTasksPage() {
  const [taskType, setTaskType] = useState<TaskType>('All')
  const [selectedTask, setSelectedTask] = useState<(typeof tasks)[number] | null>(null)
  const visibleTasks = useMemo(() => taskType === 'All' ? tasks : tasks.filter((task) => task.type === taskType), [taskType])

  return (
    <MentorPage title="Tasks" description="Create practical individual or group tasks, assign them to supervised interns, set deadlines, and track completion." action={{ label: 'Create task', href: '/mentor/tasks/new' }}>
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f8fbff] p-4"><ClipboardList className="h-5 w-5 text-blue-500" /><strong className="mt-3 block text-xl text-[#1C1D52]">12</strong><span className="text-xs text-slate-500">Active tasks</span></div>
          <div className="rounded-xl bg-[#f8fbff] p-4"><Clock3 className="h-5 w-5 text-amber-500" /><strong className="mt-3 block text-xl text-[#1C1D52]">17</strong><span className="text-xs text-slate-500">Awaiting review</span></div>
          <div className="rounded-xl bg-[#f8fbff] p-4"><CheckCircle2 className="h-5 w-5 text-[#5FBB46]" /><strong className="mt-3 block text-xl text-[#1C1D52]">86%</strong><span className="text-xs text-slate-500">Completion rate</span></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter tasks">
          {(['All', 'Individual', 'Group'] as const).map((type) => <button key={type} type="button" role="tab" aria-selected={taskType === type} onClick={() => setTaskType(type)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold ${taskType === type ? 'bg-[#1C1D52] text-white' : 'bg-[#f3f6fb] text-slate-600'}`}>{type === 'Group' ? <Users className="h-3.5 w-3.5" /> : type === 'Individual' ? <UserRound className="h-3.5 w-3.5" /> : <ClipboardList className="h-3.5 w-3.5" />}{type} tasks</button>)}
        </div>
        <div className="mt-4 space-y-3">
          {visibleTasks.map((task) => <article key={task.title} className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold text-[#1C1D52]">{task.title}</h2><MentorBadge tone={task.type === 'Group' ? 'green' : 'blue'}>{task.type}</MentorBadge></div><p className="mt-1 text-[10px] text-slate-500">{task.cohort} · {task.assigned} · Due {task.due}</p></div><div className="flex items-center gap-3"><MentorBadge tone={task.status === 'Active' ? 'green' : 'blue'}>{task.status}</MentorBadge><button type="button" onClick={() => setSelectedTask(task)} className="text-[10px] font-bold text-blue-600">Manage</button></div></article>)}
        </div>
      </section>
      {selectedTask && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1D52]/45 p-4" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">{selectedTask.type} task</p><h2 id="task-dialog-title" className="mt-1 text-lg font-bold text-[#1C1D52]">{selectedTask.title}</h2></div><button type="button" onClick={() => setSelectedTask(null)} className="text-xs font-bold text-slate-500">Close</button></div><div className="mt-5 space-y-3 text-xs text-slate-600"><p><strong className="text-[#1C1D52]">Cohort:</strong> {selectedTask.cohort}</p><p><strong className="text-[#1C1D52]">Assigned:</strong> {selectedTask.assigned}</p><p><strong className="text-[#1C1D52]">Due:</strong> {selectedTask.due}</p></div><div className="mt-6 flex justify-end gap-2"><Link href="/mentor/submissions" className="rounded-lg bg-[#1C1D52] px-3 py-2 text-[10px] font-bold text-white">View submissions</Link><button type="button" onClick={() => setSelectedTask(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-[#1C1D52]">Done</button></div></div></div>}
    </MentorPage>
  )
}
