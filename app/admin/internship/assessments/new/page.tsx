'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-[1000px] space-y-5 p-6">
      <Link href="/admin/internship/assessments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to assessments
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">New assessment</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">Create internship assessment</h1>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Publish assessment
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Assessment title" value="Assessment Delta" />
          <Field label="Track" value="Product Design" />
          <Field label="Due date" value="2026-09-20" />
          <Field label="Assessment type" value="Portfolio review" />
        </div>
        <label className="mt-6 block text-[10px] font-semibold text-slate-500">
          Instructions
          <textarea defaultValue="Review portfolio submissions, provide rubric scoring, and share feedback with learners." className="mt-2 block min-h-[140px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
        </label>
      </section>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-[10px] font-semibold text-slate-500">
      {label}
      <input defaultValue={value} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
    </label>
  )
}
