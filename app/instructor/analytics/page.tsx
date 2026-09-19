import { BarChart3, BookOpen, TrendingUp, Users } from 'lucide-react'

import { CourseStatus, EnrollmentStatus, QuizAttemptStatus } from '@/generated/prisma/client'
import { InstructorPage, InstructorStat } from '@/components/InstructorPage'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'

const enrolledStatuses = [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED]
const scoredAttemptStatuses = [QuizAttemptStatus.SUBMITTED, QuizAttemptStatus.PASSED, QuizAttemptStatus.FAILED]

function percent(value: number) { return `${Math.round(value)}%` }
function monthKey(date: Date) { return `${date.getFullYear()}-${date.getMonth()}` }

function getRecentMonths() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    return { key: monthKey(date), label: date.toLocaleDateString('en-NG', { month: 'short' }) }
  })
}

export default async function InstructorAnalyticsPage() {
  const userId = await getCurrentUserId()
  if (!userId) return <InstructorPage title="Course Analytics" description="Understand enrollment, engagement, completion, and learner performance across your courses."><div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">Your course analytics are unavailable right now.</div></InstructorPage>

  const courses = await getPrisma().course.findMany({
    where: { status: CourseStatus.PUBLISHED, OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }] },
    select: {
      id: true, title: true,
      enrollments: { where: { status: { in: enrolledStatuses } }, select: { userId: true, status: true, enrolledAt: true } },
      progress: { select: { userId: true, progressPercent: true, completedAt: true } },
      quizzes: { select: { attempts: { where: { status: { in: scoredAttemptStatuses } }, select: { scorePercent: true } } } },
    },
    orderBy: { title: 'asc' },
  })

  const courseRows = courses.map((course) => {
    const progressByStudent = new Map(course.progress.map((item) => [item.userId, item]))
    const enrolled = course.enrollments.length
    const active = course.enrollments.filter((item) => item.status === EnrollmentStatus.ACTIVE).length
    const completed = course.enrollments.filter((item) => item.status === EnrollmentStatus.COMPLETED || Boolean(progressByStudent.get(item.userId)?.completedAt)).length
    const averageProgress = enrolled ? course.enrollments.reduce((total, item) => total + (progressByStudent.get(item.userId)?.progressPercent ?? 0), 0) / enrolled : 0
    const quizScores = course.quizzes.flatMap((quiz) => quiz.attempts.map((attempt) => attempt.scorePercent))
    const averageQuizScore = quizScores.length ? quizScores.reduce((total, score) => total + score, 0) / quizScores.length : null
    return { ...course, enrolled, active, completed, averageProgress, averageQuizScore, quizScores }
  })

  const totalEnrollments = courseRows.reduce((total, course) => total + course.enrolled, 0)
  const totalCompleted = courseRows.reduce((total, course) => total + course.completed, 0)
  const totalProgress = courseRows.reduce((total, course) => total + course.averageProgress * course.enrolled, 0)
  const allQuizScores = courseRows.flatMap((course) => course.quizScores)
  const completionRate = totalEnrollments ? (totalCompleted / totalEnrollments) * 100 : 0
  const averageProgress = totalEnrollments ? totalProgress / totalEnrollments : 0
  const averageQuizScore = allQuizScores.length ? allQuizScores.reduce((total, score) => total + score, 0) / allQuizScores.length : null
  const enrollmentTrend = getRecentMonths().map((month) => ({ ...month, value: courseRows.reduce((total, course) => total + course.enrollments.filter((item) => monthKey(item.enrolledAt) === month.key).length, 0) }))
  const trendMaximum = Math.max(...enrollmentTrend.map((month) => month.value), 1)
  const engagementMetrics = [
    { label: 'Average course progress', value: averageProgress, color: 'bg-[#5FBB46]' },
    { label: 'Course completion', value: completionRate, color: 'bg-blue-500' },
    { label: 'Quiz average', value: averageQuizScore, color: 'bg-amber-400' },
  ]

  return <InstructorPage title="Course Analytics" description="Enrollment, learner progress, completion, and assessment performance for your published courses.">
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <InstructorStat label="Published courses" value={String(courses.length)} detail="Visible to learners" />
      <InstructorStat label="Enrollments" value={String(totalEnrollments)} detail="Across published courses" />
      <InstructorStat label="Completion rate" value={percent(completionRate)} detail={`${totalCompleted} learner${totalCompleted === 1 ? '' : 's'} completed`} />
      <InstructorStat label="Average quiz score" value={averageQuizScore === null ? '—' : percent(averageQuizScore)} detail={allQuizScores.length ? `${allQuizScores.length} scored attempt${allQuizScores.length === 1 ? '' : 's'}` : 'No submitted quizzes yet'} />
    </div>

    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-blue-500" /><div><h2 className="text-sm font-bold text-[#1C1D52]">Enrollment trend</h2><p className="mt-1 text-[10px] text-slate-500">New enrollments across your published courses.</p></div></div><div className="mt-8 flex h-40 items-end gap-3">{enrollmentTrend.map((month) => <div key={month.key} className="flex flex-1 flex-col justify-end gap-2"><span className="text-center text-[10px] font-bold text-[#1C1D52]">{month.value}</span><div className="min-h-1 rounded-t-md bg-[#5FBB46]" style={{ height: `${Math.max((month.value / trendMaximum) * 108, 4)}px` }} /><span className="text-center text-[10px] text-slate-400">{month.label}</span></div>)}</div></section>
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-[#5FBB46]" /><div><h2 className="text-sm font-bold text-[#1C1D52]">Learner engagement</h2><p className="mt-1 text-[10px] text-slate-500">Live aggregate performance from learner records.</p></div></div><div className="mt-6 space-y-5">{engagementMetrics.map((metric) => <div key={metric.label}><div className="flex justify-between text-xs"><span className="text-slate-500">{metric.label}</span><strong className="text-[#1C1D52]">{metric.value === null ? '—' : percent(metric.value)}</strong></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className={`h-full rounded-full ${metric.color}`} style={{ width: `${Math.min(metric.value ?? 0, 100)}%` }} /></div></div>)}</div></section>
    </div>

    <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#5FBB46]" /><div><h2 className="text-sm font-bold text-[#1C1D52]">Students by published course</h2><p className="mt-1 text-[10px] text-slate-500">A complete enrollment and learner-performance breakdown.</p></div></div><span className="rounded-full bg-[#e8f7eb] px-3 py-1 text-[10px] font-bold text-[#397d3a]">{totalEnrollments} enrolled</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="text-[10px] uppercase tracking-[0.12em] text-slate-400"><tr><th className="pb-3">Course</th><th className="pb-3">Students</th><th className="pb-3">Active</th><th className="pb-3">Completed</th><th className="pb-3">Avg. progress</th><th className="pb-3">Quiz average</th></tr></thead><tbody className="text-xs">{courseRows.length === 0 ? <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-500">Publish a course to begin tracking learner analytics.</td></tr> : courseRows.map((course) => <tr key={course.id} className="border-t border-slate-100"><td className="py-4"><div className="flex items-center gap-2 font-bold text-[#1C1D52]"><BookOpen className="h-3.5 w-3.5 text-[#5FBB46]" />{course.title}</div></td><td className="py-4 text-slate-600">{course.enrolled}</td><td className="py-4 text-slate-600">{course.active}</td><td className="py-4 text-slate-600">{course.completed}</td><td className="py-4 font-semibold text-[#1C1D52]">{percent(course.averageProgress)}</td><td className="py-4 font-semibold text-[#1C1D52]">{course.averageQuizScore === null ? '—' : percent(course.averageQuizScore)}</td></tr>)}</tbody></table></div></section>
  </InstructorPage>
}
