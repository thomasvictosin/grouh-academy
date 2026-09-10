'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditMentorPage() {
  return (
    <div className="mx-auto max-w-[1000px] space-y-5 p-6">
      <Link href="/admin/internship/mentors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to mentors
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Edit mentor</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">Update mentor details</h1>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">
            <Save className="h-3.5 w-3.5" />
            Save changes
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Full name" value="Maya Brooks" />
          <Field label="Email" value="maya@example.com" />
          <Field label="Track" value="Software Development" />
          <Field label="Capacity" value="7 interns" />
        </div>
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
