import { NextResponse } from 'next/server'

import { NotificationType } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'

function formatTime(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const [courses, directNotifications, recentEnrollments, recentSubmissions] = await Promise.all([
      prisma.course.findMany({
        where: {
          OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
        },
        select: { id: true, title: true, slug: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.enrollment.findMany({
        where: {
          course: {
            OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
          },
        },
        orderBy: { enrolledAt: 'desc' },
        take: 10,
        select: {
          id: true,
          enrolledAt: true,
          user: { select: { id: true, name: true, profile: { select: { firstName: true, lastName: true } } } },
          course: { select: { id: true, title: true } },
        },
      }),
      prisma.assignmentSubmission.findMany({
        where: {
          assignment: {
            course: {
              OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
            },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          submittedAt: true,
          status: true,
          user: { select: { id: true, name: true, profile: { select: { firstName: true, lastName: true } } } },
          assignment: { select: { id: true, title: true, course: { select: { title: true } } } },
        },
      }),
    ])

    const derivedNotifications = [
      ...recentEnrollments.map((enrollment) => ({
        id: `enrollment-${enrollment.id}`,
        title: 'New learner enrolled',
        message: `${enrollment.user.name || [enrollment.user.profile?.firstName, enrollment.user.profile?.lastName].filter(Boolean).join(' ') || 'A learner'} enrolled in ${enrollment.course.title}.`,
        type: NotificationType.INFO,
        read: false,
        createdAt: enrollment.enrolledAt,
        source: 'course',
      })),
      ...recentSubmissions.map((submission) => ({
        id: `submission-${submission.id}`,
        title: 'Assignment submitted',
        message: `${submission.user.name || [submission.user.profile?.firstName, submission.user.profile?.lastName].filter(Boolean).join(' ') || 'A learner'} submitted ${submission.assignment.title} for ${submission.assignment.course.title}.`,
        type: submission.status === 'REJECTED' ? NotificationType.WARNING : NotificationType.SUCCESS,
        read: false,
        createdAt: submission.submittedAt,
        source: 'course',
      })),
      ...directNotifications.map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
        source: 'system',
      })),
    ]

    const notifications = derivedNotifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 30)
      .map((notification) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        time: formatTime(notification.createdAt),
        source: notification.source,
      }))

    return NextResponse.json({
      notifications,
      courses: courses.map((course) => ({ id: course.id, title: course.title })),
    })
  } catch (error) {
    console.error('Failed to load instructor notifications:', error)
    return NextResponse.json({ error: 'Unable to load notifications.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const courseId = typeof body?.courseId === 'string' ? body.courseId : null

  if (!title || !message) {
    return NextResponse.json({ error: 'A title and message are required.' }, { status: 400 })
  }

  try {
    const prisma = getPrisma()

    const students = await prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            course: {
              ...(courseId
                ? { id: courseId }
                : {
                    OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
                  }),
              ...(courseId
                ? {
                    OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
                  }
                : {}),
            },
          },
        },
      },
      select: { id: true },
    })

    if (!students.length) {
      return NextResponse.json({ error: 'No enrolled students were found for this course.', status: 400 })
    }

    await prisma.notification.createMany({
      data: students.map((student) => ({
        userId: student.id,
        title,
        message,
        type: NotificationType.INFO,
      })),
    })

    return NextResponse.json({ success: true, recipientCount: students.length }, { status: 201 })
  } catch (error) {
    console.error('Failed to send instructor notification:', error)
    return NextResponse.json({ error: 'Unable to send notifications.' }, { status: 500 })
  }
}
