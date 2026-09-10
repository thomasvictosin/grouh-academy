'use client'

import { ArrowLeft, CheckCircle2, MessageSquareText, Save } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

export default function InternshipApplicationReviewPage() {
  const params = useParams<{ slug: string }>()
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="mx-auto max-w-[900px] space-y-5 p-6">
      <Link href="/admin/internship/applications" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Review</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{params.slug}</h1>
          </div>
          <button type="button" onClick={() => setSubmitted(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Save decision
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block text-[10px] font-semibold text-slate-500">
            Recommendation
            <select defaultValue="Shortlist" className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              <option>Shortlist</option>
              <option>Request updates</option>
              <option>Reject</option>
            </select>
          </label>
          <label className="block text-[10px] font-semibold text-slate-500">
            Track allocation
            <select defaultValue="Product Design" className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              <option>Product Design</option>
              <option>Software Development</option>
              <option>Data Analytics</option>
            </select>
          </label>
        </div>

        <label className="mt-6 block text-[10px] font-semibold text-slate-500">
          Review notes
          <textarea defaultValue="Strong portfolio and thoughtful design rationale. A few areas need clarifying before final acceptance." className="mt-2 block min-h-[140px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
        </label>

        {submitted && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8faf7] p-3 text-[10px] font-semibold text-teal-700">
            <CheckCircle2 className="h-4 w-4" />
            Decision saved and ready for follow-up.
          </div>
        )}
      </section>
    </div>
  )
}
