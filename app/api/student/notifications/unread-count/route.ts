import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const count = await prisma.notification.count({ where: { userId, read: false } })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Failed to load unread notification count:', error)
    return NextResponse.json({ error: 'Unable to load notifications.' }, { status: 500 })
  }
}