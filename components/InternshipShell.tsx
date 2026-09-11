'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import InternshipSidebar from './InternshipSidebar'
import StudentHeader from './StudentHeader'
import { Menu, X } from 'lucide-react'
import { defaultInternshipState, internshipStorageKey } from '@/lib/internship'

export default function InternshipShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accessChecked, setAccessChecked] = useState(false)
  const pathname = usePathname() || '/internship/dashboard'
  const router = useRouter()
  const isEnrollmentRoute = pathname.startsWith('/internship/enroll')
  const isPaymentRoute = pathname.startsWith('/internship/payment')
  const isDevelopmentPreview = process.env.NODE_ENV !== 'production'

  useEffect(() => {
    const saved = window.localStorage.getItem(internshipStorageKey)
    const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState
    const canAccessProtectedRoute = state.paymentStatus === 'PAID'

    if (!isDevelopmentPreview && !isEnrollmentRoute && !isPaymentRoute && !canAccessProtectedRoute) {
      router.replace('/internship/enroll')
      return
    }

    const accessCheck = window.setTimeout(() => setAccessChecked(true), 0)
    return () => window.clearTimeout(accessCheck)
  }, [isDevelopmentPreview, isEnrollmentRoute, isPaymentRoute, router])

  if (!accessChecked) {
    return <div className="flex min-h-dvh items-center justify-center bg-[#F0F7FF] px-6"><div className="rounded-2xl bg-white px-6 py-5 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-[#5FBB46]" /><p className="mt-3 text-xs font-semibold text-[#1C1D52]">Checking internship access...</p></div></div>
  }

  return (
    <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-[#F0F7FF]">
      <header className="fixed inset-x-0 top-0 z-30 h-[72px] w-full shrink-0 bg-[#F0F7FF] px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden" aria-label="Toggle menu">{sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          <div className="min-w-0 flex-1"><StudentHeader name="Intern" /></div>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden px-3 pb-3 pt-[80px] sm:gap-5 sm:px-5 sm:pb-4 sm:pt-[72px] lg:gap-6 lg:px-6">
        <aside className="fixed left-4 top-[72px] z-20 hidden h-[calc(100dvh-88px)] w-[248px] overflow-hidden sm:left-5 lg:left-6 md:flex"><InternshipSidebar /></aside>
        <main className="min-h-0 min-w-0 w-full flex-1 overflow-x-hidden overflow-y-auto py-2 sm:py-2 md:ml-[268px] lg:ml-[272px]">{children}</main>
      </div>

      <aside className={`fixed inset-y-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}><InternshipSidebar onNavigate={() => setSidebarOpen(false)} /></aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />}
    </div>
  )
}
