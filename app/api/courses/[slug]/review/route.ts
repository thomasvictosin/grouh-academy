import { NextRequest, NextResponse } from 'next/server'
import { CourseStatus, RoleName } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/course-data'
import { getUserRBAC } from '@/lib/rbac'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { roles } = await getUserRBAC(userId)
  if (!roles.includes(RoleName.ADMIN)) return NextResponse.json({ error: 'Only admins can review courses.' }, { status: 403 })
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })
  const body = await request.json() as { status?: CourseStatus }
  if (body.status !== CourseStatus.PUBLISHED && body.status !== CourseStatus.REJECTED) return NextResponse.json({ error: 'Review status must be PUBLISHED or REJECTED.' }, { status: 400 })
  const updated = await getPrisma().course.update({ where: { id: course.id }, data: { status: body.status } })
  return NextResponse.json(updated)
}