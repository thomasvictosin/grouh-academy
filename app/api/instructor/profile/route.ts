import { NextResponse } from 'next/server'

import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  try {
    const user = await getPrisma().user.findUnique({
      where: { id: userId },
      include: { profile: true, instructorProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    return NextResponse.json({
      name: user.name ?? '',
      email: user.email,
      avatarUrl: user.avatarUrl ?? '',
      phone: user.profile?.phone ?? '',
      bio: user.instructorProfile?.bio ?? user.profile?.bio ?? '',
      country: user.profile?.country ?? '',
      state: user.profile?.state ?? '',
      specialty: user.instructorProfile?.expertise ?? '',
      qualification: user.instructorProfile?.qualification ?? '',
      location: [user.profile?.country, user.profile?.state].filter(Boolean).join(', ') || 'Remote',
    })
  } catch (error) {
    console.error('Failed to load instructor profile:', error)
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

  const { name, phone, bio, country, state, specialty, qualification, location } = body as Record<string, unknown>

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }

  try {
    const prisma = getPrisma()
    const [countryValue, stateValue] = typeof location === 'string'
      ? location.split(',').map((value) => value.trim())
      : [typeof country === 'string' ? country : undefined, typeof state === 'string' ? state : undefined]

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { name: name.trim() },
      }),
      prisma.profile.upsert({
        where: { userId },
        create: {
          userId,
          phone: typeof phone === 'string' ? phone : null,
          bio: typeof bio === 'string' ? bio : null,
          country: countryValue || (typeof country === 'string' ? country : null),
          state: stateValue || (typeof state === 'string' ? state : null),
        },
        update: {
          phone: typeof phone === 'string' ? phone : undefined,
          bio: typeof bio === 'string' ? bio : undefined,
          country: countryValue || (typeof country === 'string' ? country : undefined),
          state: stateValue || (typeof state === 'string' ? state : undefined),
        },
      }),
      prisma.instructorProfile.upsert({
        where: { userId },
        create: {
          userId,
          expertise: typeof specialty === 'string' ? specialty : null,
          qualification: typeof qualification === 'string' ? qualification : null,
          bio: typeof bio === 'string' ? bio : null,
        },
        update: {
          expertise: typeof specialty === 'string' ? specialty : undefined,
          qualification: typeof qualification === 'string' ? qualification : undefined,
          bio: typeof bio === 'string' ? bio : undefined,
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save instructor profile:', error)
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 })
  }
}
