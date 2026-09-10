'use client'

import { AlertCircle, Check, CheckCircle2, ChevronRight, Clock3, CreditCard, GraduationCap, Loader2, LockKeyhole, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { defaultInternshipState, formatNaira, internshipPrograms, internshipStorageKey } from '@/lib/internship'

export default function InternshipEnrollPage() {
  const [selected, setSelected] = useState('')
  const [activePlan, setActivePlan] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState('')
  const activeProgram = internshipPrograms.find((program) => program.slug === activePlan)

  useEffect(() => {
    document.body.style.overflow = activeProgram ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeProgram])

  const selectPlan = (slug: string) => {
    const current = typeof window !== 'undefined' ? window.localStorage.getItem(internshipStorageKey) : null
    const state = current ? { ...defaultInternshipState, ...JSON.parse(current) } : defaultInternshipState
    window.localStorage.setItem(internshipStorageKey, JSON.stringify({ ...state, programSlug: slug, paymentStatus: 'PENDING', assessmentStatus: 'LOCKED' }))
    setSelected(slug)
    setActivePlan(slug)
    setPaymentStatus('idle')
    setPaymentError('')
  }

  const payNow = async () => {
    if (!activeProgram) return
    setPaymentStatus('loading')
    setPaymentError('')
    try {
      const response = await fetch('/api/internship/payment/initialize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ programSlug: activeProgram.slug, email: 'student@grouhacademy.com' }) })
      const data = await response.json()
      if (!response.ok || !data.authorization_url) throw new Error(data.message || 'Payment could not be initialized.')
      window.location.href = data.authorization_url
    } catch (error) {
      setPaymentStatus('error')
      setPaymentError(error instanceof Error ? error.message : 'Payment could not be initialized. Please try again.')
    }
  }

  const closePayment = () => {
    if (paymentStatus !== 'loading') setActivePlan('')
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-6">
      <section className="rounded-3xl bg-[#1C1D52] px-6 py-8 text-white shadow-[0_12px_32px_rgba(28,29,82,0.16)] sm:px-10 sm:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">Internship workspace</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Choose the internship experience that fits your next step.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Every plan begins with an assessment. Choose a program below to continue to payment and start your enrollment.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-3">
        {internshipPrograms.filter((program) => program.status === 'PUBLISHED').map((program, index) => (
          <article key={program.slug} className={`relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6 ${index === 1 ? 'ring-2 ring-[#5FBB46]' : ''}`}>
            {index === 1 && <span className="absolute -top-3 left-5 rounded-full bg-[#5FBB46] px-3 py-1 text-[10px] font-bold text-[#14204f]">Most popular</span>}
            <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">{program.duration}</p><h2 className="mt-2 text-xl font-bold text-[#1C1D52]">{program.name}</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><GraduationCap className="h-5 w-5" /></span></div>
            <p className="mt-4 min-h-16 text-xs leading-5 text-slate-500">{program.description}</p>
            <p className="mt-5 text-3xl font-bold text-[#1C1D52]">{formatNaira(program.price)}<span className="ml-1 text-[10px] font-medium text-slate-400">total</span></p>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">{program.features.map((feature) => <p key={feature} className="flex gap-2 text-xs text-slate-600"><Check className="h-4 w-4 shrink-0 text-[#5FBB46]" />{feature}</p>)}</div>
            <div className="mt-5 grid grid-cols-2 gap-2 text-[10px] text-slate-500"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{program.duration}</span><span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{program.communityAvailability ? 'Community' : 'Solo support'}</span></div>
            <button type="button" onClick={() => selectPlan(program.slug)} className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold ${selected === program.slug ? 'bg-[#e8f7eb] text-[#397d3a]' : 'bg-[#5FBB46] text-[#14204f]'}`}>{selected === program.slug ? 'Plan selected' : 'Select plan'}<ChevronRight className="h-4 w-4" /></button>
          </article>
        ))}
      </div>

      {activeProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#11132f]/75 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-8" role="dialog" aria-modal="true" aria-labelledby="payment-modal-title">
          <div className="mx-auto flex min-h-full max-w-4xl items-center justify-center">
            <section className="relative w-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <button type="button" onClick={closePayment} disabled={paymentStatus === 'loading'} className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close payment"><X className="h-5 w-5" /></button>
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="bg-[#1C1D52] px-6 py-8 text-white sm:px-10 sm:py-10"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">Confirm your plan</p><h2 id="payment-modal-title" className="mt-3 max-w-md text-3xl font-bold tracking-tight">You&apos;re one step away from getting started.</h2><p className="mt-4 max-w-md text-sm leading-6 text-white/70">Review your internship selection below. You will be securely redirected to Paystack to complete payment.</p><div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be28a]">Selected program</p><h3 className="mt-2 text-xl font-bold">{activeProgram.name}</h3><p className="mt-1 text-xs text-white/60">{activeProgram.duration}</p></div><GraduationCap className="h-6 w-6 text-[#9be28a]" /></div><p className="mt-5 text-xs leading-5 text-white/65">{activeProgram.description}</p><div className="mt-5 space-y-3 border-t border-white/10 pt-5">{activeProgram.features.map((feature) => <p key={feature} className="flex gap-2 text-xs text-white/75"><Check className="h-4 w-4 shrink-0 text-[#9be28a]" />{feature}</p>)}</div></div></div>
                <div className="px-6 py-8 sm:px-10 sm:py-10"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><CreditCard className="h-5 w-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Secure payment</p><h3 className="mt-1 text-lg font-bold text-[#1C1D52]">Payment summary</h3></div></div><div className="mt-7 space-y-4 rounded-2xl bg-[#f8fbff] p-5 text-xs"><p className="flex justify-between gap-4 text-slate-500"><span>Student</span><strong className="text-right text-[#1C1D52]">Aster Seawalker</strong></p><p className="flex justify-between gap-4 text-slate-500"><span>Registered email</span><strong className="break-all text-right text-[#1C1D52]">student@grouhacademy.com</strong></p><p className="flex justify-between gap-4 text-slate-500"><span>Duration</span><strong className="text-[#1C1D52]">{activeProgram.duration}</strong></p><div className="border-t border-slate-200 pt-4"><p className="flex items-end justify-between gap-4"><span className="font-semibold text-[#1C1D52]">Total</span><strong className="text-2xl text-[#1C1D52]">{formatNaira(activeProgram.price)}</strong></p></div></div>{paymentStatus === 'error' && <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{paymentError}</span></div>}<button type="button" onClick={payNow} disabled={paymentStatus === 'loading'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-4 py-3.5 text-xs font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70">{paymentStatus === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" />Connecting to Paystack...</> : <><LockKeyhole className="h-4 w-4" />Pay {formatNaira(activeProgram.price)}</>} </button><p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-[#5FBB46]" />Payment is verified securely before assessment access.</p><button type="button" onClick={closePayment} disabled={paymentStatus === 'loading'} className="mt-5 w-full text-center text-xs font-semibold text-slate-500 hover:text-[#1C1D52] disabled:opacity-50">Cancel and return to plans</button></div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
