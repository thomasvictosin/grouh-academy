import { NextResponse } from 'next/server'

import { AssessmentAttemptStatus, InternshipPaymentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

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

function formatOnboardingSummary(onboardingAnswers: unknown) {
  if (!onboardingAnswers || typeof onboardingAnswers !== 'object') {
    return 'No onboarding details saved yet.'
  }

  const answers = onboardingAnswers as Record<string, unknown>
  const detailParts = [
    typeof answers.experienceLevel === 'string' ? `Experience: ${answers.experienceLevel}` : null,
    typeof answers.availability === 'string' ? `Time: ${answers.availability}` : null,
    typeof answers.motivation === 'string' && answers.motivation.trim() ? `Motivation: ${answers.motivation.trim().slice(0, 120)}${answers.motivation.trim().length > 120 ? '…' : ''}` : null,
  ].filter(Boolean)

  return detailParts.length ? detailParts.join(' • ') : 'No onboarding details saved yet.'
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const applications = await getPrisma().internshipApplication.findMany({
    where: {
      OR: [
        { payment: null },
        { payment: { status: { not: InternshipPaymentStatus.PAID } } },
      ],
      attempts: {
        some: {
          status: { not: AssessmentAttemptStatus.NOT_STARTED },
        },
      },
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
          profile: {
            select: {
              firstName: true,
              lastName: true,
              institution: true,
              program: true,
              bio: true,
            },
          },
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
          createdAt: true,
        },
      },
      attempts: {
        orderBy: { createdAt: 'desc' },
        select: {
          status: true,
          scorePercent: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  })

  const enrolleeRows = applications.map((application) => {
    const student = application.student
    const latestAttempt = application.attempts[0]
    const membership = student.groupMemberships.find((item) => item.programId === application.programId)

    return {
      id: student.id,
      name: student.name || [student.profile?.firstName, student.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed enrollee',
      email: student.email,
      track: application.program.name,
      onboarding: formatOnboardingSummary(application.onboardingAnswers),
      experienceLevel: typeof application.onboardingAnswers === 'object' && application.onboardingAnswers && 'experienceLevel' in application.onboardingAnswers ? String((application.onboardingAnswers as Record<string, unknown>).experienceLevel ?? 'Not provided') : 'Not provided',
      availability: typeof application.onboardingAnswers === 'object' && application.onboardingAnswers && 'availability' in application.onboardingAnswers ? String((application.onboardingAnswers as Record<string, unknown>).availability ?? 'Not provided') : 'Not provided',
      motivation: typeof application.onboardingAnswers === 'object' && application.onboardingAnswers && 'motivation' in application.onboardingAnswers ? String((application.onboardingAnswers as Record<string, unknown>).motivation ?? 'Not provided') : 'Not provided',
      examScore: latestAttempt?.scorePercent ?? null,
      attempts: application.attempts.length,
      cohort: formatCohort(membership?.group?.number ?? null),
      status: application.payment?.status ? application.payment.status : 'NOT_STARTED',
      lastUpdated: formatDate(latestAttempt?.updatedAt ?? application.updatedAt),
    }
  })

  return NextResponse.json({ enrolleeRows })
}
