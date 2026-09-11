'use client'

import { BarChart3, BookOpen, FileQuestion, GraduationCap, LayoutGrid, LogOut, MessageCircleQuestion, Settings, Users, WalletCards, Bell, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/instructor', icon: LayoutGrid },
  { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
  { label: 'Students', href: '/instructor/students', icon: Users },
  { label: 'Quizzes', href: '/instructor/quizzes', icon: FileQuestion },
  { label: 'Assignments', href: '/instructor/assignments', icon: GraduationCap },
  { label: 'Revenue', href: '/instructor/revenue', icon: WalletCards },
  { label: 'Questions & Answers', href: '/instructor/questions', icon: MessageCircleQuestion },
  { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/instructor/notifications', icon: Bell },
  { label: 'Profile', href: '/instructor/profile', icon: UserRound },
  { label: 'Settings', href: '/instructor/settings', icon: Settings },
]

export default function InstructorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/instructor'
  return <div className="flex h-full w-full flex-col rounded-[28px] bg-[#1C1D52] px-4 py-6 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)] sm:py-8"><div className="px-2 text-center"><div className="mb-4 flex justify-center"><img src="/avatar-placeholder.png" alt="Instructor avatar" className="h-[88px] w-[88px] rounded-full object-cover" /></div><h3 className="text-base font-semibold tracking-tight">Sarah Johnson</h3><p className="mt-1 text-sm font-medium text-white/55">Instructor</p></div><nav aria-label="Instructor sidebar" className="mt-8 flex-1 overflow-y-auto px-1"><ul className="space-y-1.5">{navItems.map((item) => { const Icon = item.icon; const active = item.href === '/instructor' ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`); return <li key={item.href}><Link href={item.href} onClick={onNavigate} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-[#5FBB46] text-white' : 'text-white/90 hover:bg-white/10'}`}><Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} /><span className="truncate">{item.label}</span></Link></li> })}</ul></nav><Link href="/instructor/logout" onClick={onNavigate} className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"><LogOut className="h-5 w-5 shrink-0" /><span>Log Out</span></Link></div>
}
