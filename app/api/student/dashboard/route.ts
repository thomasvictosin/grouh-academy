import { NextResponse } from 'next/server'
import { EnrollmentStatus, CourseStatus } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import {
  courseInclude,
  serializeCourse,
  type DashboardCourseProgress,
  type StudentDashboardResponse,
} from '@/lib/course-data'

export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: { not: EnrollmentStatus.CANCELLED } },
    include: { course: { include: courseInclude } },
    orderBy: { enrolledAt: 'desc' },
  })

  const enrolledCourseIds = enrollments.map((enrollment) => enrollment.courseId)

  const progressRows = enrolledCourseIds.length
    ? await prisma.courseProgress.findMany({
        where: { userId, courseId: { in: enrolledCourseIds } },
      })
    : []

  const progressByCourseId = new Map(progressRows.map((row) => [row.courseId, row]))

  // "In progress" surfaces active enrollments for the "keep going" section.
  // Completed enrollments are still counted in stats below, just not
  // listed here since there is nothing left to continue.
  const inProgress: DashboardCourseProgress[] = enrollments
    .filter((enrollment) => enrollment.status === EnrollmentStatus.ACTIVE)
    .slice(0, 3)
    .map((enrollment) => {
      const progress = progressByCourseId.get(enrollment.courseId)
      const totalLessonsFromCourse = enrollment.course.modules.reduce(
        (total, module) => total + module.lessons.length,
        0,
      )

      return {
        slug: enrollment.course.slug,
        title: enrollment.course.title,
        thumbnail: enrollment.course.thumbnail,
        completedLessons: progress?.completedLessons ?? 0,
        totalLessons: progress?.totalLessons ?? totalLessonsFromCourse,
        progressPercent: progress?.progressPercent ?? 0,
      }
    })

  const completedCourses = enrollments.filter(
    (enrollment) => enrollment.status === EnrollmentStatus.COMPLETED,
  ).length

  const overallProgressPercent = progressRows.length
    ? Math.round(
        progressRows.reduce((total, row) => total + row.progressPercent, 0) / progressRows.length,
      )
    : 0

  const recommendedCourses = await prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      ...(enrolledCourseIds.length ? { id: { notIn: enrolledCourseIds } } : {}),
    },
    include: courseInclude,
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const response: StudentDashboardResponse = {
    stats: {
      enrolledCourses: enrollments.length,
      completedCourses,
      overallProgressPercent,
    },
    inProgress,
    recommended: recommendedCourses.map((course) => serializeCourse(course)!),
  }

  return NextResponse.json(response)
}