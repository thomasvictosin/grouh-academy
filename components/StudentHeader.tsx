"use client"

import React, { useState } from 'react'
import { Bell, ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function StudentHeader({ name = 'Student' }: { name?: string }) {
  const [showSearch, setShowSearch] = useState(false)
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const pathname = usePathname() || '/'
  const isMentorWorkspace = pathname.startsWith('/mentor')
  const isInternshipWorkspace = pathname.startsWith('/internship')
  const workspaceName = isMentorWorkspace ? 'Mentor Workspace' : isInternshipWorkspace ? 'Internship Workspace' : 'Student Workspace'

  return (
    <div className="relative">
      <div className="flex w-full items-center justify-between gap-4">
        <Link href="/student" className="inline-flex flex-shrink-0 items-center">
          <Image
            src={logo}
            alt="Grouh Academy logo"
            width={104}
            height={62}
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowWorkspaceMenu((current) => !current)}
              aria-expanded={showWorkspaceMenu}
              aria-haspopup="menu"
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[0_4px_14px_rgba(28,29,82,0.08)] transition hover:shadow-md sm:px-4"
            >
              <span className="hidden sm:inline">{workspaceName}</span>
              <span className="sm:hidden">{isMentorWorkspace ? 'Mentor' : isInternshipWorkspace ? 'Internship' : 'Student'}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showWorkspaceMenu ? 'rotate-180' : ''}`} />
            </button>
            {showWorkspaceMenu && (
              <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl bg-white p-1.5 shadow-[0_10px_28px_rgba(28,29,82,0.16)]">
                <Link href="/student" role="menuitem" onClick={() => setShowWorkspaceMenu(false)} className={`block rounded-lg px-3 py-2 text-xs font-semibold ${!isInternshipWorkspace && !isMentorWorkspace ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] hover:bg-slate-50'}`}>Student Workspace</Link>
                <Link href="/internship/enroll" role="menuitem" onClick={() => setShowWorkspaceMenu(false)} className={`mt-1 block rounded-lg px-3 py-2 text-xs font-semibold ${isInternshipWorkspace ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] hover:bg-slate-50'}`}>Internship Workspace</Link>
                <Link href="/mentor" role="menuitem" onClick={() => setShowWorkspaceMenu(false)} className={`mt-1 block rounded-lg px-3 py-2 text-xs font-semibold ${isMentorWorkspace ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] hover:bg-slate-50'}`}>Mentor Workspace</Link>
              </div>
            )}
          </div>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/internship"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Internship
            </Link>
            <Link
              href="/courses"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Courses
            </Link>
          </nav>

          <label className="relative hidden w-full max-w-[240px] md:block lg:max-w-[280px]">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              className="w-full rounded-full bg-[#EEF1F6] py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5FBB46]/30"
              placeholder="Search course"
            />
          </label>

          <button
            onClick={() => setShowSearch((s) => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            className="relative rounded-full p-1.5 text-gray-800 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              1
            </span>
          </button>

          <img
            src="/avatar-placeholder.png"
            alt={`${name} avatar`}
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
          />
        </div>
      </div>

      {showSearch && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[92%] -translate-x-1/2 transform rounded-2xl bg-white p-3 shadow-lg md:hidden">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              className="w-full rounded-full bg-[#EEF1F6] py-2.5 pl-9 pr-3 text-sm placeholder-gray-400 outline-none"
              placeholder="Search course"
              autoFocus
            />
          </label>
        </div>
      )}
    </div>
  )
}
