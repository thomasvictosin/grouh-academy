import { NextResponse } from 'next/server'
import { CourseStatus, RoleName } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/course-data'
import { getUserRBAC } from '@/lib/rbac'

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { roles } = await getUserRBAC(userId)
  if (!roles.includes(RoleName.INSTRUCTOR)) return NextResponse.json({ error: 'Only instructors can submit courses.' }, { status: 403 })
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course || (!course.instructors.some((item) => item.instructorId === userId) && course.createdById !== userId)) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  if (course.status === CourseStatus.PENDING_REVIEW) return NextResponse.json(course)
  if (course.status !== CourseStatus.DRAFT && course.status !== CourseStatus.REJECTED && course.status !== CourseStatus.PUBLISHED) {
    return NextResponse.json({ error: 'This course cannot be submitted for review.' }, { status: 409 })
  }
  const updated = await getPrisma().course.update({ where: { id: course.id }, data: { status: CourseStatus.PENDING_REVIEW } })
  return NextResponse.json(updated)
}