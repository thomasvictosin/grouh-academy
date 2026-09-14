import { notFound, redirect } from 'next/navigation'
import { EnrollmentStatus } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/course-data'
import CourseLearningPlayer, { type LearnCourseData } from '@/components/CourseLearningPlayer'

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect('/login')
  }

  const course = await getCourseBySlug(slug)

  if (!course) {
    notFound()
  }

  const prisma = getPrisma()

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  })

  // A student can only open the player for a course they are actually
  // enrolled in (ACTIVE or COMPLETED). This mirrors the same check the
  // progress API route below performs on every completion toggle, so a
  // direct link to someone else's/an unenrolled course's /learn URL
  // can't be used to view lesson content either.
  if (!enrollment || (enrollment.status !== EnrollmentStatus.ACTIVE && enrollment.status !== EnrollmentStatus.COMPLETED)) {
    notFound()
  }

  const lessonIds = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))

  const progressRows = lessonIds.length
    ? await prisma.lessonProgress.findMany({
        where: { userId, lessonId: { in: lessonIds }, completed: true },
      })
    : []

  const completedLessonIds = new Set(progressRows.map((row) => row.lessonId))

  const courseData: LearnCourseData = {
    slug: course.slug,
    title: course.title,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl,
      content: module.content,
      resources: module.resources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        url: resource.url,
      })),
      lessons: module.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        videoUrl: lesson.videoUrl,
        content: lesson.content,
        resources: lesson.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          url: resource.url,
        })),
        complete: completedLessonIds.has(lesson.id),
      })),
    })),
  }

  const totalLessons = lessonIds.length
  const completedLessons = completedLessonIds.size
  const progressPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <CourseLearningPlayer
      course={courseData}
      initialCompletedLessons={completedLessons}
      initialTotalLessons={totalLessons}
      initialProgressPercent={progressPercent}
    />
  )
}