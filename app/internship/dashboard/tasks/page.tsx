'use client'

import { useState } from 'react'
import { ArrowRight, Bell, Users, UserRound } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'

const deadlines = [
  { name: 'Frontend UI Components', type: 'Individual', due: 'Sep 5, 2026', time: '5 days left', status: 'In Progress', tone: 'yellow', score: '20 marks' },
  { name: 'API Integration Project', type: 'Group', due: 'Sep 12, 2026', time: '12 days left', status: 'Not Started', tone: 'slate', score: '35 marks' },
  { name: 'Database Schema Design', type: 'Individual', due: 'Aug 29, 2026', time: '2 hours left', status: 'In Progress', tone: 'yellow', score: '25 marks' },
  { name: 'Team Code Review', type: 'Group', due: 'Sep 1, 2026', time: '3 days left', status: 'Submitted', tone: 'green', score: '30 marks' },
  { name: 'JavaScript Fundamentals Quiz', type: 'Individual', due: 'Aug 25, 2026', time: 'Overdue', status: 'Defaulted', tone: 'red', score: '15 marks' },
]

const statusStyles = {
  yellow: 'bg-yellow-100 text-yellow-700',
  slate: 'bg-slate-100 text-slate-500',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-600',
}

export default function TasksPage() {
  const [taskFilter, setTaskFilter] = useState<'All' | 'Individual' | 'Group'>('All')
  const visibleDeadlines = taskFilter === 'All'
    ? deadlines
    : deadlines.filter((task) => task.type === taskFilter)

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-7"><h1 className="text-3xl font-bold tracking-tight">My Tasks</h1><p className="mt-2 text-xs text-[#14204f]/75">Track your individual and group assignments.</p></section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(250px,0.72fr)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[#1C1D52]"><UserRound className="h-4 w-4" /></span><span className="rounded-lg bg-[#1C1D52] px-3 py-1.5 text-[10px] font-bold text-white">4 Active Tasks</span></div><h2 className="mt-4 text-base font-bold text-[#1C1D52]">Individual Tasks</h2><p className="mt-2 text-xs text-slate-500">Weekly assignments from your tutor</p><a href="#individual" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#1C1D52]">View Tasks <ArrowRight className="h-3 w-3" /></a></section>
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f7eb] text-[#5FBB46]"><Users className="h-4 w-4" /></span><span className="rounded-lg bg-[#5FBB46] px-3 py-1.5 text-[10px] font-bold text-white">2 Active Tasks</span></div><h2 className="mt-4 text-base font-bold text-[#1C1D52]">Group Tasks</h2><p className="mt-2 text-xs text-slate-500">Bi-weekly collaborative assignments</p><a href="#group" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#5FBB46]">View Tasks <ArrowRight className="h-3 w-3" /></a></section>
            <div className="grid grid-cols-3 gap-3 sm:col-span-2">{[['Pending', '3', 'orange'], ['Submitted', '5', 'green'], ['Overdue', '1', 'red']].map(([label, value, color]) => <div key={label} className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between text-xs text-slate-500"><span>{label}</span><span className={`h-2 w-2 rounded-full ${color === 'orange' ? 'bg-orange-500' : color === 'green' ? 'bg-[#22c56e]' : 'bg-red-500'}`} /></div><strong className="mt-3 block text-2xl text-[#1C1D52]">{value}</strong></div>)}</div>
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><h2 className="flex items-center gap-2 text-sm font-bold text-[#1C1D52]"><Bell className="h-4 w-4" />Recent Alerts</h2><div className="mt-4 space-y-2">{[['You have 2 hours left for Database Schema Design!', 'orange'], ['New group task assigned: API Integration Project', 'green'], ['You missed the deadline for JavaScript Fundamentals Quiz', 'red']].map(([text, tone]) => <div key={text} className={`flex gap-2 rounded-xl p-3 text-[10px] leading-4 ${tone === 'orange' ? 'bg-orange-100 text-orange-900' : tone === 'green' ? 'bg-slate-100 text-[#1C1D52]' : 'bg-red-100 text-red-900'}`}><span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'orange' ? 'bg-orange-500' : tone === 'green' ? 'bg-[#22c56e]' : 'bg-red-500'}`} />{text}</div>)}</div></section>
        </div>

        <section className="overflow-hidden rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-lg font-bold text-[#1C1D52]">Upcoming Deadlines</h2><label className="relative self-start"><span className="sr-only">Filter tasks</span><select value={taskFilter} onChange={(event) => setTaskFilter(event.target.value as typeof taskFilter)} className="h-9 appearance-none rounded-lg px-8 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d6dbe5] outline-none"><option value="All">All Tasks</option><option value="Individual">Individual Tasks</option><option value="Group">Group Tasks</option></select><span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-slate-500">⌄</span></label></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] border-collapse text-left text-[10px]"><thead><tr className="border-b border-slate-300 text-slate-500"><th className="pb-3 font-semibold">Assignment Name</th><th className="pb-3 font-semibold">Type</th><th className="pb-3 font-semibold">Due Date</th><th className="pb-3 font-semibold">Time Left</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Score</th></tr></thead><tbody>{visibleDeadlines.map((task) => <tr key={task.name} className="border-b border-slate-200 text-[#1C1D52]"><td className="py-4 font-semibold">{task.name}</td><td className={`py-4 ${task.type === 'Group' ? 'text-[#5FBB46]' : ''}`}>{task.type}</td><td className="py-4">{task.due}</td><td className={`py-4 ${task.time === 'Overdue' || task.time.includes('hours') ? 'font-bold text-red-500' : ''}`}>{task.time}</td><td className="py-4"><span className={`rounded-lg px-2 py-1 text-[9px] font-semibold ${statusStyles[task.tone as keyof typeof statusStyles]}`}>{task.status}</span></td><td className="py-4 font-bold">{task.score}</td></tr>)}</tbody></table></div><div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleDeadlines.length} of 12 upcoming deadlines</span><a href="/internship/dashboard/grades" className="font-semibold text-blue-600">View My Grades →</a></div></section>
      </div>
    </InternshipShell>
  )
}
