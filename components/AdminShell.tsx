'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ workspace, children }: { workspace: 'student' | 'internship'; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#edf3ff] text-[#1C1D52]">
      <div className="relative z-30 shrink-0">
        <AdminHeader workspace={workspace} />
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle admin navigation"
          className="absolute left-3 top-3 z-40 rounded-lg bg-[#1C1D52] p-2 text-white md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-3 pb-3 sm:px-5 lg:gap-6 lg:px-6">
        <AdminSidebar workspace={workspace} />
        {mobileOpen && (
          <>
            <div className="fixed inset-0 z-30 bg-[#1C1D52]/50 md:hidden" onClick={() => setMobileOpen(false)} />
            <AdminSidebar workspace={workspace} mobile />
          </>
        )}
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-2">
          {children}
        </main>
      </div>
    </div>
  )
}
