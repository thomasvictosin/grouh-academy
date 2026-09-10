'use client'

import { AlertCircle, ArrowLeft, CheckCircle2, CreditCard, Loader2, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { defaultInternshipState, formatNaira, internshipPrograms, internshipStorageKey } from '@/lib/internship'

export default function InternshipPaymentPage() {
  const [planSlug, setPlanSlug] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const program = internshipPrograms.find((item) => item.slug === planSlug)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requested = params.get('plan')
    const saved = window.localStorage.getItem(internshipStorageKey)
    const savedSlug = saved ? JSON.parse(saved).programSlug : ''
    setPlanSlug(requested || savedSlug || '')
  }, [])

  const payNow = async () => {
    if (!program) return
    setStatus('loading')
    setError('')
    try {
      const response = await fetch('/api/internship/payment/initialize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ programSlug: program.slug, email: 'student@grouhacademy.com' }) })
      const data = await response.json()
      if (!response.ok || !data.authorization_url) throw new Error(data.message || 'Payment could not be initialized.')
      window.location.href = data.authorization_url
    } catch (paymentError) {
      setStatus('error')
      setError(paymentError instanceof Error ? paymentError.message : 'Payment could not be initialized. Please try again.')
    }
  }

  if (!program) return <EmptyPaymentState />

  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <Link href="/internship/enroll" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to plans</Link>
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-8">
        <div className="flex items-start gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><CreditCard className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Secure enrollment</p><h1 className="mt-1 text-2xl font-bold text-[#1C1D52]">Complete your internship payment</h1><p className="mt-1 text-xs text-slate-500">Your payment is securely processed by Paystack.</p></div></div>
        <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4 sm:p-5"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Selected program</p><h2 className="mt-2 text-lg font-bold text-[#1C1D52]">{program.name}</h2><p className="mt-1 text-xs text-slate-500">{program.duration} · {program.description}</p><div className="mt-5 space-y-3 text-xs text-slate-600"><p className="flex justify-between gap-4"><span>Student</span><strong className="text-[#1C1D52]">Aster Seawalker</strong></p><p className="flex justify-between gap-4"><span>Registered email</span><strong className="break-all text-[#1C1D52]">student@grouhacademy.com</strong></p><p className="flex justify-between gap-4"><span>Payment status</span><span className="font-semibold text-amber-600">Pending</span></p></div></div>
          <div className="rounded-xl bg-[#1C1D52] p-5 text-white"><p className="text-xs font-semibold text-white/70">Payment summary</p><div className="mt-5 flex items-end justify-between gap-3"><span className="text-xs text-white/70">Total amount</span><strong className="text-2xl">{formatNaira(program.price)}</strong></div><p className="mt-3 text-[10px] leading-5 text-white/55">This payment unlocks your internship assessment attempt and program enrollment.</p><button type="button" onClick={payNow} disabled={status === 'loading'} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70">{status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" />Connecting to Paystack...</> : <><LockKeyhole className="h-4 w-4" />Pay now</>}</button></div>
        </div>
        {status === 'error' && <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><div><p className="font-bold">Payment could not start</p><p className="mt-1">{error}</p><button type="button" onClick={payNow} className="mt-3 font-bold underline">Retry payment</button></div></div>}
        <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-[#5FBB46]" />Payment status is verified server-side before assessment access is granted.</div>
      </section>
    </div>
  )
}

function EmptyPaymentState() {
  return <div className="mx-auto max-w-[700px] rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><AlertCircle className="mx-auto h-8 w-8 text-amber-500" /><h1 className="mt-4 text-xl font-bold text-[#1C1D52]">Select an internship plan first</h1><p className="mt-2 text-sm text-slate-500">We could not find a selected program for this payment.</p><Link href="/internship/enroll" className="mt-5 inline-flex rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">Choose a plan</Link></div>
}
