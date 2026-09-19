import { NextResponse } from 'next/server'

import { InstructorApprovalStatus, RoleName, UserStatus } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

type InstructorStatus = 'Active' | 'Pending' | 'Suspended'

function normalizeInstructorStatus(user: {
  status: UserStatus
  instructorProfile?: { status?: InstructorApprovalStatus | null } | null
}): InstructorStatus {
  if (user.status === UserStatus.SUSPENDED) return 'Suspended'
  if (user.instructorProfile?.status === InstructorApprovalStatus.PENDING) return 'Pending'
  return 'Active'
}

function normalizeName(user: {
  name: string | null
  profile?: {
    firstName?: string | null
    lastName?: string | null
  } | null
}) {
  return user.name || [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed instructor'
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const instructors = await getPrisma().user.findMany({
    where: { roles: { some: { role: { name: RoleName.INSTRUCTOR } } } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      profile: { select: { firstName: true, lastName: true, phone: true, country: true, state: true, bio: true } },
      instructorProfile: { select: { expertise: true, qualification: true, bio: true, status: true } },
      _count: {
        select: {
          courseInstructors: true,
          createdCourses: true,
        },
      },
      courseInstructors: {
        select: {
          course: {
            select: {
              _count: { select: { enrollments: true } },
            },
          },
        },
      },
      createdCourses: {
        select: {
          _count: { select: { enrollments: true } },
        },
      },
    },
  })

  const payload = instructors.map((instructor) => {
    const totalCourseStudents =
      instructor.courseInstructors.reduce((sum, item) => sum + (item.course?._count?.enrollments ?? 0), 0) +
      instructor.createdCourses.reduce((sum, course) => sum + (course._count?.enrollments ?? 0), 0)

    return {
      id: instructor.id,
      name: normalizeName(instructor),
      email: instructor.email,
      phone: instructor.profile?.phone ?? '',
      specialty: instructor.instructorProfile?.expertise ?? instructor.profile?.bio ?? 'General instruction',
      bio: instructor.instructorProfile?.bio ?? instructor.profile?.bio ?? '',
      qualification: instructor.instructorProfile?.qualification ?? '',
      location: instructor.profile?.country || instructor.profile?.state || 'Remote',
      status: normalizeInstructorStatus(instructor),
      courses: instructor._count.courseInstructors + instructor._count.createdCourses,
      students: totalCourseStudents,
      rating: 4.8,
      revenue: '₦0',
      joinedAt: instructor.createdAt.toISOString(),
    }
  })

  return NextResponse.json({ instructors: payload })
}

export async function POST(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json()
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim()
  const specialty = String(body.specialty ?? '').trim() || 'General instruction'
  const qualification = String(body.qualification ?? '').trim()
  const location = String(body.location ?? '').trim() || 'Remote'
  const phone = String(body.phone ?? '').trim()
  const bio = String(body.bio ?? '').trim()
  const rawStatus = String(body.status ?? 'Active')

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    return NextResponse.json({ error: 'An instructor with this email already exists.' }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      status: rawStatus === 'Suspended' ? UserStatus.SUSPENDED : UserStatus.ACTIVE,
      roles: {
        create: [{ role: { connect: { name: RoleName.INSTRUCTOR } } }],
      },
      profile: {
        create: {
          firstName: name.split(' ')[0] || null,
          lastName: name.split(' ').slice(1).join(' ') || null,
          phone: phone || null,
          country: location || null,
          bio: bio || null,
        },
      },
      instructorProfile: {
        create: {
          expertise: specialty,
          qualification: qualification || null,
          bio: bio || null,
          status: rawStatus === 'Pending' ? InstructorApprovalStatus.PENDING : InstructorApprovalStatus.APPROVED,
        },
      },
    },
    select: {
      id: true,
    },
  })

  return NextResponse.json({ ok: true, id: user.id }, { status: 201 })
}

export async function PATCH(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json()
  const id = String(body.id ?? '').trim()

  if (!id) {
    return NextResponse.json({ error: 'Instructor ID is required.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const user = await prisma.user.findUnique({
    where: { id },
    include: { profile: true, instructorProfile: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Instructor not found.' }, { status: 404 })
  }

  const nextName = String(body.name ?? user.name ?? '').trim() || user.name || 'Unnamed instructor'
  const nextEmail = String(body.email ?? user.email ?? '').trim() || user.email
  const rawStatus = String(body.status ?? (user.status === UserStatus.SUSPENDED ? 'Suspended' : 'Active'))

  await prisma.user.update({
    where: { id },
    data: {
      email: nextEmail,
      name: nextName,
      status: rawStatus === 'Suspended' ? UserStatus.SUSPENDED : rawStatus === 'Pending' ? UserStatus.ACTIVE : UserStatus.ACTIVE,
      profile: {
        upsert: {
          create: {
            firstName: nextName.split(' ')[0] || null,
            lastName: nextName.split(' ').slice(1).join(' ') || null,
            phone: String(body.phone ?? user.profile?.phone ?? '') || null,
            country: String(body.location ?? user.profile?.country ?? '') || null,
            bio: String(body.bio ?? user.profile?.bio ?? '') || null,
          },
          update: {
            firstName: nextName.split(' ')[0] || null,
            lastName: nextName.split(' ').slice(1).join(' ') || null,
            phone: String(body.phone ?? user.profile?.phone ?? '') || null,
            country: String(body.location ?? user.profile?.country ?? '') || null,
            bio: String(body.bio ?? user.profile?.bio ?? '') || null,
          },
        },
      },
      instructorProfile: {
        upsert: {
          create: {
            expertise: String(body.specialty ?? user.instructorProfile?.expertise ?? '') || null,
            qualification: String(body.qualification ?? user.instructorProfile?.qualification ?? '') || null,
            bio: String(body.bio ?? user.instructorProfile?.bio ?? '') || null,
            status: rawStatus === 'Pending' ? InstructorApprovalStatus.PENDING : InstructorApprovalStatus.APPROVED,
          },
          update: {
            expertise: String(body.specialty ?? user.instructorProfile?.expertise ?? '') || null,
            qualification: String(body.qualification ?? user.instructorProfile?.qualification ?? '') || null,
            bio: String(body.bio ?? user.instructorProfile?.bio ?? '') || null,
            status: rawStatus === 'Pending' ? InstructorApprovalStatus.PENDING : InstructorApprovalStatus.APPROVED,
          },
        },
      },
    },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json()
  const id = String(body.id ?? '').trim()

  if (!id) {
    return NextResponse.json({ error: 'Instructor ID is required.' }, { status: 400 })
  }

  await getPrisma().user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
