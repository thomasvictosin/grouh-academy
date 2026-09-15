import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { CourseStatus } from '@/generated/prisma/client'
import { courseInclude, serializeCourse } from '@/lib/course-data'

function parseDurationWeeks(duration: string): number {
  const match = duration.match(/\d+/)
  return match ? Number(match[0]) : 12
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function timeAgoLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true, payment: true, attempts: { orderBy: { createdAt: 'desc' }, take: 1 } },
      orderBy: { createdAt: 'desc' },
    })

    if (!application) {
      // No application yet — page should show the "start your internship" empty state.
      const recommendedCourses = await prisma.course.findMany({
        where: { status: CourseStatus.PUBLISHED },
        include: courseInclude,
        orderBy: { createdAt: 'desc' },
        take: 3,
      })
      return NextResponse.json({
        program: null,
        recommendedCourses: recommendedCourses.map((c) => serializeCourse(c)!),
      })
    }

    const { program } = application
    const paymentStatus = application.payment?.status ?? 'PENDING'
    const latestAttempt = application.attempts[0]
    const assessmentStatus = latestAttempt?.status ?? 'NOT_STARTED'

    const progress = await prisma.internshipProgress.findUnique({
      where: { userId_programId: { userId, programId: program.id } },
    })

    const totalWeeks = parseDurationWeeks(program.duration)
    const startDate = application.createdAt
    const weeksElapsed = Math.min(
      totalWeeks,
      Math.max(1, Math.ceil((Date.now() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))),
    )
    const expectedCompletion = new Date(startDate.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000)

    const completedTasks = progress?.completedTasks ?? 0
    const totalTasks = progress?.totalTasks ?? 0
    const pendingTasks = Math.max(0, totalTasks - completedTasks)
    const progressPercent = progress?.progressPercent ?? 0

    // Average grade across this program's graded task submissions.
    const gradedSubmissions = await prisma.taskSubmission.findMany({
      where: {
        userId,
        score: { not: null },
        task: { module: { programId: program.id } },
      },
      select: { score: true },
    })
    const averageGradePercent = gradedSubmissions.length
      ? Math.round(gradedSubmissions.reduce((sum, s) => sum + (s.score ?? 0), 0) / gradedSubmissions.length)
      : null

    // Next task with no submission yet, soonest due date first.
    const upcomingTask = await prisma.internshipTask.findFirst({
      where: {
        module: { programId: program.id },
        submissions: { none: { userId } },
      },
      orderBy: { dueDate: 'asc' },
      include: { module: true },
    })

    const mentorAssignment = await prisma.mentorAssignment.findFirst({
      where: { internId: userId, programId: program.id, status: 'ACTIVE' },
      include: { mentor: { include: { mentorProfile: true } } },
    })

    const recentFeedback = await prisma.taskSubmission.findFirst({
      where: { userId, feedback: { not: null }, task: { module: { programId: program.id } } },
      orderBy: { reviewedAt: 'desc' },
      include: { task: true },
    })

    const activeMentorIds = (
      await prisma.mentorAssignment.findMany({
        where: { internId: userId, status: 'ACTIVE' },
        select: { mentorId: true },
      })
    ).map((a) => a.mentorId)

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { scope: 'GLOBAL' },
          ...(activeMentorIds.length ? [{ scope: 'MENTOR_MENTEES' as const, authorId: { in: activeMentorIds } }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    const enrolledCourseIds = (
      await prisma.enrollment.findMany({ where: { userId }, select: { courseId: true } })
    ).map((e) => e.courseId)

    const recommendedCourses = await prisma.course.findMany({
      where: {
        status: CourseStatus.PUBLISHED,
        ...(enrolledCourseIds.length ? { id: { notIn: enrolledCourseIds } } : {}),
      },
      include: courseInclude,
      orderBy: { createdAt: 'desc' },
      take: 3,
    })

    return NextResponse.json({
      program: { name: program.name, slug: program.slug },
      paymentStatus,
      assessmentStatus,
      weekLabel: `Week ${weeksElapsed} of ${totalWeeks}`,
      startDateLabel: formatDate(startDate),
      completionDateLabel: formatDate(expectedCompletion),
      progressPercent,
      stats: { completedTasks, averageGradePercent, pendingTasks },
      currentTask: upcomingTask
        ? {
            title: upcomingTask.title,
            moduleTitle: upcomingTask.module.title,
            dueLabel: upcomingTask.dueDate ? formatDate(upcomingTask.dueDate) : null,
          }
        : null,
      mentor: mentorAssignment
        ? {
            name: mentorAssignment.mentor.name ?? 'Your mentor',
            expertise: mentorAssignment.mentor.mentorProfile?.expertise ?? null,
          }
        : null,
      recentFeedback: recentFeedback
        ? {
            taskTitle: recentFeedback.task.title,
            score: recentFeedback.score,
            feedback: recentFeedback.feedback,
            timeAgoLabel: timeAgoLabel(recentFeedback.reviewedAt ?? recentFeedback.submittedAt),
          }
        : null,
      announcements: announcements.map((a) => ({
        title: a.title,
        postedLabel: timeAgoLabel(a.createdAt),
      })),
      recommendedCourses: recommendedCourses.map((c) => serializeCourse(c)!),
    })
  } catch (error) {
    console.error('Failed to load internship dashboard:', error)
    return NextResponse.json({ error: 'Unable to load internship dashboard.' }, { status: 500 })
  }
}