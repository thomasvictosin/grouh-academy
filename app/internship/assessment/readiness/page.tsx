'use client'

import { ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { defaultInternshipState, internshipStorageKey } from '@/lib/internship'

export default function AssessmentReadinessPage() {
  const [allowed, setAllowed] = useState(false)
  useEffect(() => { const saved = window.localStorage.getItem(internshipStorageKey); setAllowed(saved ? ({ ...defaultInternshipState, ...JSON.parse(saved) }).paymentStatus === 'PAID' : false) }, [])
  if (!allowed) return <LockedAssessment />
  return <div className="mx-auto max-w-[760px] space-y-5"><section className="rounded-2xl bg-[#1C1D52] p-7 text-white sm:p-10"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5FBB46] text-[#14204f]"><ClipboardCheck className="h-6 w-6" /></span><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9be28a]">Assessment readiness</p><h1 className="mt-2 text-3xl font-bold">Are you ready to start your assessment?</h1><p className="mt-4 max-w-xl text-sm leading-6 text-white/70">The assessment is required as part of your internship enrollment. You can start now or return to it later from your Internship Dashboard.</p></section><section className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="space-y-3 text-sm text-slate-600"><p className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#5FBB46]" />The assessment has objective and theory sections.</p><p className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#5FBB46]" />There is no countdown timer. Work at your own pace.</p><p className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#5FBB46]" />One paid assessment attempt can only be submitted once.</p></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/internship/assessment/instructions" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f]">Start assessment now<ArrowRight className="h-4 w-4" /></Link><Link href="/internship/dashboard" className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-xs font-bold text-[#1C1D52]">I&apos;ll do this later</Link></div></section></div>
}

function LockedAssessment() { return <div className="mx-auto max-w-[620px] rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><h1 className="text-xl font-bold text-[#1C1D52]">Assessment locked</h1><p className="mt-2 text-sm text-slate-500">Complete and verify your internship payment before accessing the assessment.</p><Link href="/internship/enroll" className="mt-5 inline-flex rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f]">View internship plans</Link></div> }
