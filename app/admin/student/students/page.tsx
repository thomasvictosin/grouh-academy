'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Blocked'
type Student = { name: string; email: string; courses: number; completed: number; certificates: number; status: StudentStatus; joined: string; active: string }

const students: Student[] = [
  { name: 'Emma Thompson', email: 'emma.t@gmail.com', courses: 4, completed: 2, certificates: 2, status: 'Active', joined: '2025-01-10', active: '2 mins ago' },
  { name: 'James Wilson', email: 'j.wilson@hotmail.com', courses: 6, completed: 5, certificates: 4, status: 'Active', joined: '2025-01-12', active: '1 hour ago' },
  { name: 'Sofia Rodriguez', email: 'sofia.r@outlook.com', courses: 3, completed: 0, certificates: 0, status: 'Inactive', joined: '2025-02-01', active: '3 days ago' },
  { name: 'Liam Chen', email: 'liam.chen@tech.io', courses: 5, completed: 4, certificates: 3, status: 'Active', joined: '2025-01-15', active: '12 mins ago' },
  { name: 'Olivia Patel', email: 'olivia.p@gmail.com', courses: 2, completed: 1, certificates: 1, status: 'Suspended', joined: '2025-01-20', active: '1 week ago' },
  { name: 'Noah Kim', email: 'noah.kim@naver.com', courses: 7, completed: 3, certificates: 2, status: 'Active', joined: '2025-01-05', active: '5 mins ago' },
  { name: 'Ava Martinez', email: 'ava.m@yahoo.com', courses: 4, completed: 4, certificates: 4, status: 'Active', joined: '2025-01-18', active: '45 mins ago' },
  { name: 'Ethan Brooks', email: 'e.brooks@gmail.com', courses: 1, completed: 0, certificates: 0, status: 'Blocked', joined: '2025-02-14', active: '2 weeks ago' },
  { name: 'Mia Turner', email: 'mia.turner@gmail.com', courses: 3, completed: 1, certificates: 0, status: 'Active', joined: '2025-02-18', active: '30 mins ago' },
]

const tabs: { label: string; value: 'All' | StudentStatus }[] = [
  { label: 'All Students', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'Suspended', value: 'Suspended' },
  { label: 'Blocked', value: 'Blocked' },
]

const statusStyles: Record<StudentStatus, string> = {
  Active: 'bg-[#e8faf7] text-teal-600',
  Inactive: 'bg-slate-100 text-slate-500',
  Suspended: 'bg-[#fff0d8] text-orange-600',
  Blocked: 'bg-red-100 text-red-500',
}

function studentSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminStudentsPage() {
  const [activeTab, setActiveTab] = useState<'All' | StudentStatus>('All')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [joinedDate, setJoinedDate] = useState('Any')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [openStudentMenu, setOpenStudentMenu] = useState<string | null>(null)

  const visibleStudents = useMemo(() => students.filter((student) => {
    const matchesTab = activeTab === 'All' || student.status === activeTab
    const searchValue = `${student.name} ${student.email}`.toLowerCase()
    const matchesSearch = searchValue.includes(query.toLowerCase())
    const matchesCourse = course === 'All' || (course === 'Enrolled' && student.courses > 0)
    const matchesStatus = status === 'All' || student.status === status
    return matchesTab && matchesSearch && matchesCourse && matchesStatus && joinedDate === 'Any'
  }), [activeTab, course, joinedDate, query, status])

  function resetPage() {
    setPage(1)
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Students Management</h1><p className="mt-2 text-xs text-slate-500">Monitor registrations, learning activity progress, status controls and reports</p></div><Link href="/admin/student/students/new" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]"><Plus className="h-4 w-4" />Add New Student</Link></header><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setActiveTab(tab.value); resetPage() }} className={`rounded-full px-3 py-2 text-[10px] font-semibold transition ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] hover:bg-slate-50'}`}>{tab.label}<span className={`ml-2 rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{tab.value === 'All' ? 1247 : tab.value === 'Active' ? 892 : tab.value === 'Inactive' ? 215 : tab.value === 'Suspended' ? 28 : 12}</span></button>)}</div><div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between"><label className="flex w-full max-w-[260px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search students</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPage() }} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search students..." /></label><div className="flex flex-wrap gap-2"><FilterSelect label="Course" value={course} onChange={(value) => { setCourse(value); resetPage() }} options={['All', 'Enrolled']} /><FilterSelect label="Joined Date" value={joinedDate} onChange={(value) => { setJoinedDate(value); resetPage() }} options={['Any', 'This month', 'This year']} /><FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); resetPage() }} options={['All', 'Active', 'Inactive', 'Suspended', 'Blocked']} /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left text-[10px]"><thead><tr className="bg-[#f5f8fb] text-slate-600"><th className="px-3 py-3 font-semibold">Student</th><th className="px-3 py-3 font-semibold">Enrolled Courses</th><th className="px-3 py-3 font-semibold">Completed</th><th className="px-3 py-3 font-semibold">Certificates</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Joined Date</th><th className="px-3 py-3 font-semibold">Last Active</th><th className="px-3 py-3 font-semibold">Actions</th></tr></thead><tbody>{visibleStudents.slice((page - 1) * 8, page * 8).map((student) => <tr key={student.email} className="border-b border-slate-100 text-[#1C1D52]"><td className="px-3 py-3.5"><strong className="block font-bold">{student.name}</strong><span className="mt-1 block text-[9px] text-slate-500">{student.email}</span></td><td className="px-3 py-3.5">{student.courses}</td><td className="px-3 py-3.5">{student.completed}</td><td className="px-3 py-3.5">{student.certificates}</td><td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[student.status]}`}>{student.status}</span></td><td className="px-3 py-3.5 text-slate-500">{student.joined}</td><td className="px-3 py-3.5 text-slate-500">{student.active}</td><td className="relative px-3 py-3.5"><button type="button" onClick={() => setOpenStudentMenu(openStudentMenu === student.email ? null : student.email)} aria-expanded={openStudentMenu === student.email} aria-label={`Actions for ${student.name}`} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100"><MoreHorizontal className="h-4 w-4" /></button>{openStudentMenu === student.email && <ActionMenu items={['View student', 'Edit student', 'Change status']} onSelect={() => setOpenStudentMenu(null)} />}</td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleStudents.length ? (page - 1) * 8 + 1 : 0}-{Math.min(page * 8, visibleStudents.length)} of 1,247 students</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40"><ChevronLeft className="h-3 w-3" />Previous</button>{[1, 2, 3].map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 rounded-lg text-[10px] ${page === number ? 'bg-blue-500 text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{number}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8]">Next<ChevronRight className="h-3 w-3" /></button></div></div></section></div></AdminShell>
}

function ActionMenu({ items, onSelect, viewHref }: { items: string[]; onSelect: () => void; viewHref?: string }) {
  const router = useRouter()
  return <div className="absolute right-3 top-10 z-10 w-36 rounded-lg bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">{items.map((item) => viewHref && item === 'View student' ? <Link key={item} href={viewHref} onClick={onSelect} className="block w-full rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">{item}</Link> : item === 'View student' ? <Link key={item} href="/admin/student/students" onClick={(event) => { event.preventDefault(); const name = event.currentTarget.closest('tr')?.firstElementChild?.textContent?.trim(); if (name) router.push(`/admin/student/students/${studentSlug(name)}`); onSelect() }} className="block w-full rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">{item}</Link> : <button key={item} type="button" onClick={(event) => { const name = event.currentTarget.closest('tr')?.firstElementChild?.textContent?.trim(); if (name && item === 'Edit student') router.push(`/admin/student/students/${studentSlug(name)}/edit`); if (name && item === 'Change status') router.push(`/admin/student/students/${studentSlug(name)}/status`); onSelect() }} className="block w-full rounded-md px-3 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">{item}</button>)}</div>
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="relative flex w-fit items-center"><span className="sr-only">Filter by {label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none"><option value={options[0]}>{label}: {options[0]}</option>{options.slice(1).map((option) => <option key={option} value={option}>{label}: {option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" /></label>
}
