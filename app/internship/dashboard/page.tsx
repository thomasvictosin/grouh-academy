'use client'

import { Activity, Bell, CheckCircle2, ChevronRight, Clock3, Trophy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InternshipShell from '@/components/InternshipShell'

type DashboardData = {
  program: { name: string; slug: string } | null
  paymentStatus?: string
  assessmentStatus?: string
  weekLabel?: string
  startDateLabel?: string
  completionDateLabel?: string
  progressPercent?: number
  stats?: { completedTasks: number; averageGradePercent: number | null; pendingTasks: number }
  currentTask?: { title: string; moduleTitle: string; dueLabel: string | null } | null
  mentor?: { name: string; expertise: string | null } | null
  recentFeedback?: { taskTitle: string; score: number | null; feedback: string | null; timeAgoLabel: string } | null
  announcements?: { title: string; postedLabel: string }[]
  recommendedCourses: { slug: string; title: string; thumbnail: string | null }[]
}

const assessmentLabels: Record<string, string> = {
  UNDER_REVIEW: 'Submitted · Under review',
  OBJECTIVE_SUBMITTED: 'Theory in progress',
  IN_PROGRESS: 'In progress',
  NOT_STARTED: 'Not started',
  PASSED: 'Passed',
  FAILED: 'Failed',
}

export default function InternshipDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/internship/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your internship dashboard.')
        return response.json() as Promise<DashboardData>
      })
      .then(setData)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load your internship dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <InternshipShell><p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading your dashboard...</p></InternshipShell>
  }

  if (error || !data) {
    return <InternshipShell><div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error ?? 'Unable to load your internship dashboard.'}</div></InternshipShell>
  }

  const assessmentLabel = data.assessmentStatus ? assessmentLabels[data.assessmentStatus] ?? data.assessmentStatus : 'Locked / pending'

  return (
    <InternshipShell>
      <div className="space-y-5">
        {data.program ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">{data.program.name}</p>
                <h1 className="mt-2 text-lg font-bold text-[#1C1D52]">Your internship application</h1>
                <p className="mt-1 text-xs text-slate-500">
                  Payment: <strong className={data.paymentStatus === 'PAID' ? 'text-[#5FBB46]' : 'text-amber-600'}>{data.paymentStatus === 'PAID' ? 'Paid' : 'Pending'}</strong> · Assessment: <strong className="text-[#1C1D52]">{assessmentLabel}</strong>
                </p>
              </div>
              {data.paymentStatus !== 'PAID' ? (
                <Link href="/internship/payment" className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-center text-xs font-bold text-[#14204f]">Complete payment</Link>
              ) : data.assessmentStatus !== 'UNDER_REVIEW' ? (
                <Link href="/internship/assessment/readiness" className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-center text-xs font-bold text-[#14204f]">{data.assessmentStatus === 'IN_PROGRESS' ? 'Continue assessment' : 'Start assessment'}</Link>
              ) : (
                <span className="rounded-lg bg-[#e8f7eb] px-4 py-2.5 text-center text-xs font-bold text-[#397d3a]">Outcome under review</span>
              )}
            </div>
          </section>
        ) : (
          <section className="rounded-2xl bg-[#1C1D52] p-6 text-white">
            <h1 className="text-xl font-bold">Start your internship journey</h1>
            <p className="mt-2 text-xs text-white/70">Choose an internship plan to begin your application.</p>
            <Link href="/internship/enroll" className="mt-4 inline-flex rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">View internship plans</Link>
          </section>
        )}

        {data.program && (
          <>
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold text-[#5FBB46]">{data.program.name}</p>
                  <p className="mt-3 text-xs text-slate-500">{data.weekLabel} · Start Date: {data.startDateLabel} · Expected Completion: {data.completionDateLabel}</p>
                </div>
                <span className="text-xs font-bold text-[#5FBB46]">{data.progressPercent}%</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#1C1D52]"><span>Progress</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-[#E7EEF8]"><div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${data.progressPercent ?? 0}%` }} /></div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Completed tasks', value: String(data.stats?.completedTasks ?? 0), icon: CheckCircle2 },
                { label: 'Average grade', value: data.stats?.averageGradePercent != null ? `${data.stats.averageGradePercent}%` : '—', icon: Trophy },
                { label: 'Pending tasks', value: String(data.stats?.pendingTasks ?? 0), icon: Activity },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f7eb] text-[#5FBB46]"><Icon className="h-4 w-4" /></span>
                  <strong className="mt-3 block text-xl text-[#1C1D52]">{value}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{label}</span>
                </div>
              ))}
            </section>

            {data.currentTask && (
              <section className="rounded-2xl bg-[#5FBB46] p-5 text-white shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:p-6">
                <h1 className="text-xl font-bold">{data.currentTask.moduleTitle} — {data.currentTask.title}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/90">
                  {data.currentTask.dueLabel && <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />Due: {data.currentTask.dueLabel}</span>}
                  <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" />In Progress</span>
                </div>
              </section>
            )}

            {data.mentor && (
              <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-slate-200" />
                  <div>
                    <h2 className="text-sm font-bold text-[#1C1D52]">Your Mentor</h2>
                    <p className="mt-1 text-xs text-slate-500">{data.mentor.name}{data.mentor.expertise ? ` · ${data.mentor.expertise}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <Link href="/internship/dashboard/mentor" className="rounded-lg bg-[#5FBB46] px-4 py-2 text-center text-xs font-semibold text-white">Message Mentor</Link>
                  <Link href="/internship/dashboard/mentor" className="rounded-lg px-4 py-2 text-center text-xs font-semibold text-[#5FBB46] shadow-[inset_0_0_0_1px_#5FBB46]">View Profile</Link>
                </div>
              </section>
            )}

            {data.recentFeedback && (
              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
                <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#1C1D52]">Recent Feedback</h2></div>
                <h3 className="mt-4 text-xs font-bold text-[#1C1D52]">Task: {data.recentFeedback.taskTitle}</h3>
                {data.recentFeedback.score != null && <p className="mt-2 text-xs text-slate-500"><span className="font-bold text-[#5FBB46]">★ Score: {data.recentFeedback.score}%</span></p>}
                {data.recentFeedback.feedback && <p className="mt-2 text-xs leading-5 text-slate-500">{data.recentFeedback.feedback}</p>}
                <p className="mt-2 text-[10px] text-slate-400">{data.recentFeedback.timeAgoLabel}</p>
              </section>
            )}

            {data.announcements && data.announcements.length > 0 && (
              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
                <h2 className="text-sm font-bold text-[#1C1D52]">Announcements</h2>
                <div className="mt-4 space-y-3">
                  {data.announcements.map((item) => (
                    <div key={item.title} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]"><Bell className="h-3 w-3" /></span>
                      <div>
                        <p className="text-xs font-semibold text-[#1C1D52]">{item.title}</p>
                        <p className="text-[10px] text-slate-500">Posted {item.postedLabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1C1D52]">Recommended Courses</h2>
            <a href="/courses" className="text-xs font-semibold text-[#5FBB46]">See More <ChevronRight className="inline h-3 w-3" /></a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.recommendedCourses.map((course) => (
              <article key={course.slug} className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
                {course.thumbnail ? (
                  <Image src={course.thumbnail} alt="" width={700} height={380} className="h-28 w-full rounded-xl object-cover" />
                ) : (
                  <div className="h-28 w-full rounded-xl bg-[linear-gradient(135deg,#1c1d52,#5fbb46)]" />
                )}
                <div className="p-2">
                  <h3 className="mt-3 text-xs font-bold text-[#1C1D52]">{course.title}</h3>
                  <Link href={`/student/my-courses/${course.slug}/preview`} className="mt-4 block w-full rounded-lg bg-[#5FBB46] py-2 text-center text-xs font-semibold text-white">View course</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </InternshipShell>
  )
}