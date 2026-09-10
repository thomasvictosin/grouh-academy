"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Archive,
  Calendar,
  BarChart3,
  Award,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import React from 'react'

const navItems = [
  { label: 'Dashboard', href: '/student', icon: LayoutGrid },
  { label: 'My Courses', href: '/student/my-courses', icon: Archive },
  { label: 'Library', href: '/student/library', icon: Calendar },
  { label: 'Store', href: '/student/store', icon: BarChart3 },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Settings', href: '/student/settings', icon: Settings },
  { label: 'Profile', href: '/student/profile', icon: User },
]

export default function StudentSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname() || '/student'

  return (
    <div className="flex h-full w-full flex-col rounded-[28px] bg-[#1C1D52] px-4 py-8 text-white shadow-[0_12px_40px_rgba(28,29,82,0.18)]">
      <div className="px-2 text-center">
        <div className="mb-4 flex justify-center">
          <img
            src="/avatar-placeholder.png"
            alt="Student Avatar"
            className="h-[88px] w-[88px] rounded-full object-cover"
          />
        </div>
        <h3 className="text-base font-semibold tracking-tight">Aster Seawalker</h3>
        <p className="mt-1 text-sm font-medium text-white/55">Student</p>
      </div>

      <nav aria-label="Student sidebar" className="mt-8 flex-1 px-1">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active =
              item.href === '/student'
                ? pathname === '/student'
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#5FBB46] text-white'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto px-1 pt-6">
        <Link
          href="/student/logout"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" strokeWidth={1.75} />
          <span>Log Out</span>
        </Link>
      </div>
    </div>
  )
}
