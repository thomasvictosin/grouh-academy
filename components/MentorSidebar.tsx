'use client'

import { BarChart3, Bell, CheckSquare, ClipboardCheck, FileText, LayoutGrid, LogOut, MessageCircle, Settings, UserRound, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { label: 'Dashboard', href: '/mentor', icon: LayoutGrid },
  { label: 'My Interns', href: '/mentor/interns', icon: Users },
  { label: 'Messages', href: '/mentor/messages', icon: MessageCircle },
  { label: 'Assessments', href: '/mentor/assessments', icon: ClipboardCheck },
  { label: 'Tasks', href: '/mentor/tasks', icon: CheckSquare },
  { label: 'Submissions', href: '/mentor/submissions', icon: FileText },
  { label: 'Analytics', href: '/mentor/analytics', icon: BarChart3 },
  { label: 'Notifications', href: '/mentor/notifications', icon: Bell },
  { label: 'Profile', href: '/mentor/profile', icon: UserRound },
  { label: 'Settings', href: '/mentor/settings', icon: Settings },
]

export default function MentorSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/mentor'
  return <div className="flex h-full w-full flex-col rounded-[28px] bg-[#1C1D52] px-4 py-8 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)]"><div className="px-2 text-center"><div className="mb-4 flex justify-center"><img src="/avatar-placeholder.png" alt="Mentor avatar" className="h-[88px] w-[88px] rounded-full object-cover" /></div><h3 className="text-base font-semibold tracking-tight">Dr. Sarah Chen</h3><p className="mt-1 text-sm font-medium text-white/55">Mentor</p></div><nav aria-label="Mentor workspace" className="mt-8 flex-1 overflow-y-auto px-1"><ul className="space-y-1.5">{items.map((item) => { const Icon = item.icon; const active = item.href === '/mentor' ? pathname === item.href : pathname.startsWith(item.href); return <li key={item.href}><Link href={item.href} onClick={onNavigate} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${active ? 'bg-[#5FBB46] text-white' : 'text-white/90 hover:bg-white/10'}`}><Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} /><span className="truncate">{item.label}</span></Link></li> })}</ul></nav><Link href="/mentor/logout" onClick={onNavigate} className="mt-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10"><LogOut className="h-5 w-5" /><span>Log Out</span></Link></div>
}
