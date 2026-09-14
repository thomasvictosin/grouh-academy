'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, GraduationCap, Sparkles, TrendingUp } from 'lucide-react'

import type { StudentDashboardResponse } from '@/lib/course-data'

export default function StudentDashboardPage() {
  const [data, setData] = useState<StudentDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/student/dashboard')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your dashboard.')
        return response.json() as Promise<StudentDashboardResponse>
      })
      .then(setData)
      .catch((requestError: unknown) =>
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your dashboard.'),
      )
      .finally(() => setLoading(false))
  }, [])

  const stats = data
    ? [
        { label: 'Enrolled Courses', value: String(data.stats.enrolledCourses), icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed Courses', value: String(data.stats.completedCourses), icon: GraduationCap, color: 'text-[#397d3a]', bg: 'bg-[#e8f7eb]' },
        { label: 'Overall Progress', value: `${data.stats.overallProgressPercent}%`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
        // NOTE: there is no time-tracking field anywhere in the schema
        // (no session/duration model for a User). "Time Spent" has no
        // real data to show yet, so it's marked as such rather than
        // showing a fabricated number - same call as the `level` filter
        // in CourseCatalog.tsx.
        { label: 'Time Spent', value: '—', icon: Clock3, color: 'text-[#1C1D52]', bg: 'bg-indigo-50' },
      ]
    : []

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-7 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-9">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#14204f]/65">
              <Sparkles className="h-4 w-4" />
              Your learning space
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Welcome back</h1>
            <p className="mt-2 max-w-xl text-sm text-[#14204f]/75">
              Keep your momentum going. You are closer to your next milestone than you think.
            </p>
          </div>
          <Link
            href="/student/explore-courses"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#1C1D52] px-4 py-2.5 text-xs font-bold text-white"
          >
            Explore courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(loading ? Array.from({ length: 4 }) : stats).map((stat, index) => {
              if (loading || !stat) {
                return (
                  <div key={index} className="h-[104px] animate-pulse rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.07)]" />
                )
              }

              const { label, value, icon: Icon, color, bg } = stat as (typeof stats)[number]

              return (
                <div key={label} className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.07)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
                      <strong className="mt-3 block text-2xl font-black text-[#1C1D52]">{value}</strong>
                    </div>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5FBB46]">Keep going</p>
                <h2 className="mt-1 text-2xl font-black text-[#1C1D52]">Learning progress</h2>
              </div>
              <Link href="/student/my-courses" className="text-xs font-bold text-blue-600">
                View all courses
              </Link>
            </div>

            {loading ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[220px] animate-pulse rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.08)]" />
                ))}
              </div>
            ) : data && data.inProgress.length > 0 ? (
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                {data.inProgress.map((course) => (
                  <article key={course.slug} className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
                    <div className="relative aspect-[2.1/1] overflow-hidden bg-slate-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full bg-[linear-gradient(135deg,#1c1d52,#5fbb46)]" />
                      )}
                      <span className="absolute right-3 top-3 rounded-full bg-[#1C1D52]/85 px-2.5 py-1 text-[10px] font-bold text-white">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-[#1C1D52]">{course.title}</h3>
                      <div className="mt-4 flex justify-between text-[10px] text-slate-500">
                        <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                        <span className="font-bold text-[#1C1D52]">{course.progressPercent}% complete</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E7EEF8]">
                        <div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                      <Link
                        href={`/student/my-courses/${course.slug}/learn`}
                        className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-[#1C1D52] hover:text-blue-600"
                      >
                        Continue learning <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <h3 className="text-sm font-bold text-[#1C1D52]">No courses in progress yet.</h3>
                <p className="mt-2 text-xs text-slate-500">Enroll in a course to see your progress here.</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5FBB46]">Curated for you</p>
                <h2 className="mt-1 text-2xl font-black text-[#1C1D52]">Recommended courses</h2>
              </div>
              <Link href="/student/explore-courses" className="text-xs font-bold text-blue-600">
                See more
              </Link>
            </div>

            {loading ? (
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-[320px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
                ))}
              </div>
            ) : data && data.recommended.length > 0 ? (
              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {data.recommended.map((course) => (
                  <article
                    key={course.slug}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full bg-[linear-gradient(135deg,#1c1d52,#5fbb46)]" />
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-[#141650]/90 px-2.5 py-1 text-[10px] font-bold text-white">
                        Recommended
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4db848]">
                        {course.category?.name ?? 'Academy'}
                      </p>
                      <h3 className="mt-2 text-base font-bold leading-snug text-[#1C1D52]">{course.title}</h3>
                      <p className="mt-1 text-[10px] text-slate-500">with {course.creator?.name || 'Grouh Academy'}</p>
                      <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-bold text-[#1C1D52]">
                          {course.rating ? `★ ${course.rating.toFixed(1)}` : 'New course'}
                        </span>
                        <span className="ml-auto">{course._count?.reviews ?? 0} reviews</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-lg font-black text-[#1C1D52]">
                          {course.currency} {course.price}
                        </span>
                        <Link
                          href={`/student/my-courses/${course.slug}/preview`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-bold text-[#14204f]"
                        >
                          View course <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <h3 className="text-sm font-bold text-[#1C1D52]">Nothing to recommend yet.</h3>
                <p className="mt-2 text-xs text-slate-500">Check back once more courses are published.</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
