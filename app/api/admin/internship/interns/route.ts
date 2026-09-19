import { NextResponse } from 'next/server'

import { AssessmentAttemptStatus, InternshipApplicationStatus, InternshipPaymentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

function formatTier(value: string | null | undefined) {
  if (!value || value === 'NONE') return 'Free Tier'
  const normalized = value.replace(/_/g, ' ').toLowerCase()
  const words = normalized.split(' ')
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function formatCohort(groupNumber: number | null | undefined) {
  return groupNumber ? `Cohort ${groupNumber}` : 'Unassigned'
}

function formatDate(date: Date | null | undefined) {
  if (!date) return 'Not available'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatRelativeDate(date: Date | null | undefined) {
  if (!date) return 'No activity yet'
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.floor(diffMs / (1000 * 60))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()

  const applications = await prisma.internshipApplication.findMany({
    where: {
      payment: { status: InternshipPaymentStatus.PAID },
      attempts: { some: { status: AssessmentAttemptStatus.PASSED } },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          profile: { select: { firstName: true, lastName: true, program: true, institution: true, bio: true } },
          groupMemberships: {
            select: {
              programId: true,
              group: {
                select: { number: true },
              },
            },
          },
        },
      },
      program: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      payment: {
        select: {
          status: true,
          paidAt: true,
          amount: true,
          currency: true,
        },
      },
      attempts: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          status: true,
          scorePercent: true,
          submittedAt: true,
          updatedAt: true,
        },
      },
    },
  })

  const progressRecords = await prisma.internshipProgress.findMany({
    where: {
      userId: { in: applications.map((application) => application.studentId) },
      programId: { in: applications.map((application) => application.programId) },
    },
    select: {
      userId: true,
      programId: true,
      progressPercent: true,
      lastUpdated: true,
    },
  })

  const progressMap = new Map<string, { progressPercent: number; lastUpdated: Date }>()
  for (const record of progressRecords) {
    progressMap.set(`${record.userId}:${record.programId}`, {
      progressPercent: record.progressPercent,
      lastUpdated: record.lastUpdated,
    })
  }

  const interns = applications.map((application) => {
    const student = application.student
    const latestAttempt = application.attempts[0]
    const progress = progressMap.get(`${student.id}:${application.programId}`)
    const membership = student.groupMemberships.find((membership) => membership.programId === application.programId)
    const lastActive = [
      student.updatedAt,
      progress?.lastUpdated,
      latestAttempt?.updatedAt,
      application.payment?.paidAt,
      application.updatedAt,
    ].filter(Boolean).sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] as Date | null

    return {
      id: student.id,
      name: student.name || [student.profile?.firstName, student.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed intern',
      email: student.email,
      profile: student.profile?.bio || student.profile?.institution || student.profile?.program || 'No profile details added yet',
      track: application.program.name,
      progress: Math.max(0, Math.min(100, progress?.progressPercent ?? 0)),
      lastActive: formatRelativeDate(lastActive),
      enrollmentDate: formatDate(application.payment?.paidAt ?? application.createdAt),
      tier: formatTier(application.premiumTier),
      cohort: formatCohort(membership?.group?.number ?? null),
      status: application.status,
      lastAssessmentStatus: latestAttempt?.status ?? 'PASSED',
      examScore: latestAttempt?.scorePercent ?? null,
      enrollmentDateIso: (application.payment?.paidAt ?? application.createdAt).toISOString(),
    }
  })

  return NextResponse.json({ interns })
}
