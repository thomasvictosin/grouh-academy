'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

export default function AdminShell({ workspace, children }: { workspace: 'student' | 'internship'; children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return <div className="min-h-dvh min-w-0 overflow-x-hidden bg-[#edf3ff] text-[#1C1D52]"><AdminHeader workspace={workspace} /><button type="button" onClick={() => setMobileOpen((current) => !current)} aria-label="Toggle admin navigation" className="fixed left-3 top-3 z-40 rounded-lg bg-[#1C1D52] p-2 text-white md:hidden">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button><AdminSidebar workspace={workspace} />{mobileOpen && <><div className="fixed inset-0 z-30 bg-[#1C1D52]/50 md:hidden" onClick={() => setMobileOpen(false)} /><AdminSidebar workspace={workspace} mobile /></>}<main className="min-h-dvh min-w-0 px-3 pb-6 pt-[84px] sm:px-5 sm:pb-8 sm:pt-[88px] md:ml-[268px] md:pt-[88px] lg:ml-[272px] lg:px-6">{children}</main></div>
}
