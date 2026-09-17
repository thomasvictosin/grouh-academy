'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import InstructorSidebar from './InstructorSidebar'
import StudentHeader from './StudentHeader'
import InstructorHeader from './InstructorHeader'

export default function InstructorShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#F0F7FF]">
      {/* Header */}
      <header className="z-30 w-full shrink-0 bg-[#F0F7FF] px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Toggle instructor menu"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <InstructorHeader />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-3 pb-3 sm:px-5 lg:gap-6 lg:px-6">
        {/* Desktop sidebar */}
        <aside className="hidden h-full w-[248px] shrink-0 md:flex">
          <InstructorSidebar />
        </aside>

        {/* Page content */}
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-2">
          {children}
        </main>
      </div>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-64 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
        }`}
      >
        <InstructorSidebar
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50"
        />
      )}
    </div>
  )
}