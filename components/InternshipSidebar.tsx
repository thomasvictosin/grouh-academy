'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Award, BookOpen, CheckSquare, FileText, Grid2X2, LogOut, MessageCircle, Settings, Users, UserRound } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/internship/dashboard', icon: Grid2X2 },
  { label: 'Profile', href: '/internship/dashboard/profile', icon: UserRound },
  { label: 'Mentor', href: '/internship/dashboard/mentor', icon: MessageCircle },
  { label: 'Group Discussion', href: '/internship/dashboard/discussion', icon: UserRound },
  { label: 'Task', href: '/internship/dashboard/tasks', icon: CheckSquare },
  { label: 'Groups', href: '/internship/dashboard/groups', icon: Users },
  { label: 'Grades', href: '/internship/dashboard/grades', icon: Award },
  { label: 'Certificate', href: '/student/certificates', icon: FileText },
  { label: 'Settings', href: '/internship/dashboard/settings', icon: Settings },
  { label: 'Resource', href: '/internship/dashboard/resources', icon: BookOpen },
]

export default function InternshipSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/internship/dashboard'

  return (
    <div className="flex h-full w-full flex-col rounded-[28px] bg-[#1C1D52] px-3 py-6 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)] sm:px-4 sm:py-8">
      <div className="px-2 text-center">
        <div className="mb-4 flex justify-center"><Image src="/avatar-placeholder.png" alt="Student Avatar" width={78} height={78} className="h-[78px] w-[78px] rounded-full object-cover" /></div>
        <h3 className="text-sm font-semibold tracking-tight">Aster Seawalker</h3>
        <p className="mt-1 text-xs font-medium text-white/55">Intern</p>
      </div>

      <nav aria-label="Internship dashboard" className="mt-7 flex-1 overflow-y-auto px-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.href === '/internship/dashboard' ? pathname === item.href : pathname.startsWith(item.href)
            return <li key={item.label}><Link href={item.href} onClick={onNavigate} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium transition-colors sm:px-4 sm:py-3 sm:text-sm ${active ? 'bg-[#5FBB46] text-white' : 'text-white/90 hover:bg-white/10'}`}><Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={1.75} /><span className="truncate">{item.label}</span></Link></li>
          })}
        </ul>
      </nav>

      <Link href="/internship/dashboard/logout" onClick={onNavigate} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium text-white/90 transition hover:bg-white/10 sm:px-4 sm:py-3 sm:text-sm"><LogOut className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={1.75} /><span>Log Out</span></Link>
    </div>
  )
}
