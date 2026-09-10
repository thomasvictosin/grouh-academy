'use client'

import { ArrowLeft, BriefcaseBusiness, CheckCircle2, Download } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const applicationDetailData: Record<string, any> = {
  'app-1201': { id: 'APP-1201', name: 'Chinedu Adebayo', track: 'Product Design', source: 'Website', date: '2026-09-08', status: 'Pending', email: 'chinedu@example.com', note: 'Applied for Product Design track and submitted a portfolio case study.' },
  'app-1202': { id: 'APP-1202', name: 'Ada Nwosu', track: 'Software Development', source: 'Referral', date: '2026-09-07', status: 'Reviewed', email: 'ada@example.com', note: 'Strong foundation in JavaScript and team work. Recommended for shortlisted review.' },
  'app-1203': { id: 'APP-1203', name: 'Tobi Akin', track: 'Data Analytics', source: 'LinkedIn', date: '2026-09-06', status: 'Pending', email: 'tobi@example.com', note: 'Submitted analytics sample and interest in educational data projects.' },
  'app-1204': { id: 'APP-1204', name: 'Joy Eze', track: 'Product Design', source: 'Website', date: '2026-09-05', status: 'Accepted', email: 'joy@example.com', note: 'Accepted after mentor interview and portfolio review.' },
}

export default function InternshipApplicationDetailPage() {
  const params = useParams<{ slug: string }>()
  const application = applicationDetailData[params.slug] ?? applicationDetailData['app-1201']

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/applications" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Application</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{application.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#fff0d8] px-2.5 py-1 text-[9px] font-semibold text-orange-600">{application.status}</span>
            <Link href={`/admin/internship/applications/${params.slug}/review`} className="rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]">Review application</Link>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] bg-[#f8fbff] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Application notes</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{application.note}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Applicant details</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Track</span><span className="font-semibold text-[#1C1D52]">{application.track}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Source</span><span className="font-semibold text-[#1C1D52]">{application.source}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Date</span><span className="font-semibold text-[#1C1D52]">{application.date}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Email</span><span className="font-semibold text-[#1C1D52]">{application.email}</span></p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-[#f3f6fb] p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Actions</p>
              <div className="mt-4 space-y-2">
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]">
                  <Download className="h-3.5 w-3.5" />
                  Download CV
                </button>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  Schedule interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
