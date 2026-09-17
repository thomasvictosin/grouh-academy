import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const scheduledAtRaw = typeof body?.scheduledAt === 'string' ? body.scheduledAt : ''
  const title = typeof body?.title === 'string' && body.title.trim() ? body.title.trim() : 'Group Meeting'

  const scheduledAt = new Date(scheduledAtRaw)
  if (!scheduledAtRaw || Number.isNaN(scheduledAt.getTime())) {
    return NextResponse.json({ error: 'A valid meeting date/time is required.' }, { status: 400 })
  }
  if (scheduledAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'Meeting time must be in the future.' }, { status: 400 })
  }

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ error: 'No internship application found.' }, { status: 404 })
    }

    const membership = await prisma.internshipGroupMember.findUnique({
      where: { programId_userId: { programId: application.programId, userId } },
      include: { group: true },
    })
    if (!membership) {
      return NextResponse.json({ error: 'You are not assigned to a group yet.' }, { status: 404 })
    }
    if (membership.group.leaderId !== userId) {
      return NextResponse.json({ error: 'Only the group leader can schedule a meeting.' }, { status: 403 })
    }

    const meeting = await prisma.groupMeeting.create({
      data: { groupId: membership.groupId, createdById: userId, title, scheduledAt },
    })

    return NextResponse.json({ id: meeting.id, success: true })
  } catch (error) {
    console.error('Failed to schedule meeting:', error)
    return NextResponse.json({ error: 'Unable to schedule meeting.' }, { status: 500 })
  }
}