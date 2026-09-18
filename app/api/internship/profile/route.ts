import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { InternshipApplicationStatus } from '@/generated/prisma/client'

function parseDurationWeeks(duration: string): number {
  const match = duration.match(/\d+/)
  return match ? Number(match[0]) : 12
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const profile = user.profile ?? (await prisma.profile.create({ data: { userId } }))

    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    })

    let internship = null
    if (application) {
      const totalWeeks = parseDurationWeeks(application.program.duration)
      const startDate = application.createdAt
      const endDate = new Date(startDate.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000)
      const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

      const [progress, mentorAssignment, certificates] = await Promise.all([
        prisma.internshipProgress.findUnique({ where: { userId_programId: { userId, programId: application.programId } } }),
        prisma.mentorAssignment.findFirst({
          where: { internId: userId, programId: application.programId, status: 'ACTIVE' },
          include: { mentor: true },
        }),
        prisma.internshipCertificate.findMany({ where: { userId, programId: application.programId } }),
      ])

      internship = {
        program: application.program.name,
        supervisor: mentorAssignment?.mentor.name ?? null,
        startDateLabel: formatDate(startDate),
        endDateLabel: formatDate(endDate),
        status: application.status,
        progressPercent: progress?.progressPercent ?? 0,
        completedTasks: progress?.completedTasks ?? 0,
        totalTasks: progress?.totalTasks ?? 0,
        remainingDaysLabel: `${remainingDays} Days`,
        certifications: certificates.map((c) => c.title),
      }
    }

     // Deliberately a separate, minimal query from the internship application
    // lookup so a problem there can never take down name/avatar rendering.
    let isPremium = false
    try {
      const application = await prisma.internshipApplication.findFirst({
        where: { studentId: userId },
        orderBy: { createdAt: 'desc' },
        select: { premiumTier: true },
      })
      isPremium = !!application && application.premiumTier !== 'NONE'
    } catch (tierError) {
      console.error('Failed to load premium tier for sidebar (non-fatal):', tierError)
    }

    return NextResponse.json({
      name: user.name ?? '',
      email: user.email,
      avatarUrl: user.avatarUrl,
      phone: profile.phone ?? '',
      location: profile.state ?? '',
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().slice(0, 10) : '',
      gender: profile.gender ?? '',
      skills: profile.skills,
      internship,
      tier: isPremium ? 'Premium' : 'Free',
    })
  } catch (error) {
    console.error('Failed to load internship profile:', error)
    return NextResponse.json({ error: 'Unable to load internship profile.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, phone, location, dateOfBirth, gender, avatarUrl } = body as Record<string, unknown>
  const prisma = getPrisma()

  try {
    let parsedDob: Date | null | undefined = undefined
    if (typeof dateOfBirth === 'string') {
      parsedDob = dateOfBirth.trim() === '' ? null : new Date(dateOfBirth)
      if (parsedDob && Number.isNaN(parsedDob.getTime())) {
        return NextResponse.json({ error: 'Invalid date of birth.' }, { status: 400 })
      }
    }

    const userUpdateData: { name?: string; avatarUrl?: string } = {}
    if (typeof name === 'string' && name.trim()) {
      userUpdateData.name = name.trim()
    }
    if (typeof avatarUrl === 'string' && avatarUrl.trim()) {
      userUpdateData.avatarUrl = avatarUrl.trim()
    }

    // Only touch Profile when a profile field was actually sent. The
    // avatar-only save from the upload control sends just { avatarUrl },
    // so running an unconditional profile.upsert() here was doing a
    // second, entirely unnecessary database round-trip inside the same
    // transaction on every avatar upload - wasted work that, combined
    // with a slow/high-latency DB connection, was enough to blow past
    // Prisma's 5s interactive-transaction timeout (P2028).
    const hasProfileFields =
      phone !== undefined || location !== undefined || dateOfBirth !== undefined || gender !== undefined

    await prisma.$transaction(
      [
        ...(Object.keys(userUpdateData).length
          ? [prisma.user.update({ where: { id: userId }, data: userUpdateData })]
          : []),
        ...(hasProfileFields
          ? [
              prisma.profile.upsert({
                where: { userId },
                create: {
                  userId,
                  phone: typeof phone === 'string' ? phone : undefined,
                  state: typeof location === 'string' ? location : undefined,
                  dateOfBirth: parsedDob ?? undefined,
                  gender: typeof gender === 'string' ? gender : undefined,
                },
                update: {
                  phone: typeof phone === 'string' ? phone : undefined,
                  state: typeof location === 'string' ? location : undefined,
                  dateOfBirth: parsedDob,
                  gender: typeof gender === 'string' ? gender : undefined,
                },
              }),
            ]
          : []),
      ],
      // Safety margin against the slow-connection issue visible in the
      // surrounding request logs (plain GETs taking 2-5s). This doesn't
      // fix that underlying latency, just stops this specific write from
      // being the first thing to fail because of it.
      { timeout: 15000 },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update internship profile:', error)
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 })
  }
}

// PATCH-like action, kept separate since it's a status toggle rather than a
// form save, and only applies to the student's most recent application.
export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const status = body?.status === 'ON_HOLD' ? InternshipApplicationStatus.ON_HOLD : InternshipApplicationStatus.ACTIVE

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ error: 'No internship application found.' }, { status: 404 })
    }

    await prisma.internshipApplication.update({ where: { id: application.id }, data: { status } })

    return NextResponse.json({ status })
  } catch (error) {
    console.error('Failed to update application status:', error)
    return NextResponse.json({ error: 'Unable to update status.' }, { status: 500 })
  }
}