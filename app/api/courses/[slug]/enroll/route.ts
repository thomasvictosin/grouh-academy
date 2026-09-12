import { NextResponse } from 'next/server'
import { EnrollmentStatus } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getCourseBySlug } from '@/lib/course-data'

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  const { slug } = await params
  const course = await getCourseBySlug(slug, true)
  if (!course) return NextResponse.json({ error: 'Published course not found.' }, { status: 404 })
  const enrollment = await getPrisma().enrollment.upsert({ where: { userId_courseId: { userId, courseId: course.id } }, update: { status: EnrollmentStatus.ACTIVE }, create: { userId, courseId: course.id, status: EnrollmentStatus.ACTIVE } })
  return NextResponse.json(enrollment)
}