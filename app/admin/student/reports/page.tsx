'use client'

import { BarChart3, Download, FileText, TrendingUp, Users, WalletCards } from 'lucide-react'
import AdminShell from '@/components/AdminShell'

const reportCards = [
  { title: 'Student Enrollment', value: '1,247', detail: '+12.4% from last month', icon: Users, color: 'text-blue-500 bg-[#dceeff]' },
  { title: 'Course Completion', value: '67%', detail: '+3.1% from last month', icon: TrendingUp, color: 'text-teal-600 bg-[#e8faf7]' },
  { title: 'Certificates Issued', value: '1,890', detail: '+15.2% from last month', icon: FileText, color: 'text-orange-600 bg-[#fff0d8]' },
  { title: 'Total Revenue', value: '$124,500', detail: '+22.4% from last month', icon: WalletCards, color: 'text-blue-600 bg-[#e6e8ff]' },
]

const monthlyData = [38, 52, 45, 67, 58, 72, 64, 80, 76, 88, 82, 94]
const topCourses = [['Web Development', '450 students', '84%'], ['Data Science Fundamentals', '380 students', '72%'], ['UI/UX Design Mastery', '310 students', '91%'], ['Python Programming', '290 students', '65%']]

export default function ReportsPage() {
  const handleExportReport = () => {
    const lines = [
      'Report,Value,Detail',
      ...reportCards.map((card) => `${card.title},${card.value},${card.detail}`),
      '',
      'Monthly Enrollment Trend',
      ...monthlyData.map((value, index) => `${index + 1},${value}`),
    ]

    const csv = lines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'student-admin-report.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Reports & Analytics</h1><p className="mt-2 text-xs text-slate-500">Review student activity, course performance, completion trends, and revenue.</p></div><div className="flex flex-wrap gap-2"><select defaultValue="Last 12 months" className="h-10 rounded-lg bg-white px-3 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"><option>Last 30 days</option><option>Last 12 months</option><option>This year</option></select><button type="button" onClick={handleExportReport} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f]"><Download className="h-3.5 w-3.5" />Export Report</button></div></header><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{reportCards.map(({ title, value, detail, icon: Icon, color }) => <div key={title} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><span className={`flex h-8 w-8 items-center justify-center rounded-md ${color}`}><Icon className="h-4 w-4" /></span><strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong><span className="mt-1 block text-[10px] font-semibold text-[#1C1D52]">{title}</span><span className="mt-2 block text-[9px] text-teal-600">{detail}</span></div>)}</div><div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]"><section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-[#1C1D52]">Enrollment Trend</h2><p className="mt-1 text-[10px] text-slate-500">New student registrations by month</p></div><BarChart3 className="h-5 w-5 text-blue-500" /></div><div className="mt-6 flex h-56 items-end gap-2 border-b border-l border-slate-200 px-3 pb-0 sm:gap-4 sm:px-6">{monthlyData.map((height, index) => <div key={index} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="rounded-t-md bg-blue-500 transition hover:bg-[#5FBB46]" style={{ height: `${height}%` }} /><span className="text-center text-[8px] text-slate-400">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span></div>)}</div></section><section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Top Courses</h2><div className="mt-4 divide-y divide-slate-100">{topCourses.map(([course, students, completion]) => <div key={course} className="py-3 first:pt-0"><div className="flex items-start justify-between gap-3"><span className="text-xs font-semibold text-[#1C1D52]">{course}</span><span className="text-[10px] font-bold text-teal-600">{completion}</span></div><p className="mt-1 text-[9px] text-slate-500">{students}</p><div className="mt-2 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-[#5FBB46]" style={{ width: completion }} /></div></div>)}</div></section></div></div></AdminShell>
}
