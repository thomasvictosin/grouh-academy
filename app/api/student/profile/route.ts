import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Auto-generate a studentId the first time this profile is loaded.
    let profile = user.profile
    if (!profile) {
      profile = await prisma.profile.create({
        data: { userId, studentId: `STU-${userId.slice(0, 8).toUpperCase()}` },
      })
    } else if (!profile.studentId) {
      profile = await prisma.profile.update({
        where: { userId },
        data: { studentId: `STU-${userId.slice(0, 8).toUpperCase()}` },
      })
    }

    const [activeCourses, completedCourses, certificates, completedLessons] = await Promise.all([
      prisma.enrollment.count({ where: { userId, status: 'ACTIVE' } }),
      prisma.enrollment.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.certificate.count({ where: { userId } }),
      prisma.lessonProgress.findMany({
        where: { userId, completed: true },
        select: { lesson: { select: { duration: true } } },
      }),
    ])

    const totalMinutes = completedLessons.reduce((sum, lp) => sum + (lp.lesson.duration ?? 0), 0)

    return NextResponse.json({
      name: user.name ?? '',
      email: user.email,
      phone: profile.phone ?? '',
      bio: profile.bio ?? '',
      country: profile.country ?? '',
      state: profile.state ?? '',
      institution: profile.institution ?? '',
      program: profile.program ?? '',
      enrollmentDate: profile.enrollmentDate ? profile.enrollmentDate.toISOString().slice(0, 10) : '',
      studentId: profile.studentId,
      skills: profile.skills,
      stats: {
        activeCourses,
        completedCourses,
        certificates,
        totalLearningHours: formatMinutes(totalMinutes),
      },
    })
  } catch (error) {
    console.error('Failed to load student profile:', error)
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 })
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

  const { name, phone, bio, country, state, institution, program, enrollmentDate, skills } = body as Record<string, unknown>

  if (typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  const cleanSkills = Array.isArray(skills)
    ? skills.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, 20).map((s) => s.trim())
    : undefined

  let parsedEnrollmentDate: Date | null | undefined = undefined
  if (typeof enrollmentDate === 'string') {
    parsedEnrollmentDate = enrollmentDate.trim() === '' ? null : new Date(enrollmentDate)
    if (parsedEnrollmentDate && Number.isNaN(parsedEnrollmentDate.getTime())) {
      return NextResponse.json({ error: 'Invalid enrollment date.' }, { status: 400 })
    }
  }

  const prisma = getPrisma()

  try {
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { name: name.trim() } }),
      prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          phone: typeof phone === 'string' ? phone : undefined,
          bio: typeof bio === 'string' ? bio : undefined,
          country: typeof country === 'string' ? country : undefined,
          state: typeof state === 'string' ? state : undefined,
          institution: typeof institution === 'string' ? institution : undefined,
          program: typeof program === 'string' ? program : undefined,
          enrollmentDate: parsedEnrollmentDate ?? undefined,
          skills: cleanSkills ?? [],
        },
        update: {
          phone: typeof phone === 'string' ? phone : undefined,
          bio: typeof bio === 'string' ? bio : undefined,
          country: typeof country === 'string' ? country : undefined,
          state: typeof state === 'string' ? state : undefined,
          institution: typeof institution === 'string' ? institution : undefined,
          program: typeof program === 'string' ? program : undefined,
          enrollmentDate: parsedEnrollmentDate,
          skills: cleanSkills,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update student profile:', error)
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 })
  }
}