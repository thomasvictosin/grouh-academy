import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

function timeAgoLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })

    return NextResponse.json(
      notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        time: timeAgoLabel(n.createdAt),
      })),
    )
  } catch (error) {
    console.error('Failed to load notifications:', error)
    return NextResponse.json({ error: 'Unable to load notifications.' }, { status: 500 })
  }
}

// PATCH { id } marks one notification read, PATCH { all: true } marks everything read.
export async function PATCH(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const prisma = getPrisma()

  try {
    if (body?.all) {
      await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
      return NextResponse.json({ success: true })
    }

    const id = typeof body?.id === 'string' ? body.id : null
    if (!id) {
      return NextResponse.json({ error: 'Notification id is required.' }, { status: 400 })
    }

    await prisma.notification.updateMany({ where: { id, userId }, data: { read: true } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update notification:', error)
    return NextResponse.json({ error: 'Unable to update notification.' }, { status: 500 })
  }
}