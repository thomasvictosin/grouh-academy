'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Award, BookOpen, CheckSquare, Crown, FileText, Grid2X2, LogOut, MessageCircle, Settings, Users, UserRound } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/internship/dashboard', icon: Grid2X2 },
  { label: 'Profile', href: '/internship/dashboard/profile', icon: UserRound },
  { label: 'Mentor', href: '/internship/dashboard/mentor', icon: MessageCircle },
  { label: 'Group Discussion', href: '/internship/dashboard/discussion', icon: UserRound },
  { label: 'Task', href: '/internship/dashboard/tasks', icon: CheckSquare },
  { label: 'Grades', href: '/internship/dashboard/grades', icon: Award },
  { label: 'Certificate', href: '/internship/dashboard/certificate', icon: FileText },
  { label: 'Settings', href: '/internship/dashboard/settings', icon: Settings },
  { label: 'Explore courses', href: '/student/', icon: BookOpen },
]

type InternshipProfile = {
  name: string | null
  avatarUrl: string | null
  tier: 'Free' | 'Premium'
}


export default function InternshipSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/internship/dashboard'

const [profile, setProfile] = useState<InternshipProfile>({
    name: null,
    avatarUrl: null,
    tier: 'Free'
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/internship/profile', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to load intern profile')
        }

        const data = await response.json()

        setProfile({
          name: data.name ?? null,
          avatarUrl: data.avatarUrl ?? null,
          tier: data.tier === 'Premium' ? 'Premium' : 'Free'
        })
      } catch (error) {
        console.error('Failed to load intern profile:', error)
      }
    }

    loadProfile()
  }, [])

  const internName = profile.name || 'Intern'
  const internAvatar =
    profile.avatarUrl || '/avatar-placeholder.png'
    const isPremium = profile.tier === 'Premium'

  return (
    <div className="flex h-full w-full flex-col rounded-[28px] bg-[#1C1D52] px-3 py-6 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)] sm:px-4 sm:py-8">
      <div className="px-2 text-center">
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${isPremium ? 'bg-[#5FBB46] text-[#14204f]' : 'bg-white/10 text-white/70'}`}>
          {isPremium && <Crown className="h-3 w-3" />}
          {profile.tier}
        </span>
        <div className="mb-4 flex justify-center">
          <img
            src={internAvatar}
            alt={`${internName} Avatar`}
            className="h-[88px] w-[88px] rounded-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold tracking-tight">{profile.name}</h3>
        <p className="mt-1 text-sm font-medium text-white/55">Intern</p>
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

      {!isPremium && (
        <Link href="/internship/premium" onClick={onNavigate} className="mb-1 flex items-center gap-3 rounded-2xl bg-[#5FBB46]/15 px-3 py-2.5 text-xs font-semibold text-[#9be28a] transition hover:bg-[#5FBB46]/25 sm:px-4 sm:py-3 sm:text-sm">
        <Crown className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={1.75} /><span>Upgrade</span>
      </Link>
      )}

      <Link href="/internship/dashboard/logout" onClick={onNavigate} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium text-white/90 transition hover:bg-white/10 sm:px-4 sm:py-3 sm:text-sm"><LogOut className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={1.75} /><span>Log Out</span></Link>
    </div>
  )
}
