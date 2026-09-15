import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { RoleName, AnnouncementScope } from '@/generated/prisma/client'

function timeAgoLabel(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

// GET: announcement feed visible to the current student —
// all GLOBAL announcements, plus MENTOR_MENTEES announcements from any
// mentor currently assigned to them.
export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const activeMentorIds = (
      await prisma.mentorAssignment.findMany({
        where: { internId: userId, status: 'ACTIVE' },
        select: { mentorId: true },
      })
    ).map((a) => a.mentorId)

    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { scope: AnnouncementScope.GLOBAL },
          ...(activeMentorIds.length
            ? [{ scope: AnnouncementScope.MENTOR_MENTEES, authorId: { in: activeMentorIds } }]
            : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { author: { select: { name: true } } },
    })

    return NextResponse.json(
      announcements.map((a) => ({
        id: a.id,
        title: a.title,
        message: a.message,
        authorName: a.author.name,
        scope: a.scope,
        postedLabel: timeAgoLabel(a.createdAt),
      })),
    )
  } catch (error) {
    console.error('Failed to load announcements:', error)
    return NextResponse.json({ error: 'Unable to load announcements.' }, { status: 500 })
  }
}

// POST: create an announcement. Mentors may only post MENTOR_MENTEES
// announcements (authored as themselves); admins may post either scope.
export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const scope = body?.scope === 'GLOBAL' ? AnnouncementScope.GLOBAL : AnnouncementScope.MENTOR_MENTEES
  const programId = typeof body?.programId === 'string' ? body.programId : undefined

  if (!title || !message) {
    return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 })
  }

  const [isAdmin, isMentor] = await Promise.all([
    userHasRole(userId, [RoleName.ADMIN]),
    userHasRole(userId, [RoleName.MENTOR]),
  ])

  if (scope === AnnouncementScope.GLOBAL && !isAdmin) {
    return NextResponse.json({ error: 'Only admins can post global announcements.' }, { status: 403 })
  }
  if (scope === AnnouncementScope.MENTOR_MENTEES && !isMentor && !isAdmin) {
    return NextResponse.json({ error: 'Only mentors or admins can post this announcement.' }, { status: 403 })
  }

  const prisma = getPrisma()

  try {
    const announcement = await prisma.announcement.create({
      data: { authorId: userId, scope, programId, title, message },
    })

    return NextResponse.json({ id: announcement.id, success: true })
  } catch (error) {
    console.error('Failed to create announcement:', error)
    return NextResponse.json({ error: 'Unable to create announcement.' }, { status: 500 })
  }
}