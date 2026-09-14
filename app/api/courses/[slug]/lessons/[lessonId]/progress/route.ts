import { NextRequest, NextResponse } from 'next/server'
import { EnrollmentStatus } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/course-data'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; lessonId: string }> },
) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { slug, lessonId } = await params
  const course = await getCourseBySlug(slug)

  if (!course) {
    return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  }

  const lessonExists = course.modules.some((module) => module.lessons.some((lesson) => lesson.id === lessonId))

  if (!lessonExists) {
    return NextResponse.json({ error: 'Lesson not found in this course.' }, { status: 404 })
  }

  const prisma = getPrisma()

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  })

  if (!enrollment || (enrollment.status !== EnrollmentStatus.ACTIVE && enrollment.status !== EnrollmentStatus.COMPLETED)) {
    return NextResponse.json({ error: 'You are not enrolled in this course.' }, { status: 403 })
  }

  let body: { completed?: boolean }

  try {
    body = (await request.json()) as { completed?: boolean }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const completed = Boolean(body.completed)

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: { userId, lessonId, completed, completedAt: completed ? new Date() : null },
  })

  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
  const totalLessons = lessonIds.length

  const completedRows = lessonIds.length
    ? await prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: lessonIds }, completed: true },
      })
    : []

  const completedLessons = completedRows.length
  const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

  await prisma.courseProgress.upsert({
    where: { userId_courseId: { userId, courseId: course.id } },
    update: {
      completedLessons,
      totalLessons,
      progressPercent,
      completedAt: progressPercent === 100 ? new Date() : null,
    },
    create: {
      userId,
      courseId: course.id,
      completedLessons,
      totalLessons,
      progressPercent,
      completedAt: progressPercent === 100 ? new Date() : null,
    },
  })

  // Reaching 100% marks the enrollment complete; un-completing a lesson
  // after that point moves it back to active rather than leaving a
  // COMPLETED enrollment whose lessons aren't all actually complete.
  if (progressPercent === 100 && enrollment.status !== EnrollmentStatus.COMPLETED) {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: EnrollmentStatus.COMPLETED, completedAt: new Date() },
    })
  } else if (progressPercent < 100 && enrollment.status === EnrollmentStatus.COMPLETED) {
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: EnrollmentStatus.ACTIVE, completedAt: null },
    })
  }

  return NextResponse.json({ completed, completedLessons, totalLessons, progressPercent })
}
