import { NextRequest, NextResponse } from 'next/server'
import { CourseStatus, RoleName } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import {
  courseInclude,
  courseSlug,
  getPublishedCourses,
  moduleCreateData,
  parseCoursePrice,
  resolveCourseCategory,
  serializeCourse,
  type CourseWriteInput,
} from '@/lib/course-data'
import { getUserRBAC } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('manage') === '1') {
    const userId = await getCurrentUserId()

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 },
      )
    }

    const { roles } = await getUserRBAC(userId)

    if (!roles.includes(RoleName.ADMIN)) {
      return NextResponse.json(
        { error: 'Admin access required.' },
        { status: 403 },
      )
    }

    const courses = await getPrisma().course.findMany({
      include: courseInclude,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(courses.map(serializeCourse))
  }

  const courses = await getPublishedCourses()

  return NextResponse.json(courses.map(serializeCourse))
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    )
  }

  const { roles } = await getUserRBAC(userId)

  const isAdmin = roles.includes(RoleName.ADMIN)
  const isInstructor = roles.includes(RoleName.INSTRUCTOR)

  if (!isAdmin && !isInstructor) {
    return NextResponse.json(
      { error: 'Course creation is not allowed.' },
      { status: 403 },
    )
  }

  let body: CourseWriteInput & { status?: unknown }

  try {
    body = (await request.json()) as CourseWriteInput
  } catch {
    return NextResponse.json(
      { error: 'Invalid course data.' },
      { status: 400 },
    )
  }

  if (!body.title?.trim()) {
    return NextResponse.json(
      { error: 'Course title is required.' },
      { status: 400 },
    )
  }

  const prisma = getPrisma()

  const category = await resolveCourseCategory(
    prisma,
    body.category,
  )

  // A course begins as a draft unless an administrator explicitly selected
  // Publish in the course builder. This is deliberately not inferred from
  // the creator role: administrators can still save unfinished drafts.
  const requestedStatus = body.status === CourseStatus.PUBLISHED
    ? CourseStatus.PUBLISHED
    : CourseStatus.DRAFT

  if (requestedStatus === CourseStatus.PUBLISHED && !isAdmin) {
    return NextResponse.json(
      { error: 'Only an administrator can publish a course.' },
      { status: 403 },
    )
  }

  const course = await prisma.course.create({
    data: {
      title: body.title.trim(),
      slug: `${courseSlug(body.title)}-${Date.now()}`,
      description: body.description ?? null,
      price: parseCoursePrice(body.price),
      thumbnail: body.thumbnail ?? null,

      status: requestedStatus,

      createdById: userId,

      categoryId: category?.id,

      modules: {
        create: moduleCreateData(body.modules ?? []),
      },
    },

    include: courseInclude,
  })

  /*
   * Instructor-created courses need an instructor relationship.
   *
   * Admin-created courses do not need this relationship because
   * createdById already identifies the administrator who created it.
   */
  if (isInstructor && !isAdmin) {
    await prisma.courseInstructor.create({
      data: {
        courseId: course.id,
        instructorId: userId,
      },
    })
  }

  /*
   * Keep the response contract as a single serialized course object.
   * The client uses data.slug to continue editing the newly created course.
   */
  return NextResponse.json(
    serializeCourse(course),
    { status: 201 },
  )
}
