import { NextResponse } from 'next/server'

import { InstructorApprovalStatus, RoleName, UserStatus } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

function toDisplayStatus(internCount: number) {
  if (internCount >= 6) return 'At capacity'
  if (internCount >= 3) return 'Busy'
  return 'Available'
}

function formatTrack(mentorAssignments: Array<{ program: { name: string } }>, expertise: string | null | undefined) {
  return mentorAssignments[0]?.program?.name || expertise || 'General Mentorship'
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const mentors = await prisma.user.findMany({
    where: {
      status: { not: UserStatus.DEACTIVATED },
      roles: { some: { role: { name: RoleName.MENTOR } } },
    },
    orderBy: { name: 'asc' },
    include: {
      profile: {
        select: {
          firstName: true,
          lastName: true,
          bio: true,
          institution: true,
          country: true,
          state: true,
          phone: true,
          skills: true,
        },
      },
      mentorProfile: {
        select: {
          id: true,
          expertise: true,
          bio: true,
          availability: true,
          status: true,
        },
      },
      mentorAssignments: {
        where: { status: 'ACTIVE' },
        include: {
          program: { select: { id: true, name: true } },
        },
      },
    },
  })

  return NextResponse.json({
    mentors: mentors.map((mentor) => {
      const mentorProfile = mentor.mentorProfile
      const primaryAssignment = mentor.mentorAssignments[0]
      const track = formatTrack(mentor.mentorAssignments, mentorProfile?.expertise ?? mentor.profile?.skills?.[0] ?? null)
      const profileName = mentor.name || [mentor.profile?.firstName, mentor.profile?.lastName].filter(Boolean).join(' ') || 'Mentor'
      const bio = mentorProfile?.bio || mentor.profile?.bio || 'Mentor supporting interns through structured guidance, feedback, and accountability.'
      const profileCompletion = Math.min(100, Math.round(
        [
          Boolean(profileName && profileName !== 'Mentor'),
          Boolean(mentor.email),
          Boolean(mentor.avatarUrl),
          Boolean(track),
          Boolean(bio),
          Boolean(mentorProfile?.expertise || mentor.profile?.skills?.length),
        ].filter(Boolean).length / 6 * 100,
      ))

      return {
        id: mentor.id,
        name: profileName,
        email: mentor.email,
        track,
        expertise: mentorProfile?.expertise || 'Mentorship',
        bio,
        availability: mentorProfile?.availability || 'Open to new assignments',
        status: toDisplayStatus(mentor.mentorAssignments.length),
        internCount: mentor.mentorAssignments.length,
        avatarUrl: mentor.avatarUrl,
        location: [mentor.profile?.country, mentor.profile?.state].filter(Boolean).join(', ') || 'Not specified',
        institution: mentor.profile?.institution || 'Independent mentor',
        phone: mentor.profile?.phone || 'Not provided',
        profileCompletion,
        mentorStatus: mentorProfile?.status ?? InstructorApprovalStatus.PENDING,
        assignmentProgramId: primaryAssignment?.program?.id ?? null,
        assignmentProgramName: primaryAssignment?.program?.name ?? null,
      }
    }),
  })
}

export async function PATCH(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const body = await request.json().catch(() => null)
  const mentorId = typeof body?.id === 'string' ? body.id : null
  if (!mentorId) {
    return NextResponse.json({ error: 'A mentor id is required.' }, { status: 400 })
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const expertise = typeof body?.expertise === 'string' ? body.expertise.trim() : null
  const bio = typeof body?.bio === 'string' ? body.bio.trim() : null
  const availability = typeof body?.availability === 'string' ? body.availability.trim() : null
  const track = typeof body?.track === 'string' ? body.track.trim() : null

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  const mentor = await prisma.user.findUnique({ where: { id: mentorId }, include: { mentorProfile: true, profile: true } })
  if (!mentor) {
    return NextResponse.json({ error: 'Mentor not found.' }, { status: 404 })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: mentorId },
      data: {
        name,
        email,
        avatarUrl: typeof body?.avatarUrl === 'string' && body.avatarUrl.trim() ? body.avatarUrl.trim() : mentor.avatarUrl,
      },
    }),
    prisma.profile.upsert({
      where: { userId: mentorId },
      update: {
        firstName: mentor.profile?.firstName ?? name.split(' ')[0] ?? null,
        lastName: mentor.profile?.lastName ?? ((name.split(' ').slice(1).join(' ') || null)),
        bio: bio ?? mentor.profile?.bio ?? null,
        institution: typeof body?.institution === 'string' && body.institution.trim() ? body.institution.trim() : mentor.profile?.institution ?? null,
        country: typeof body?.location === 'string' && body.location.trim() ? body.location.trim() : mentor.profile?.country ?? null,
        phone: typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : mentor.profile?.phone ?? null,
      },
      create: {
        userId: mentorId,
        firstName: name.split(' ')[0] ?? null,
        lastName: name.split(' ').slice(1).join(' ') || null,
        bio: bio ?? null,
        institution: typeof body?.institution === 'string' && body.institution.trim() ? body.institution.trim() : null,
        country: typeof body?.location === 'string' && body.location.trim() ? body.location.trim() : null,
        phone: typeof body?.phone === 'string' && body.phone.trim() ? body.phone.trim() : null,
      },
    }),
    prisma.mentorProfile.upsert({
      where: { userId: mentorId },
      update: {
        expertise: expertise ?? mentor.mentorProfile?.expertise ?? null,
        bio: bio ?? mentor.mentorProfile?.bio ?? null,
        availability: availability ?? mentor.mentorProfile?.availability ?? null,
        status: typeof body?.mentorStatus === 'string' && ['PENDING', 'APPROVED', 'REJECTED'].includes(body.mentorStatus)
          ? body.mentorStatus
          : mentor.mentorProfile?.status ?? InstructorApprovalStatus.APPROVED,
      },
      create: {
        userId: mentorId,
        expertise: expertise ?? null,
        bio: bio ?? null,
        availability: availability ?? null,
        status: InstructorApprovalStatus.APPROVED,
      },
    }),
  ])

  if (track) {
    const assignment = await prisma.mentorAssignment.findFirst({
      where: { mentorId: mentorId, status: 'ACTIVE' },
      include: { program: true },
    })

    if (assignment) {
      await prisma.internshipProgram.update({
        where: { id: assignment.programId },
        data: { name: track },
      })
    }
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const body = await request.json().catch(() => null)
  const mentorId = typeof body?.id === 'string' ? body.id : new URL(request.url).searchParams.get('id')

  if (!mentorId) {
    return NextResponse.json({ error: 'A mentor id is required.' }, { status: 400 })
  }

  await prisma.$transaction(async (tx) => {
    await tx.mentorProfile.update({
      where: { userId: mentorId },
      data: { status: InstructorApprovalStatus.REJECTED },
    }).catch(() => null)

    await tx.user.update({
      where: { id: mentorId },
      data: { status: UserStatus.DEACTIVATED },
    })
  })

  return NextResponse.json({ ok: true })
}
