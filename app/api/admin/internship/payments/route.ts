import { NextResponse } from 'next/server'

import { InternshipPaymentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

function formatTier(value: string | null | undefined) {
  if (!value || value === 'NONE') return 'Free Tier'
  const normalized = value.replace(/_/g, ' ').toLowerCase()
  return normalized
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatPaymentStatus(status: InternshipPaymentStatus) {
  const mapping: Record<InternshipPaymentStatus, string> = {
    PENDING: 'Pending',
    PAID: 'Paid',
    FAILED: 'Failed',
    CANCELLED: 'Cancelled',
  }

  return mapping[status]
}

function formatInternshipStatus(applicationStatus: string | null | undefined, paymentStatus: InternshipPaymentStatus, cohortStatus?: string | null) {
  if (paymentStatus === InternshipPaymentStatus.PAID && cohortStatus === 'COMPLETED') return 'Completed'
  if (paymentStatus === InternshipPaymentStatus.PAID && (applicationStatus === 'ACTIVE' || !applicationStatus)) return 'In Progress'
  if (paymentStatus === InternshipPaymentStatus.PAID && applicationStatus === 'ON_HOLD') return 'Awaiting Next Course'
  if (paymentStatus === InternshipPaymentStatus.PENDING || paymentStatus === InternshipPaymentStatus.FAILED || paymentStatus === InternshipPaymentStatus.CANCELLED) return 'Awaiting Next Course'
  if (cohortStatus === 'ACTIVE') return 'In Progress'
  return 'Awaiting Next Course'
}

function formatDate(date: Date | null | undefined) {
  if (!date) return 'Not available'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function formatMoney(amount: number, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()

  const payments = await prisma.internshipPayment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          program: {
            select: {
              id: true,
              name: true,
              assessmentFee: true,
            },
          },
          cohort: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
          attempts: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              status: true,
              scorePercent: true,
              submittedAt: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json({
    payments: payments.map((payment) => {
      const application = payment.application
      const studentName = application.student.name || [application.student.profile?.firstName, application.student.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed intern'

      const internshipStatus = formatInternshipStatus(
        application.status,
        payment.status,
        application.cohort?.status ?? null,
      )

      return {
        id: payment.id,
        transactionId: payment.reference,
        intern: studentName,
        email: application.student.email,
        name: studentName,
        track: application.program.name,
        course: application.program.name,
        tier: formatTier(application.premiumTier),
        amount: payment.amount,
        amountLabel: formatMoney(payment.amount),
        paymentType: payment.amount === application.program.assessmentFee ? 'Acceptance Fee' : 'Internship Payment',
        paymentStatus: payment.status,
        paymentStatusLabel: formatPaymentStatus(payment.status),
        internshipStatus,
        paymentDate: payment.paidAt ?? payment.createdAt,
        paymentDateLabel: formatDate(payment.paidAt ?? payment.createdAt),
        cohort: application.cohort?.name ?? 'Unassigned',
        cohortStatus: application.cohort?.status ?? null,
        courseFee: application.program.assessmentFee,
        accessFeeNote: application.premiumTier === 'NONE' ? 'Free Tier access fee recorded at ₦1,000' : 'Premium tier payment recorded',
        latestAttemptStatus: application.attempts[0]?.status ?? null,
        latestAssessmentPercent: application.attempts[0]?.scorePercent ?? null,
      }
    }),
  })
}
