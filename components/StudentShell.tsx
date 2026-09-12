"use client"

import React, { useState } from 'react'
import StudentSidebar from './StudentSidebar'
import StudentHeader from './StudentHeader'
import { Menu, X } from 'lucide-react'

export default function StudentShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#F0F7FF]">
      <header className="z-30 w-full shrink-0 bg-[#F0F7FF] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="min-w-0 flex-1">
            <StudentHeader />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-3 pb-3 sm:px-5 lg:gap-6 lg:px-6">
        <aside className="hidden h-full w-[248px] shrink-0 md:flex">
          <StudentSidebar />
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-2">
          {children}
        </main>
      </div>

      <aside
        className={`
          fixed z-50 md:hidden
          inset-y-4 left-4 w-[calc(100vw-2rem)] max-w-64
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}
      >
        <StudentSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}
    </div>
  )
}
