'use client'

import { ArrowLeft, BriefcaseBusiness, MessageSquareText, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const mentorDetailData: Record<string, any> = {
  'mtr-101': { id: 'MTR-101', name: 'Maya Brooks', track: 'Software Development', interns: 7, rating: '4.9', status: 'Available', email: 'maya@example.com', focus: 'Frontend mentorship and code review' },
  'mtr-102': { id: 'MTR-102', name: 'Grace Sanni', track: 'Product Design', interns: 5, rating: '4.8', status: 'Busy', email: 'grace@example.com', focus: 'Research synthesis and UX critique' },
  'mtr-103': { id: 'MTR-103', name: 'Ada Smith', track: 'Data Analytics', interns: 9, rating: '4.7', status: 'At capacity', email: 'ada@example.com', focus: 'Dashboards and data storytelling' },
}

export default function MentorDetailPage() {
  const params = useParams<{ slug: string }>()
  const mentor = mentorDetailData[params.slug] ?? mentorDetailData['mtr-101']

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/mentors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to mentors
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Mentor profile</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{mentor.name}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e8faf7] px-2.5 py-1 text-[9px] font-semibold text-teal-600">{mentor.status}</span>
            <Link href={`/admin/internship/mentors/${params.slug}/edit`} className="rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Edit profile</Link>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] bg-[#f8fbff] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Focus area</p>
            <p className="mt-4 text-sm leading-6 text-slate-600">{mentor.focus}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Track</span><span className="font-semibold text-[#1C1D52]">{mentor.track}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Interns</span><span className="font-semibold text-[#1C1D52]">{mentor.interns}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Rating</span><span className="font-semibold text-[#1C1D52]">{mentor.rating}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Email</span><span className="font-semibold text-[#1C1D52]">{mentor.email}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
