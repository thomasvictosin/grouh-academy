'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import InternshipSidebar from './InternshipSidebar'
import StudentHeader from './StudentHeader'
import { Menu, X, LockKeyhole, Loader2, AlertCircle } from 'lucide-react'

const POPUP_DELAY_MS = 25000

// Routes reachable before the acceptance fee is paid — the onboarding →
// assessment → results funnel (Phase 2 builds these pages) plus the
// payment pages themselves. Everything else in /internship is gated.
const EXEMPT_PREFIXES = ['/internship/onboarding', '/internship/assessment', '/internship/results', '/internship/payment']

type AccessStatus = {
  hasApplication: boolean
  acceptanceFeePaid: boolean
  programName: string | null
  acceptanceFeeAmount: number | null
  currency: string | null
}

export default function InternshipShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [status, setStatus] = useState<AccessStatus | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const pathname = usePathname() || '/internship/dashboard'
  const popupTimer = useRef<number | null>(null)

  const isExemptRoute = EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  useEffect(() => {
    fetch('/api/internship/access-status')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: AccessStatus | null) => setStatus(data))
      .finally(() => setLoadingStatus(false))
  }, [])

  useEffect(() => {
    if (popupTimer.current) window.clearTimeout(popupTimer.current)
    setShowPaywall(false)

    if (isExemptRoute || !status?.hasApplication || status.acceptanceFeePaid) {
      return
    }

    popupTimer.current = window.setTimeout(() => setShowPaywall(true), POPUP_DELAY_MS)
    return () => {
      if (popupTimer.current) window.clearTimeout(popupTimer.current)
    }
  }, [status, isExemptRoute, pathname])

  async function payAcceptanceFee() {
    setPaying(true)
    setPayError('')
    try {
      const response = await fetch('/api/internship/payment/initialize', { method: 'POST' })
      const data = await response.json()
      if (!response.ok || !data.authorization_url) throw new Error(data.message || 'Payment could not be initialized.')
      window.location.href = data.authorization_url
    } catch (error) {
      setPayError(error instanceof Error ? error.message : 'Payment could not be initialized. Please try again.')
      setPaying(false)
    }
  }

  if (loadingStatus) {
    return <div className="flex min-h-dvh items-center justify-center bg-[#F0F7FF] px-6"><div className="rounded-2xl bg-white px-6 py-5 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><Loader2 className="mx-auto h-7 w-7 animate-spin text-[#5FBB46]" /><p className="mt-3 text-xs font-semibold text-[#1C1D52]">Checking internship access...</p></div></div>
  }

  return (
    <div className="fixed inset-0 z-20 flex flex-col overflow-hidden bg-[#F0F7FF]">
      <header className="z-30 w-full shrink-0 bg-[#F0F7FF] px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden" aria-label="Toggle menu">{sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}</button>
          <div className="min-w-0 flex-1"><StudentHeader /></div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-5 overflow-hidden px-3 pb-3 sm:px-5 lg:gap-6 lg:px-6">
        <aside className="hidden h-full w-[248px] shrink-0 md:flex"><InternshipSidebar /></aside>
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto py-2">{children}</main>
      </div>

      <aside className={`fixed inset-y-4 left-4 z-50 w-[calc(100vw-2rem)] max-w-64 transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}`}><InternshipSidebar onNavigate={() => setSidebarOpen(false)} /></aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/50 md:hidden" />}

      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#11132f]/90 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <LockKeyhole className="mx-auto h-10 w-10 text-[#5FBB46]" />
            <h2 className="mt-4 text-xl font-bold text-[#1C1D52]">Acceptance fee required to continue</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your application has been approved, and you are now ready to begin your internship. To unlock the full internship workspace and continue with your program,
              please pay your one-time acceptance fee of{' '}
              <strong className="text-[#1C1D52]">{status?.acceptanceFeeAmount ? `₦${status.acceptanceFeeAmount.toLocaleString()}` : 'the acceptance fee'}</strong>.
            </p>
            {payError && <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{payError}</span></div>}
            <button
              type="button"
              onClick={payAcceptanceFee}
              disabled={paying}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-4 py-3.5 text-sm font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70"
            >
              {paying ? <><Loader2 className="h-4 w-4 animate-spin" />Connecting to Paystack...</> : 'Pay Acceptance Fee'}
            </button>
            <p className="mt-4 text-[10px] text-slate-400">This screen stays active until your payment is confirmed and your internship workspace is unlocked.</p>
          </div>
        </div>
      )}
    </div>
  )
}
