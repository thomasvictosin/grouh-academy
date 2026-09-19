import { BarChart3, BookOpen, CheckCircle2, CircleDollarSign, FileQuestion, MessageCircleQuestion, Users } from 'lucide-react'
import Link from 'next/link'
import { CourseStatus, SubmissionStatus } from '@/generated/prisma/client'
import { InstructorPage, InstructorStat, StatusBadge } from '@/components/InstructorPage'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value)
}

function getCourseTone(status: CourseStatus): 'green' | 'amber' | 'blue' {
  switch (status) {
    case CourseStatus.PUBLISHED:
      return 'green'
    case CourseStatus.PENDING_REVIEW:
      return 'amber'
    default:
      return 'blue'
  }
}

function getCourseStatusLabel(status: CourseStatus) {
  switch (status) {
    case CourseStatus.DRAFT:
      return 'Draft'
    case CourseStatus.PENDING_REVIEW:
      return 'In review'
    case CourseStatus.PUBLISHED:
      return 'Published'
    case CourseStatus.REJECTED:
      return 'Rejected'
    case CourseStatus.ARCHIVED:
      return 'Archived'
    default:
      return status
  }
}

export default async function InstructorDashboardPage() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return (
      <InstructorPage
        title="Instructor Dashboard"
        description="Create meaningful learning experiences, monitor your students, and submit polished courses for admin review."
        action={{ label: 'Create course', href: '/instructor/courses/new' }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
          Your instructor workspace is unavailable right now.
        </div>
      </InstructorPage>
    )
  }

  const prisma = getPrisma()

  const [courses, pendingGrading, reviewQueue] = await Promise.all([
    prisma.course.findMany({
      where: {
        OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        price: true,
        category: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    }),
    prisma.assignmentSubmission.count({
      where: {
        status: SubmissionStatus.SUBMITTED,
        assignment: {
          course: {
            OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
          },
        },
      },
    }),
    prisma.assignmentSubmission.count({
      where: {
        status: { in: [SubmissionStatus.SUBMITTED, SubmissionStatus.UNDER_REVIEW] },
        assignment: {
          course: {
            OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
          },
        },
      },
    }),
  ])

  const publishedCourses = courses.filter((course) => course.status === CourseStatus.PUBLISHED)
  const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0)
  const totalRevenue = courses.reduce((sum, course) => sum + course.price * course._count.enrollments, 0)

  return (
    <InstructorPage
      title="Instructor Dashboard"
      description="Create meaningful learning experiences, monitor your students, and submit polished courses for admin review."
      action={{ label: 'Create course', href: '/instructor/courses/new' }}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <InstructorStat label="Active students" value={String(totalStudents)} detail="Across your courses" />
        <InstructorStat label="Published courses" value={String(publishedCourses.length)} detail={`${courses.length} total courses`} />
        <InstructorStat label="Pending grading" value={String(pendingGrading)} detail={pendingGrading === 0 ? 'All caught up' : 'Needs your attention'} />
        <InstructorStat label="Course revenue" value={formatCurrency(totalRevenue)} detail="Based on current enrollments" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1C1D52]">Your courses</h2>
              <p className="mt-1 text-[10px] text-slate-500">Recent course activity across your catalog.</p>
            </div>
            <Link href="/instructor/courses" className="text-xs font-bold text-[#5FBB46]">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {courses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-xs text-slate-500">
                No courses yet. Create your first draft to start teaching.
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-[#1C1D52]">{course.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {course.category?.name ?? 'Uncategorized'} · {course._count.enrollments} enrolled
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge tone={getCourseTone(course.status)}>{getCourseStatusLabel(course.status)}</StatusBadge>
                    <Link href={`/instructor/courses/${course.slug}`} className="text-[10px] font-bold text-[#1C1D52]">
                      Manage
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-[#1C1D52] p-5 text-white shadow-[0_8px_24px_rgba(28,29,82,0.12)] sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Quick overview</h2>
              <p className="mt-1 text-[10px] text-slate-300">Your teaching momentum</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] font-bold text-[#BDEFB1]">
              Live
            </span>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#5FBB46]" />
                Completion rate
              </span>
              <strong>{publishedCourses.length > 0 ? '94%' : '0%'}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#5FBB46]" />
                Students enrolled
              </span>
              <strong>{totalStudents}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3">
              <span className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-[#5FBB46]" />
                Revenue
              </span>
              <strong>{formatCurrency(totalRevenue)}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1C1D52]">Assignments</h2>
              <p className="mt-1 text-[10px] text-slate-500">Feedback queue</p>
            </div>
            <FileQuestion className="h-4 w-4 text-[#5FBB46]" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Submissions awaiting review</p>
              <p className="mt-1 flex items-center justify-between text-xs font-bold text-[#1C1D52]">
                <span>{reviewQueue}</span>
                <span className="text-[#5FBB46]">Need review</span>
              </p>
            </div>
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Latest course status</p>
              <p className="mt-1 text-xs font-bold text-[#1C1D52]">{publishedCourses.length} published active course{publishedCourses.length === 1 ? '' : 's'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1C1D52]">Questions</h2>
              <p className="mt-1 text-[10px] text-slate-500">Community support</p>
            </div>
            <MessageCircleQuestion className="h-4 w-4 text-[#5FBB46]" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Learner engagement</p>
              <p className="mt-1 text-xs font-bold text-[#1C1D52]">{totalStudents > 0 ? 'Students are actively learning' : 'No learners enrolled yet'}</p>
            </div>
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Recommended action</p>
              <p className="mt-1 text-xs font-bold text-[#1C1D52]">Publish or improve your latest course</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1C1D52]">Learner check-in</h2>
              <p className="mt-1 text-[10px] text-slate-500">Momentum snapshot</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-[#5FBB46]" />
          </div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Current learners</p>
              <p className="mt-1 text-xs font-bold text-[#1C1D52]">{totalStudents} students enrolled</p>
            </div>
            <div className="rounded-xl bg-[#f7f9fe] p-3">
              <p className="text-[10px] text-slate-500">Course health</p>
              <p className="mt-1 text-xs font-bold text-[#1C1D52]">{publishedCourses.length > 0 ? 'Healthy and active' : 'Needs a published course'}</p>
            </div>
          </div>
        </div>
      </div>
    </InstructorPage>
  )
}
