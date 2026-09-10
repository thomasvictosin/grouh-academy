'use client'

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { defaultInternshipState, internshipStorageKey } from '@/lib/internship'

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your payment securely...')

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get('reference')
    if (!reference) { setStatus('error'); setMessage('The payment reference is missing. You can safely retry payment from the payment page.'); return }
    fetch(`/api/internship/payment/verify?reference=${encodeURIComponent(reference)}`).then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      const saved = window.localStorage.getItem(internshipStorageKey)
      const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState
      window.localStorage.setItem(internshipStorageKey, JSON.stringify({ ...state, programSlug: data.programSlug || state.programSlug, paymentStatus: 'PAID', assessmentStatus: 'NOT_STARTED' }))
      setStatus('success')
    }).catch((error) => { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Payment verification failed.') })
  }, [])

  return <div className="mx-auto max-w-[620px] rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]">{status === 'loading' && <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#5FBB46]" />}{status === 'success' && <CheckCircle2 className="mx-auto h-12 w-12 text-[#5FBB46]" />}{status === 'error' && <AlertCircle className="mx-auto h-10 w-10 text-red-500" />}<h1 className="mt-5 text-2xl font-bold text-[#1C1D52]">{status === 'success' ? 'Payment confirmed' : status === 'loading' ? 'Confirming payment' : 'Payment confirmation failed'}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{status === 'success' ? 'Your internship payment has been verified. Continue to assessment readiness.' : message}</p>{status === 'success' ? <Link href="/internship/assessment/readiness" className="mt-6 inline-flex rounded-lg bg-[#5FBB46] px-5 py-3 text-xs font-bold text-[#14204f]">Continue to assessment readiness</Link> : status === 'error' ? <div className="mt-6 flex justify-center gap-3"><Link href="/internship/enroll" className="rounded-lg border border-slate-200 px-4 py-3 text-xs font-bold text-[#1C1D52]">Choose plan</Link><Link href="/internship/payment" className="rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f]">Retry payment</Link></div> : null}</div>
}
