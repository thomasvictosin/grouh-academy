'use client'

import { Check, ChevronRight, Clock3, GraduationCap, Users } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { formatNaira, internshipPrograms } from '@/lib/internship'

const publishedPrograms = internshipPrograms.filter((program) => program.status === 'PUBLISHED')

export default function InternshipPricing() {
  const [activeSlug, setActiveSlug] = useState(publishedPrograms[1]?.slug ?? publishedPrograms[0]?.slug ?? '')
  const activeProgram = publishedPrograms.find((program) => program.slug === activeSlug) ?? publishedPrograms[0]

  if (!activeProgram) return null

  return (
    <section id="pricing" className="bg-[#F0F7FF] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1180px]">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Internship pricing</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#1C1D52] sm:text-4xl">Choose the pace that fits your next move.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Every option includes practical work, assessment, and a clear path to completion. Choose a duration to see what is included.</p>
        </div>

        <div className="mt-8 inline-flex max-w-full overflow-x-auto rounded-full bg-white p-1 shadow-[0_5px_18px_rgba(28,29,82,0.08)]" role="tablist" aria-label="Internship pricing plans">
          {publishedPrograms.map((program) => <button key={program.slug} type="button" role="tab" aria-selected={program.slug === activeProgram.slug} onClick={() => setActiveSlug(program.slug)} className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition sm:px-6 ${program.slug === activeProgram.slug ? 'bg-[#5FBB46] text-[#14204f]' : 'text-[#1C1D52] hover:bg-[#e8f7eb]'}`}>{program.duration}</button>)}
        </div>

        <div className="mt-6 grid gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-[0_12px_32px_rgba(28,29,82,0.1)] sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div>
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">{activeProgram.duration} experience</p><h3 className="mt-2 text-2xl font-bold text-[#1C1D52] sm:text-3xl">{activeProgram.name}</h3></div><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><GraduationCap className="h-5 w-5" /></span></div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">{activeProgram.description}</p>
            <div className="mt-6 grid gap-3 text-xs text-slate-600 sm:grid-cols-2"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-[#5FBB46]" />{activeProgram.duration}</span><span className="flex items-center gap-2"><Users className="h-4 w-4 text-[#5FBB46]" />{activeProgram.communityAvailability ? 'Community support' : 'Focused support'}</span></div>
          </div>
          <div className="rounded-2xl bg-[#f8fbff] p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Total investment</p><p className="mt-2 text-3xl font-bold text-[#1C1D52]">{formatNaira(activeProgram.price)}</p><div className="mt-5 space-y-3 border-t border-slate-200 pt-5">{activeProgram.features.map((feature) => <p key={feature} className="flex gap-2 text-xs text-slate-600"><Check className="h-4 w-4 shrink-0 text-[#5FBB46]" />{feature}</p>)}</div><Link href="/internship/enroll" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f]">Start with this plan<ChevronRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>
  )
}
