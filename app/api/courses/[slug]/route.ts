import { NextRequest, NextResponse } from 'next/server'
import { CourseStatus, RoleName } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { courseInclude, getCourseBySlug, nextInstructorCourseStatus, parseCoursePrice, resolveCourseCategory, serializeCourse, syncCourseCurriculum, userOwnsCourse, type CourseWriteInput } from '@/lib/course-data'
import { getUserRBAC } from '@/lib/rbac'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  if (course.status === CourseStatus.PUBLISHED) return NextResponse.json(serializeCourse(course))

  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { roles } = await getUserRBAC(userId)
  const isAdmin = roles.includes(RoleName.ADMIN)
  if (!isAdmin && !userOwnsCourse(course, userId)) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  return NextResponse.json(serializeCourse(course))
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { slug } = await params
  const existing = await getCourseBySlug(slug)
  if (!existing) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  const { roles } = await getUserRBAC(userId)
  const isAdmin = roles.includes(RoleName.ADMIN)
  const isInstructor = roles.includes(RoleName.INSTRUCTOR)
  if (!isAdmin && !userOwnsCourse(existing, userId)) return NextResponse.json({ error: 'You cannot edit this course.' }, { status: 403 })

  const body = await request.json() as CourseWriteInput & { status?: unknown }

  // Only trust `status` when it is actually one of the known enum values.
  // Anything else (missing, malformed, or an unexpected type from a
  // hand-crafted request) is treated as "no status change requested" so
  // it falls through to nextInstructorCourseStatus's default behavior of
  // preserving the course's current status.
  const requestedStatus: CourseStatus | undefined =
    typeof body.status === 'string' && (Object.values(CourseStatus) as string[]).includes(body.status)
      ? (body.status as CourseStatus)
      : undefined

  if (requestedStatus === CourseStatus.PUBLISHED && !isAdmin) {
    return NextResponse.json({ error: 'Only an admin can publish a course.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const category = body.category !== undefined ? await resolveCourseCategory(prisma, body.category) : undefined
  const nextStatus = nextInstructorCourseStatus(existing.status, isAdmin, isAdmin ? requestedStatus : undefined)

  const course = await prisma.$transaction(async (tx) => {
    const db = tx as ReturnType<typeof getPrisma>
    await db.course.update({
      where: { id: existing.id },
      data: {
        title: body.title?.trim() || existing.title,
        description: body.description !== undefined ? body.description : existing.description,
        price: body.price !== undefined ? parseCoursePrice(body.price) : existing.price,
        thumbnail: body.thumbnail !== undefined ? body.thumbnail : existing.thumbnail,
        categoryId: category === undefined ? existing.categoryId : category?.id ?? null,
        status: nextStatus,
      },
    })

    if (isInstructor) {
      await db.courseInstructor.upsert({
        where: { courseId_instructorId: { courseId: existing.id, instructorId: userId } },
        update: {},
        create: { courseId: existing.id, instructorId: userId },
      })
    }

    if (body.modules) await syncCourseCurriculum(db, existing.id, body.modules, existing.modules)

    return db.course.findUniqueOrThrow({ where: { id: existing.id }, include: courseInclude })
  })

  return NextResponse.json(serializeCourse(course))
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { roles } = await getUserRBAC(userId)
  if (!roles.includes(RoleName.ADMIN)) return NextResponse.json({ error: 'Only an administrator can delete a course.' }, { status: 403 })
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  await getPrisma().course.delete({ where: { id: course.id } })
  return new NextResponse(null, { status: 204 })
}
