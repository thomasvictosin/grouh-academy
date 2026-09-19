'use client'

import { Activity, ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardCheck, Clock3, Sparkles, Users, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type OverviewItem = { value: string; label: string }
type ProgramMetric = { name: string; learners: number; value: string; detail: string; bar: number }
type PriorityAction = { title: string; href: string; detail: string }
type ActivityItem = { title: string; meta: string; tone: 'neutral' | 'success' | 'warning' }
type MentorLoadItem = { name: string; program: string; activeInterns: string; loadValue: number; status: 'Healthy' | 'Busy' | 'Capacity'; mentorId: string }
type LeaderboardItem = {
  name: string
  metric: number
  learners: number
  detail: string
}

type DashboardData = {
  overview: OverviewItem[]
  programPerformance: ProgramMetric[]
  priorityActions: PriorityAction[]
  recentActivity: ActivityItem[]
  mentorLoad: MentorLoadItem[]
  topCohorts: LeaderboardItem[]
  topTracks: LeaderboardItem[]
}

const toneStyles: Record<ActivityItem['tone'], string> = {
  neutral: 'border-slate-200 bg-[#f8fbff]',
  success: 'border-emerald-200 bg-[#e8faf7]',
  warning: 'border-amber-200 bg-[#fff8eb]',
}

const iconByIndex = [Users, BriefcaseBusiness, CheckCircle2, Users, ClipboardCheck, WalletCards, Clock3, Sparkles]

export default function InternshipAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/dashboard', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Dashboard data request failed (${response.status}).`)
        return response.json() as Promise<DashboardData>
      })
      .then(setData)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Dashboard data is unavailable.'))
  }, [])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <section className="rounded-[28px] bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_30px_rgba(95,187,70,0.2)] sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#14204f]/70">Internship admin workspace</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Internship operations dashboard</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/internship/cohorts" className="rounded-lg bg-white px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">Manage cohorts</Link>
              <Link href="/admin/internship/assessments/new" className="rounded-lg bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white">Create assessment</Link>
            </div>
          </div>
        </section>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
        {!error && !data && <p className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">Loading internship dashboard…</p>}

        {data && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.overview.slice(0, 4).map((item, index) => {
                const Icon = iconByIndex[index % iconByIndex.length]
                return (
                  <div key={item.label} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <strong className="mt-4 block text-xl text-[#1C1D52]">{item.value}</strong>
                    <span className="mt-1 block text-[10px] text-slate-500">{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.overview.slice(4).map((item, index) => {
                const Icon = iconByIndex[(index + 4) % iconByIndex.length]
                return (
                  <div key={item.label} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
                    <div className="flex items-center justify-between">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#e8f7eb] text-[#397d3a]">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <strong className="mt-4 block text-xl text-[#1C1D52]">{item.value}</strong>
                    <span className="mt-1 block text-[10px] text-slate-500">{item.label}</span>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#1C1D52]">Program health</h2>
                    <p className="mt-1 text-[10px] text-slate-500">Current cohort progress across each active internship track.</p>
                  </div>
                  <Link href="/admin/internship/assessments" className="text-[10px] font-bold text-[#5FBB46]">View all</Link>
                </div>

                <div className="mt-5 space-y-4">
                  {data.programPerformance.map((program) => (
                    <div key={program.name}>
                      <div className="flex items-center justify-between text-[10px] font-semibold text-[#1C1D52]">
                        <span>{program.name}</span>
                        <span>{program.value}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${Math.min(100, Math.max(0, program.bar))}%` }} />
                      </div>
                      <p className="mt-2 text-[9px] text-slate-500">{program.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-[#1C1D52] p-5 text-white shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be28a]">Priority</p>
                <h2 className="mt-3 text-xl font-bold">Team focus</h2>

                <div className="mt-5 space-y-3">
                  {data.priorityActions.map((action) => (
                    <Link key={action.title} href={action.href} className="block rounded-xl bg-white/5 p-3 text-left text-[10px] font-medium text-white/85">
                      <div className="flex items-start justify-between gap-3">
                        <span>{action.title}</span>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      </div>
                      <p className="mt-2 text-[9px] text-white/60">{action.detail}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Leaderboard</p>
                    <h2 className="mt-2 text-sm font-bold text-[#1C1D52]">Top performing cohorts</h2>
                  </div>
                  <Link href="/admin/internship/cohorts" className="text-[10px] font-bold text-[#5FBB46]">Open cohorts</Link>
                </div>

                <div className="mt-5 space-y-3">
                  {data.topCohorts.map((cohort, index) => (
                    <div key={`${cohort.name}-${index}`} className="rounded-xl border border-slate-200 bg-[#f8fbff] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5FBB46] text-[10px] font-bold text-[#14204f]">#{index + 1}</span>
                          <div>
                            <p className="text-xs font-semibold text-[#1C1D52]">{cohort.name}</p>
                            <p className="mt-1 text-[10px] text-slate-500">{cohort.detail}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#1C1D52]">{cohort.metric}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Leaderboard</p>
                    <h2 className="mt-2 text-sm font-bold text-[#1C1D52]">Top performing internship tracks</h2>
                  </div>
                  <Link href="/admin/internship/assessments" className="text-[10px] font-bold text-[#5FBB46]">View tracks</Link>
                </div>

                <div className="mt-5 space-y-3">
                  {data.topTracks.map((track, index) => (
                    <div key={`${track.name}-${index}`} className="rounded-xl border border-slate-200 bg-[#f8fbff] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1C1D52] text-[10px] font-bold text-white">#{index + 1}</span>
                          <div>
                            <p className="text-xs font-semibold text-[#1C1D52]">{track.name}</p>
                            <p className="mt-1 text-[10px] text-slate-500">{track.detail}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-[#1C1D52]">{track.metric}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#1C1D52]">Recent activity</h2>
                    <p className="mt-1 text-[10px] text-slate-500">Latest internship actions across learners, mentors, and payments.</p>
                  </div>
                  <Link href="/admin/internship/notifications" className="text-[10px] font-bold text-[#5FBB46]">View all</Link>
                </div>

                <div className="mt-5 space-y-3">
                  {data.recentActivity.map((item, index) => (
                    <div key={`${item.title}-${index}`} className={`flex items-start gap-3 rounded-xl border p-3 ${toneStyles[item.tone]}`}>
                      <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#5FBB46]">
                        <Activity className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-[#1C1D52]">{item.title}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{item.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#1C1D52]">Mentor load</h2>
                    <p className="mt-1 text-[10px] text-slate-500">Current mentor capacity across the active internship cohort.</p>
                  </div>
                  <Link href="/admin/internship/mentors" className="text-[10px] font-bold text-[#5FBB46]">Open mentors</Link>
                </div>

                <div className="mt-5 space-y-4">
                  {data.mentorLoad.map((mentor) => {
                    const loadTone = mentor.status === 'Capacity' ? 'bg-red-100 text-red-600' : mentor.status === 'Busy' ? 'bg-amber-100 text-amber-600' : 'bg-[#e8faf7] text-teal-600'
                    return (
                      <div key={mentor.mentorId} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-[#1C1D52]">{mentor.name}</p>
                            <p className="mt-1 text-[10px] text-slate-500">{mentor.program}</p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${loadTone}`}>{mentor.status}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{mentor.activeInterns}</span>
                          <span className="font-semibold text-[#1C1D52]">{Math.min(100, Math.max(20, mentor.loadValue * 12))}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${Math.min(100, mentor.loadValue * 12)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
