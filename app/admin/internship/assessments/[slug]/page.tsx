'use client'

import { ArrowLeft, CheckCircle2, ClipboardCheck, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const assessmentDetailData: Record<string, any> = {
  'asm-201': { id: 'ASM-201', title: 'Assessment Alpha', track: 'Software Development', status: 'Active', submissions: 27, due: '2026-09-15', rubric: 'Portfolio, logic exercises, mentor review' },
  'asm-202': { id: 'ASM-202', title: 'Assessment Beta', track: 'Product Design', status: 'In review', submissions: 19, due: '2026-09-17', rubric: 'UX critique, case study, presentation' },
  'asm-203': { id: 'ASM-203', title: 'Assessment Gamma', track: 'Data Analytics', status: 'Draft', submissions: 12, due: '2026-09-18', rubric: 'Dashboard analysis, SQL task, report writing' },
}

export default function AssessmentDetailPage() {
  const params = useParams<{ slug: string }>()
  const assessment = assessmentDetailData[params.slug] ?? assessmentDetailData['asm-201']

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/assessments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to assessments
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Assessment</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{assessment.title}</h1>
          </div>
          <span className="rounded-full bg-[#e8faf7] px-2.5 py-1 text-[9px] font-semibold text-teal-600">{assessment.status}</span>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] bg-[#f8fbff] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Rubric</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{assessment.rubric}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Track</span><span className="font-semibold text-[#1C1D52]">{assessment.track}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Submissions</span><span className="font-semibold text-[#1C1D52]">{assessment.submissions}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Due date</span><span className="font-semibold text-[#1C1D52]">{assessment.due}</span></p>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#f3f6fb] p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Quick actions</p>
              <div className="mt-4 space-y-2">
                <Link href="/admin/internship/assessments/new" className="block rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Duplicate assessment</Link>
                <Link href="/admin/internship/interns" className="block rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Review learners</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
