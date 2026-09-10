'use client'

import { ArrowLeft, CheckCircle2, ClipboardCheck, Clock3, MessageSquareText, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const internDetailData: Record<string, any> = {
  'int-1001': { id: 'INT-1001', name: 'Amaka Okafor', track: 'Software Development', assessment: 'Assessment Alpha', mentor: 'Maya Brooks', progress: '78%', status: 'On track', email: 'amaka.okafor@example.com', date: '2026-09-01', tasks: 12, score: '86%', nextMilestone: 'Frontend dashboard review' },
  'int-1002': { id: 'INT-1002', name: 'Daniel Mensah', track: 'Product Design', assessment: 'Assessment Beta', mentor: 'Grace Sanni', progress: '61%', status: 'Needs attention', email: 'daniel.mensah@example.com', date: '2026-09-02', tasks: 9, score: '72%', nextMilestone: 'Wireframe critique' },
  'int-1003': { id: 'INT-1003', name: 'Ifeoma Nwosu', track: 'Software Development', assessment: 'Assessment Alpha', mentor: 'Maya Brooks', progress: '92%', status: 'On track', email: 'ifeoma.nwosu@example.com', date: '2026-08-29', tasks: 14, score: '90%', nextMilestone: 'Capstone sprint demo' },
  'int-1004': { id: 'INT-1004', name: 'Samuel Ojo', track: 'Data Analytics', assessment: 'Assessment Gamma', mentor: 'Ada Smith', progress: '54%', status: 'At risk', email: 'samuel.ojo@example.com', date: '2026-08-25', tasks: 8, score: '68%', nextMilestone: 'Data cleanup handoff' },
}

export default function InternshipInternDetailPage() {
  const params = useParams<{ slug: string }>()
  const intern = internDetailData[params.slug] ?? internDetailData['int-1001']

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/interns" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to interns
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Intern profile</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{intern.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e8faf7] px-2.5 py-1 text-[9px] font-semibold text-teal-600">{intern.status}</span>
            <Link href={`/admin/internship/interns/${params.slug}/edit`} className="rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Edit profile</Link>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-[24px] bg-[#f8fbff] p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Overview</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <StatCard label="Track" value={intern.track} icon={ClipboardCheck} />
                <StatCard label="Assessment" value={intern.assessment} icon={CheckCircle2} />
                <StatCard label="Mentor" value={intern.mentor} icon={MessageSquareText} />
                <StatCard label="Score" value={intern.score} icon={Trophy} />
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1C1D52]">Progress</h2>
                <span className="text-sm font-bold text-[#5FBB46]">{intern.progress}</span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: intern.progress }} />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniCard label="Completed tasks" value={intern.tasks.toString()} icon={CheckCircle2} />
                <MiniCard label="Next milestone" value={intern.nextMilestone} icon={Clock3} />
                <MiniCard label="Joined" value={intern.date} icon={ClipboardCheck} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Intern details</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Email</span><span className="font-semibold text-[#1C1D52]">{intern.email}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Assessment</span><span className="font-semibold text-[#1C1D52]">{intern.assessment}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Status</span><span className="font-semibold text-[#1C1D52]">{intern.status}</span></p>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-[#f3f6fb] p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Quick actions</p>
              <div className="mt-4 space-y-2">
                <Link href="/admin/internship/applications" className="block rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Review applications</Link>
                <Link href="/admin/internship/assessments" className="block rounded-xl bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Open assessments</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl bg-white p-3.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f7eb] text-[#5FBB46]">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold text-[#1C1D52]">{value}</p>
    </div>
  )
}

function MiniCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="rounded-xl bg-[#f8fbff] p-3">
      <div className="flex items-center gap-2 text-[#5FBB46]">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</span>
      </div>
      <p className="mt-2 text-xs font-semibold text-[#1C1D52]">{value}</p>
    </div>
  )
}
