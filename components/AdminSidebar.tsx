'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Award, BarChart3, Bell, BookOpen, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Settings, Users, WalletCards } from 'lucide-react'

const studentItems = [
  { label: 'Dashboard', href: '/admin/student', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/student/courses', icon: BookOpen },
  { label: 'Students', href: '/admin/student/students', icon: Users },
  { label: 'Enrollments', href: '/admin/student/enrollments', icon: GraduationCap },
  { label: 'Payments', href: '/admin/student/payments', icon: CreditCard },
  { label: 'Certificates', href: '/admin/student/certificates', icon: Award },
  { label: 'Instructors', href: '/admin/student/instructors', icon: Users },
  { label: 'Reports', href: '/admin/student/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/admin/student/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/student/settings', icon: Settings },
]

const internshipItems = [
  { label: 'Dashboard', href: '/admin/internship', icon: LayoutDashboard },
  { label: 'Interns', href: '/admin/internship/interns', icon: Users },
  { label: 'Applications', href: '/admin/internship/applications', icon: FileText },
  { label: 'Assessments', href: '/admin/internship/assessments', icon: GraduationCap },
  { label: 'Mentors', href: '/admin/internship/mentors', icon: Users },
  { label: 'Payments', href: '/admin/internship/payments', icon: WalletCards },
  { label: 'Reports', href: '/admin/internship/reports', icon: BarChart3 },
  { label: 'Notifications', href: '/admin/internship/notifications', icon: Bell },
  { label: 'Settings', href: '/admin/internship/settings', icon: Settings },
]

export default function AdminSidebar({ workspace, mobile = false }: { workspace: 'student' | 'internship'; mobile?: boolean }) {
  const pathname = usePathname() || `/admin/${workspace}`
  const items = workspace === 'student' ? studentItems : internshipItems

  return <aside className={`fixed left-4 top-[72px] z-20 h-[calc(100dvh-88px)] w-[248px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[28px] bg-[#1C1D52] px-4 py-6 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)] sm:left-5 sm:py-8 lg:left-6 ${mobile ? 'flex lg:hidden' : 'hidden md:flex'}`}><div className="border-b border-white/10 px-2 pb-5 text-center"><div className="mb-3 flex justify-center"><Image src="/avatar-placeholder.png" alt="Admin avatar" width={78} height={78} className="h-[78px] w-[78px] rounded-full object-cover" /></div><h3 className="text-sm font-semibold tracking-tight">Emmanuel</h3><p className="mt-1 text-xs font-medium text-white/55">Administrator</p></div><nav aria-label="Admin navigation" className="mt-7 flex-1 overflow-y-auto px-1"><ul className="space-y-1">{items.map((item) => { const Icon = item.icon; const active = item.href === `/admin/${workspace}` ? pathname === item.href : pathname.startsWith(item.href); return <li key={item.label}><Link href={item.href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? 'bg-[#5FBB46] text-white' : 'text-white/90 hover:bg-white/10'}`}><Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />{item.label}</Link></li> })}</ul></nav><Link href="/admin/logout" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10"><LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />Log Out</Link></aside>
}
