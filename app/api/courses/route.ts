import { NextRequest, NextResponse } from 'next/server'
import { CourseStatus, RoleName } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { courseInclude, courseSlug, getPublishedCourses, moduleCreateData, parseCoursePrice, resolveCourseCategory, serializeCourse, type CourseWriteInput } from '@/lib/course-data'
import { getUserRBAC } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get('manage') === '1') {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
    const { roles } = await getUserRBAC(userId)
    if (!roles.includes(RoleName.ADMIN)) return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })
    const courses = await getPrisma().course.findMany({ include: courseInclude, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(courses.map(serializeCourse))
  }
  const courses = await getPublishedCourses()
  return NextResponse.json(courses.map(serializeCourse))
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { roles } = await getUserRBAC(userId)
  if (!roles.includes(RoleName.ADMIN) && !roles.includes(RoleName.INSTRUCTOR)) return NextResponse.json({ error: 'Course creation is not allowed.' }, { status: 403 })

  const body = await request.json() as CourseWriteInput
  if (!body.title?.trim()) return NextResponse.json({ error: 'Course title is required.' }, { status: 400 })
  const prisma = getPrisma()
  const category = await resolveCourseCategory(prisma, body.category)
  const status = roles.includes(RoleName.ADMIN) ? CourseStatus.PUBLISHED : CourseStatus.DRAFT
  const course = await prisma.course.create({
    data: {
      title: body.title.trim(),
      slug: `${courseSlug(body.title)}-${Date.now()}`,
      description: body.description ?? null,
      price: parseCoursePrice(body.price),
      thumbnail: body.thumbnail ?? null,
      status,
      createdById: userId,
      categoryId: category?.id,
      modules: { create: moduleCreateData(body.modules ?? []) },
    },
    include: courseInclude,
  })
  if (roles.includes(RoleName.INSTRUCTOR)) await prisma.courseInstructor.create({ data: { courseId: course.id, instructorId: userId } })
  return NextResponse.json(serializeCourse(course), { status: 201 })
}
