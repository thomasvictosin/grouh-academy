'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import MentorSidebar from './MentorSidebar'
import StudentHeader from './StudentHeader'

export default function MentorShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-[#F0F7FF]"><header className="fixed inset-x-0 top-0 z-30 h-[72px] w-full bg-[#F0F7FF] px-3 py-3 sm:px-6 lg:px-8"><div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setSidebarOpen((value) => !value)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden" aria-label="Toggle mentor menu">{sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button><div className="min-w-0 flex-1"><StudentHeader name="Mentor" /></div></div></header><div className="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden px-3 pb-3 pt-[80px] sm:gap-5 sm:px-5 sm:pb-4 sm:pt-[72px] lg:gap-6 lg:px-6"><aside className="fixed left-4 top-[72px] z-20 hidden h-[calc(100dvh-88px)] w-[248px] overflow-hidden sm:left-5 lg:left-6 md:flex"><MentorSidebar /></aside><main className="min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto py-2 sm:py-2 md:ml-[268px] lg:ml-[272px]">{children}</main></div><aside className={`fixed inset-y-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}><MentorSidebar onNavigate={() => setSidebarOpen(false)} /></aside>{sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />}</div>
}
