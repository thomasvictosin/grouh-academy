import { NextResponse } from 'next/server'

import { EnrollmentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

export async function GET(_request: Request, { params }: RouteContext<'/api/admin/student/students/[id]'>) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const { id } = await params
  const student = await getPrisma().user.findFirst({
    where: { id, roles: { some: { role: { name: RoleName.STUDENT } } } },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      status: true,
      createdAt: true,
      profile: true,
      _count: { select: { enrollments: true, certificates: true } },
      lessonProgress: { where: { completed: true }, select: { lessonId: true } },
      enrollments: {
        orderBy: { enrolledAt: 'desc' },
        select: {
          id: true,
          status: true,
          enrolledAt: true,
          completedAt: true,
          course: { select: { id: true, title: true, slug: true, thumbnail: true, modules: { select: { lessons: { select: { id: true } } } } } },
        },
      },
    },
  })
  if (!student) return NextResponse.json({ error: 'Learner not found.' }, { status: 404 })
  const completedLessonIds = new Set(student.lessonProgress.map((progress) => progress.lessonId))
  const enrollments = student.enrollments.map(({ course, ...enrollment }) => {
    const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
    const completedLessons = lessonIds.filter((id) => completedLessonIds.has(id)).length
    return {
      ...enrollment,
      course: { id: course.id, title: course.title, slug: course.slug, thumbnail: course.thumbnail },
      totalLessons: lessonIds.length,
      completedLessons,
      progressPercent: lessonIds.length ? Math.round((completedLessons / lessonIds.length) * 100) : 0,
    }
  })
  return NextResponse.json({ ...student, enrollments, completedCourses: enrollments.filter(({ status }) => status === EnrollmentStatus.COMPLETED).length })
}
