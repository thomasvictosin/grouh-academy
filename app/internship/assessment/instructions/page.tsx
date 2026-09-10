'use client'

import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { defaultInternshipState, internshipStorageKey } from '@/lib/internship'

export default function AssessmentInstructionsPage() {
  useEffect(() => {
    const saved = window.localStorage.getItem(internshipStorageKey)
    const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState
    if (state.paymentStatus !== 'PAID') window.location.href = '/internship/assessment/readiness'
    if (state.assessmentStatus === 'UNDER_REVIEW') window.location.href = '/internship/assessment/submitted'
  }, [])

  return <div className="mx-auto max-w-[820px] space-y-5"><Link href="/internship/assessment/readiness" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Back to readiness</Link><section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5FBB46]">Before you begin</p><h1 className="mt-2 text-3xl font-bold text-[#1C1D52]">Assessment instructions</h1><p className="mt-3 text-sm leading-6 text-slate-500">Please read these rules carefully. Your assessment attempt is tied to the payment that unlocked it.</p><div className="mt-7 grid gap-3">{['This assessment is non-time-based. There is no countdown timer.', 'Complete the Objective section first, then continue to the Theory section.', 'Once submitted, this attempt cannot be retaken or reopened.', 'A new attempt requires a new assessment payment.', 'Your outcome will be sent to your registered email within 24 hours after review.'].map((item) => <div key={item} className="flex gap-3 rounded-xl bg-[#f8fbff] p-4 text-sm text-slate-600"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#5FBB46]" />{item}</div>)}</div><div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800"><Info className="h-4 w-4 shrink-0" /><span>When waiting for your result, check your inbox, spam, junk, and promotions folders.</span></div><div className="mt-8 flex justify-end"><Link href="/internship/assessment/objective" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-5 py-3 text-xs font-bold text-[#14204f]">Start assessment<ArrowRight className="h-4 w-4" /></Link></div></section></div>
}
