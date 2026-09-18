import { NextResponse } from 'next/server'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 },
    )
  }

  if (!(await userHasRole(userId, RoleName.ADMIN))) {
    return NextResponse.json(
      { error: 'Administrator access is required.' },
      { status: 403 },
    )
  }

  const prisma = getPrisma()

  try {
    const [user, unreadNotificationCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          name: true,
          avatarUrl: true,
          profile: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ])

    if (!user) {
      return NextResponse.json(
        { error: 'Administrator account was not found.' },
        { status: 404 },
      )
    }

    const profileName = [user.profile?.firstName, user.profile?.lastName]
      .filter(Boolean)
      .join(' ')

    return NextResponse.json({
      name: profileName || user.name || 'Administrator',
      avatarUrl: user.avatarUrl,
      unreadNotificationCount,
    })
  } catch (error) {
    console.error('Failed to load administrator context:', error)
    return NextResponse.json(
      { error: 'Unable to load administrator context.' },
      { status: 500 },
    )
  }
}
