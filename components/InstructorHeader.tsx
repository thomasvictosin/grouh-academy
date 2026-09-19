"use client"

import React, { useEffect, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type HeaderProfile = { name: string | null; avatarUrl: string | null }

export default function InstructorHeader() {
  const [showSearch, setShowSearch] = useState(false)
  const [profile, setProfile] = useState<HeaderProfile>({ name: null, avatarUrl: null })
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  
  useEffect(() => {
    fetch('/api/instructor/profile', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setProfile({ name: data.name ?? null, avatarUrl: data.avatarUrl ?? null })
      })
      .catch((error) => console.error('Failed to load header profile:', error))

    fetch('/api/student/notifications/unread-count', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setUnreadCount(data.count ?? 0)
      })
      .catch((error) => console.error('Failed to load notification count:', error))
  }, [])

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = searchQuery.trim()
    router.push(trimmed ? `/student/explore-courses?q=${encodeURIComponent(trimmed)}` : '/student/explore-courses')
    setShowSearch(false)
  }

  const displayName = profile.name || 'Instructor'
  const avatarSrc = profile.avatarUrl || '/avatar-placeholder.png'

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
          <form onSubmit={handleSearchSubmit} className="relative hidden w-full max-w-[240px] md:block lg:max-w-[280px]">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full bg-[#EEF1F6] py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#5FBB46]/30"
              placeholder="Search course"
            />
          </form>

          <button
            onClick={() => setShowSearch((s) => !s)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/student/notifications"
            className="relative rounded-full p-1.5 text-gray-800 hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          <Image
            src={avatarSrc}
            alt={`${displayName} avatar`}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
          />
        </div>
      </div>

      {showSearch && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[92%] -translate-x-1/2 transform rounded-2xl bg-white p-3 shadow-lg md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative block">
            <span className="sr-only">Search</span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-full bg-[#EEF1F6] py-2.5 pl-9 pr-3 text-sm placeholder-gray-400 outline-none"
              placeholder="Search course"
              autoFocus
            />
          </form>
        </div>
      )}
    </div>
  )
}
