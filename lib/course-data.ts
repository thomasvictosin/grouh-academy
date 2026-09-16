import { CourseStatus } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'

export const courseInclude = {
  category: true,
  creator: { select: { id: true, name: true, email: true } },
  instructors: { include: { instructor: { select: { id: true, name: true, email: true } } } },
  modules: { orderBy: { order: 'asc' as const }, include: { lessons: { orderBy: { order: 'asc' as const }, include: { resources: true } }, resources: true } },
  reviews: { select: { rating: true } },
  _count: { select: { enrollments: true, reviews: true, modules: true } },
} as const

export type CourseLessonInput = {
  id?: string
  title: string
  content?: string | null
  videoUrl?: string | null
  duration?: number | null
  resources?: Array<{ id?: string; title: string; type: string; url: string }>
}

export type CourseModuleInput = {
  id?: string
  title: string
  description?: string | null
  videoUrl?: string | null
  content?: string | null
  resources?: Array<{ id?: string; title: string; type: string; url: string }>
  lessons?: CourseLessonInput[]
}

export type CourseWriteInput = {
  title?: string
  description?: string | null
  category?: string | null
  price?: number
  thumbnail?: string | null
  modules?: CourseModuleInput[]
}

export type CourseDb = ReturnType<typeof getPrisma>
type ExistingCourse = NonNullable<Awaited<ReturnType<typeof getCourseBySlug>>>

export function courseSlug(title: string) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function parseCoursePrice(price: unknown) {
  if (typeof price === 'number' && Number.isFinite(price)) return Math.round(price)
  if (typeof price === 'string') return Math.round(Number(price.replace(/[^0-9.]/g, '')) || 0)
  return 0
}

export async function getPublishedCourses() {
  return getPrisma().course.findMany({ where: { status: CourseStatus.PUBLISHED }, include: courseInclude, orderBy: { createdAt: 'desc' } })
}

export async function getCourseBySlug(slug: string, publishedOnly = false) {
  return getPrisma().course.findFirst({ where: { slug, ...(publishedOnly ? { status: CourseStatus.PUBLISHED } : {}) }, include: courseInclude })
}

export function serializeCourse(course: Awaited<ReturnType<typeof getCourseBySlug>>) {
  if (!course) return null
  const lessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  const rating = course.reviews.length ? course.reviews.reduce((total, review) => total + review.rating, 0) / course.reviews.length : null
  return { ...course, lessonCount: lessons, rating }
}

/**
 * The exact shape returned to the client by every course API route
 * (GET /api/courses, GET /api/courses/[slug], POST /api/courses,
 * PATCH /api/courses/[slug]), derived directly from serializeCourse()
 * rather than hand-typed.
 *
 * Frontend components should import this instead of declaring their own
 * local `type Course = {...}` / `type SavedCourse = {...}`. A hand-typed
 * guess is what caused the category-shape bug in CourseCatalog.tsx:
 * `category` here is the full CourseCategory relation object
 * ({ id, name, slug, description, ... } | null), not a plain string,
 * because courseInclude joins the relation rather than flattening it.
 * If this shape ever changes, every importer gets a compile error at
 * the exact mismatched usage instead of a runtime surprise.
 */
export type PublicCourse = NonNullable<ReturnType<typeof serializeCourse>>

/**
 * Shape returned by GET /api/student/dashboard. Kept next to PublicCourse
 * for the same reason: the client page imports this type instead of
 * hand-typing its own guess at the response shape.
 */
export type DashboardStats = {
  enrolledCourses: number
  completedCourses: number
  overallProgressPercent: number
}

export type DashboardCourseProgress = {
  slug: string
  title: string
  thumbnail: string | null
  completedLessons: number
  totalLessons: number
  progressPercent: number
}

export type StudentDashboardResponse = {
  stats: DashboardStats
  inProgress: DashboardCourseProgress[]
  recommended: PublicCourse[]
}

export function userOwnsCourse(course: Pick<ExistingCourse, 'createdById' | 'instructors'>, userId: string) {
  return course.createdById === userId || course.instructors.some((item) => item.instructorId === userId)
}

export async function resolveCourseCategory(db: CourseDb, name?: string | null) {
  const trimmed = name?.trim()
  if (!trimmed) return null
  return db.courseCategory.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed, slug: courseSlug(trimmed) },
  })
}

type CourseResourceInput = Array<{ id?: string; title: string; type: string; url: string }> | undefined

function resourceCreateData(resources: CourseResourceInput) {
  return (resources ?? []).map((resource) => ({
    title: resource.title || resource.url,
    type: resource.type || 'link',
    url: resource.url,
  }))
}

export function moduleCreateData(modules: CourseModuleInput[]) {
  return modules.map((module, moduleIndex) => ({
    title: module.title,
    description: module.description ?? null,
    videoUrl: module.videoUrl ?? null,
    content: module.content ?? null,
    order: moduleIndex,
    resources: { create: resourceCreateData(module.resources) },
    lessons: {
      create: (module.lessons ?? []).map((lesson, lessonIndex) => ({
        title: lesson.title,
        content: lesson.content ?? null,
        videoUrl: lesson.videoUrl ?? null,
        duration: lesson.duration ?? null,
        order: lessonIndex,
        resources: { create: resourceCreateData(lesson.resources) },
      })),
    },
  }))
}

async function syncLessonResources(
  db: CourseDb,
  lessonId: string,
  incoming: NonNullable<CourseLessonInput['resources']>,
  existing: Array<{ id: string }>,
) {
  const existingById = new Map(existing.map((resource) => [resource.id, resource]))
  const keptIds = incoming.map((resource) => resource.id).filter((id): id is string => Boolean(id && existingById.has(id)))

  await db.lessonResource.deleteMany({
    where: { lessonId, ...(keptIds.length ? { id: { notIn: keptIds } } : {}) },
  })

  for (const resource of incoming) {
    const data = { title: resource.title || resource.url, type: resource.type || 'link', url: resource.url }
    if (resource.id && existingById.has(resource.id)) {
      await db.lessonResource.update({ where: { id: resource.id }, data })
    } else {
      await db.lessonResource.create({ data: { ...data, lessonId } })
    }
  }
}

async function syncModuleResources(
  db: CourseDb,
  moduleId: string,
  incoming: NonNullable<CourseModuleInput['resources']>,
  existing: Array<{ id: string }>,
) {
  const existingById = new Map(existing.map((resource) => [resource.id, resource]))
  const keptIds = incoming.map((resource) => resource.id).filter((id): id is string => Boolean(id && existingById.has(id)))

  await db.moduleResource.deleteMany({
    where: { moduleId, ...(keptIds.length ? { id: { notIn: keptIds } } : {}) },
  })

  for (const resource of incoming) {
    const data = { title: resource.title || resource.url, type: resource.type || 'link', url: resource.url }
    if (resource.id && existingById.has(resource.id)) {
      await db.moduleResource.update({ where: { id: resource.id }, data })
    } else {
      await db.moduleResource.create({ data: { ...data, moduleId } })
    }
  }
}

async function syncLessons(
  db: CourseDb,
  moduleId: string,
  incoming: CourseLessonInput[],
  existing: ExistingCourse['modules'][number]['lessons'],
) {
  const existingById = new Map(existing.map((lesson) => [lesson.id, lesson]))
  const keptIds = incoming.map((lesson) => lesson.id).filter((id): id is string => Boolean(id && existingById.has(id)))

  await db.lesson.deleteMany({
    where: { moduleId, ...(keptIds.length ? { id: { notIn: keptIds } } : {}) },
  })

  for (const [lessonIndex, lesson] of incoming.entries()) {
    const existingLesson = lesson.id ? existingById.get(lesson.id) : undefined
    if (existingLesson) {
      await db.lesson.update({
        where: { id: existingLesson.id },
        data: {
          title: lesson.title,
          content: lesson.content ?? null,
          videoUrl: lesson.videoUrl ?? null,
          duration: lesson.duration ?? null,
          order: lessonIndex,
        },
      })
      await syncLessonResources(db, existingLesson.id, lesson.resources ?? [], existingLesson.resources)
    } else {
      await db.lesson.create({
        data: {
          moduleId,
          title: lesson.title,
          content: lesson.content ?? null,
          videoUrl: lesson.videoUrl ?? null,
          duration: lesson.duration ?? null,
          order: lessonIndex,
          resources: { create: resourceCreateData(lesson.resources) },
        },
      })
    }
  }
}

export async function syncCourseCurriculum(db: CourseDb, courseId: string, incoming: CourseModuleInput[], existing: ExistingCourse['modules']) {
  const existingById = new Map(existing.map((module) => [module.id, module]))
  const keptIds = incoming.map((module) => module.id).filter((id): id is string => Boolean(id && existingById.has(id)))

  await db.courseModule.deleteMany({
    where: { courseId, ...(keptIds.length ? { id: { notIn: keptIds } } : {}) },
  })

  for (const [moduleIndex, module] of incoming.entries()) {
    const existingModule = module.id ? existingById.get(module.id) : undefined
    if (existingModule) {
      await db.courseModule.update({
        where: { id: existingModule.id },
        data: {
          title: module.title,
          description: module.description ?? null,
          videoUrl: module.videoUrl ?? null,
          content: module.content ?? null,
          order: moduleIndex,
        },
      })
      await syncModuleResources(db, existingModule.id, module.resources ?? [], existingModule.resources)
      await syncLessons(db, existingModule.id, module.lessons ?? [], existingModule.lessons)
    } else {
      await db.courseModule.create({
        data: {
          courseId,
          title: module.title,
          description: module.description ?? null,
          videoUrl: module.videoUrl ?? null,
          content: module.content ?? null,
          order: moduleIndex,
          resources: { create: resourceCreateData(module.resources) },
          lessons: {
            create: (module.lessons ?? []).map((lesson, lessonIndex) => ({
              title: lesson.title,
              content: lesson.content ?? null,
              videoUrl: lesson.videoUrl ?? null,
              duration: lesson.duration ?? null,
              order: lessonIndex,
              resources: { create: resourceCreateData(lesson.resources) },
            })),
          },
        },
      })
    }
  }
}

export function nextInstructorCourseStatus(current: CourseStatus, isAdmin: boolean, requested?: CourseStatus) {
  if (requested === CourseStatus.PUBLISHED && !isAdmin) return current
  if (isAdmin && requested) return requested
  if (!isAdmin && current === CourseStatus.PUBLISHED) return CourseStatus.PENDING_REVIEW
  return current
}