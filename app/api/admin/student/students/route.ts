import { NextResponse } from 'next/server'

import { EnrollmentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const students = await getPrisma().user.findMany({
    where: { roles: { some: { role: { name: RoleName.STUDENT } } } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      profile: { select: { firstName: true, lastName: true, program: true } },
      _count: { select: { enrollments: true, certificates: true } },
      enrollments: { where: { status: EnrollmentStatus.COMPLETED }, select: { id: true } },
    },
  })

  return NextResponse.json({
    students: students.map((student) => ({
      id: student.id,
      name: student.name || [student.profile?.firstName, student.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed learner',
      email: student.email,
      program: student.profile?.program ?? null,
      status: student.status,
      joinedAt: student.createdAt.toISOString(),
      lastUpdatedAt: student.updatedAt.toISOString(),
      enrolledCourses: student._count.enrollments,
      completedCourses: student.enrollments.length,
      certificates: student._count.certificates,
    })),
  })
}
