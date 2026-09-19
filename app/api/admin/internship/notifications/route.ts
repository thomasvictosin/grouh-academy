import { NextResponse } from 'next/server'

import {
  AssessmentAttemptStatus,
  CohortStatus,
  InternshipApplicationStatus,
  InternshipPaymentStatus,
  NotificationType,
  Prisma,
  RoleName,
} from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'
import { userHasRole } from '@/lib/rbac'

type ActivityCategory = 'Assessment' | 'Payment' | 'Task' | 'Cohort' | 'Program' | 'Announcement'
type NotificationTone = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

function simpleTimeAgo(date: Date) {
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return new Date().toISOString()
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return new Date(Date.now() - minutes * 60_000).toISOString()
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return new Date(Date.now() - hours * 60 * 60_000).toISOString()
  return date.toISOString()
}

async function requireAdmin() {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return (await userHasRole(userId, RoleName.ADMIN)) ? userId : null
}

function resolveNotificationType(value: string): NotificationType {
  switch (value) {
    case 'SUCCESS':
      return NotificationType.SUCCESS
    case 'WARNING':
      return NotificationType.WARNING
    case 'ERROR':
      return NotificationType.ERROR
    default:
      return NotificationType.INFO
  }
}

export async function GET() {
  const adminId = await requireAdmin()
  if (!adminId) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  try {
    const prisma = getPrisma()

    const [applications, assessmentAttempts, payments, taskSubmissions, cohorts] = await Promise.all([
      prisma.internshipApplication.findMany({
        where: { status: InternshipApplicationStatus.ACTIVE },
        orderBy: { createdAt: 'desc' },
        take: 8,
        include: {
          student: { select: { name: true } },
          program: { select: { name: true } },
          cohort: { select: { name: true } },
        },
      }),
      prisma.assessmentAttempt.findMany({
        where: { status: { in: [AssessmentAttemptStatus.OBJECTIVE_SUBMITTED, AssessmentAttemptStatus.UNDER_REVIEW, AssessmentAttemptStatus.PASSED, AssessmentAttemptStatus.FAILED] } },
        orderBy: { submittedAt: 'desc' },
        take: 8,
        include: {
          application: { include: { student: { select: { name: true } }, program: { select: { name: true } } } },
        },
      }),
      prisma.internshipPayment.findMany({
        where: { status: { in: [InternshipPaymentStatus.PAID, InternshipPaymentStatus.PENDING, InternshipPaymentStatus.FAILED] } },
        orderBy: { updatedAt: 'desc' },
        take: 8,
        include: {
          application: { include: { student: { select: { name: true } }, program: { select: { name: true } } } },
        },
      }),
      prisma.taskSubmission.findMany({
        where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'] } },
        orderBy: { submittedAt: 'desc' },
        take: 8,
        include: {
          user: { select: { name: true } },
          task: { select: { title: true } },
        },
      }),
      prisma.internshipCohort.findMany({
        where: { status: { in: [CohortStatus.ACTIVE, CohortStatus.UPCOMING] } },
        orderBy: { updatedAt: 'desc' },
        take: 8,
        include: { program: { select: { name: true } } },
      }),
    ])

    const activities: Array<{ id: string; title: string; body: string; createdAt: string; category: ActivityCategory; tone: NotificationTone }> = [
      ...applications.map((application) => ({
        id: `application-${application.id}`,
        title: 'New internship application',
        body: `${application.student.name ?? 'A learner'} was added to ${application.program.name}${application.cohort ? ` for ${application.cohort.name}` : ''}.`,
        createdAt: simpleTimeAgo(application.createdAt),
        category: 'Program' as const,
        tone: 'INFO' as const,
      })),
      ...assessmentAttempts.map((attempt) => ({
        id: `assessment-${attempt.id}`,
        title: 'Assessment activity',
        body: `${attempt.application.student.name ?? 'A learner'} ${attempt.status.toLowerCase().replace('_', ' ')} their internship assessment for ${attempt.application.program.name}.`,
        createdAt: simpleTimeAgo(attempt.submittedAt ?? attempt.createdAt),
        category: 'Assessment' as const,
        tone: attempt.status === 'PASSED' ? ('SUCCESS' as const) : attempt.status === 'FAILED' ? ('WARNING' as const) : ('INFO' as const),
      })),
      ...payments.map((payment) => ({
        id: `payment-${payment.id}`,
        title: `Payment ${payment.status.toLowerCase()}`,
        body: `${payment.application.student.name ?? 'A learner'} has a ${payment.status.toLowerCase()} internship payment for ${payment.application.program.name}.`,
        createdAt: simpleTimeAgo(payment.paidAt ?? payment.updatedAt),
        category: 'Payment' as const,
        tone: payment.status === InternshipPaymentStatus.PAID ? ('SUCCESS' as const) : payment.status === InternshipPaymentStatus.FAILED ? ('ERROR' as const) : ('WARNING' as const),
      })),
      ...taskSubmissions.map((submission) => ({
        id: `task-${submission.id}`,
        title: 'Task update',
        body: `${submission.user.name ?? 'A learner'} submitted work for ${submission.task.title}.`,
        createdAt: simpleTimeAgo(submission.submittedAt ?? submission.createdAt),
        category: 'Task' as const,
        tone: submission.status === 'ACCEPTED' ? ('SUCCESS' as const) : submission.status === 'REJECTED' ? ('ERROR' as const) : ('INFO' as const),
      })),
      ...cohorts.map((cohort) => ({
        id: `cohort-${cohort.id}`,
        title: `${cohort.status === CohortStatus.ACTIVE ? 'Active cohort' : 'Cohort update'}`,
        body: `${cohort.name} for ${cohort.program.name} is ${cohort.status.toLowerCase()} and starts ${new Date(cohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.`,
        createdAt: simpleTimeAgo(cohort.updatedAt),
        category: 'Cohort' as const,
        tone: cohort.status === CohortStatus.ACTIVE ? ('SUCCESS' as const) : ('INFO' as const),
      })),
    ]

    const sorted = activities.sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime())

    return NextResponse.json({
      activities: sorted.slice(0, 50),
      summary: {
        activeInterns: await prisma.internshipApplication.count({ where: { status: InternshipApplicationStatus.ACTIVE } }),
        assessmentQueue: await prisma.assessmentAttempt.count({ where: { status: { in: [AssessmentAttemptStatus.OBJECTIVE_SUBMITTED, AssessmentAttemptStatus.UNDER_REVIEW] } } }),
        pendingPayments: await prisma.internshipPayment.count({ where: { status: InternshipPaymentStatus.PENDING } }),
      },
    })
  } catch (error) {
    console.error('Failed to load internship admin notifications:', error)
    return NextResponse.json({ error: 'Unable to load internship notifications.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminId = await requireAdmin()
  if (!adminId) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const audience = typeof body?.audience === 'string' ? body.audience : 'all'
  const type = typeof body?.type === 'string' ? body.type : 'INFO'

  if (!title || !message) {
    return NextResponse.json({ error: 'A title and message are required.' }, { status: 400 })
  }

  if (title.length > 160 || message.length > 2000) {
    return NextResponse.json({ error: 'Title and message must stay within the allowed length.' }, { status: 400 })
  }

  if (!['all', 'active-cohort', 'applicants'].includes(audience)) {
    return NextResponse.json({ error: 'Select a valid internship audience.' }, { status: 400 })
  }

  try {
    const prisma = getPrisma()
    let where: Prisma.InternshipApplicationWhereInput = { status: InternshipApplicationStatus.ACTIVE }

    if (audience === 'active-cohort') {
      where = {
        status: InternshipApplicationStatus.ACTIVE,
        cohort: { status: CohortStatus.ACTIVE },
      }
    }

    const recipients = await prisma.internshipApplication.findMany({
      where,
      select: { studentId: true },
    })

    if (!recipients.length) {
      return NextResponse.json({ error: 'No internship recipients match this audience.' }, { status: 400 })
    }

    const notificationType = resolveNotificationType(type)

    const rows = recipients.map((recipient) => ({
      userId: recipient.studentId,
      title,
      message,
      type: notificationType,
    }))

    await prisma.notification.createMany({ data: rows })

    return NextResponse.json({ success: true, recipientCount: rows.length }, { status: 201 })
  } catch (error) {
    console.error('Failed to publish internship notification:', error)
    return NextResponse.json({ error: 'Unable to publish the internship notification.' }, { status: 500 })
  }
}
