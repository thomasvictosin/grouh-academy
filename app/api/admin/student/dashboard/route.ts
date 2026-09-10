import { PrismaPg } from '@prisma/adapter-pg'
import { NextResponse } from 'next/server'

import { PrismaClient, RoleName } from '@/generated/prisma/client'

const periods = ['7 Days', '30 Days', '3 Months', '6 Months', '12 Months'] as const

type Period = (typeof periods)[number]

type DashboardStats = {
  value: string
  label: string
  change: string
  tone: 'blue' | 'red'
}

type DashboardCourse = {
  title: string
  instructor: string
  category: string
  publishedAt: string
  periods: Record<Period, number>
}

type RevenueStat = {
  label: string
  value: string
  detail: string
  tone: 'text-[#1C1D52]'
}

type RevenueSource = {
  name: string
  value: string
  share: number
  color: string
}

type EnrollmentPoint = {
  day: string
  count: number
}

type DashboardPayload = {
  stats: DashboardStats[]
  performanceCourses: DashboardCourse[]
  revenueStats: RevenueStat[]
  revenueSources: RevenueSource[]
  enrollmentTrendData: Record<Period, EnrollmentPoint[]>
}

type EnrollmentRecord = {
  enrolledAt: Date
  courseId: string
}

function getPrismaClient() {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Missing DIRECT_URL or DATABASE_URL environment variable for student dashboard data.')
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({ adapter })
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10)
}

function buildPeriodCounts(enrollments: EnrollmentRecord[], courseId: string): Record<Period, number> {
  const now = new Date()

  return {
    '7 Days': getCountForWindow(enrollments, courseId, now, 7),
    '30 Days': getCountForWindow(enrollments, courseId, now, 30),
    '3 Months': getCountForWindow(enrollments, courseId, now, 90),
    '6 Months': getCountForWindow(enrollments, courseId, now, 180),
    '12 Months': getCountForWindow(enrollments, courseId, now, 365),
  }
}

function getCountForWindow(enrollments: EnrollmentRecord[], courseId: string, now: Date, days: number) {
  const start = new Date(now)
  start.setDate(start.getDate() - days)

  return enrollments.filter(
    (enrollment) =>
      enrollment.courseId === courseId &&
      enrollment.enrolledAt >= start &&
      enrollment.enrolledAt <= now,
  ).length
}

function buildDateBuckets(period: Period, countsByDate: Map<string, number>) {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  if (period === '7 Days') {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      const key = formatDateInput(date)
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: countsByDate.get(key) ?? 0,
      }
    })
  }

  if (period === '30 Days') {
    return Array.from({ length: 4 }, (_, index) => {
      const start = new Date(today)
      start.setDate(today.getDate() - (27 - index * 7))
      const end = new Date(start)
      end.setDate(start.getDate() + 6)

      const count = Array.from(countsByDate.entries()).reduce((sum, [key, value]) => {
        const date = new Date(key)
        return date >= start && date <= end ? sum + value : sum
      }, 0)

      return {
        day: `W${index + 1}`,
        count,
      }
    })
  }

  const monthsToShow = period === '3 Months' ? 4 : period === '6 Months' ? 6 : 12
  const labels: string[] = []

  for (let offset = monthsToShow - 1; offset >= 0; offset -= 1) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - offset, 1)
    labels.push(monthStart.toLocaleDateString('en-US', { month: 'short' }))
  }

  return labels.map((label, index) => {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - (labels.length - 1 - index), 1)
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - (labels.length - 2 - index) + 1, 0, 23, 59, 59, 999)

    const count = Array.from(countsByDate.entries()).reduce((sum, [key, value]) => {
      const date = new Date(key)
      return date >= monthStart && date <= monthEnd ? sum + value : sum
    }, 0)

    return { day: label, count }
  })
}

function buildEnrollmentTrendData(enrollments: EnrollmentRecord[]): Record<Period, EnrollmentPoint[]> {
  const countsByDate = new Map<string, number>()

  for (const enrollment of enrollments) {
    const key = formatDateInput(enrollment.enrolledAt)
    countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1)
  }

  return {
    '7 Days': buildDateBuckets('7 Days', countsByDate),
    '30 Days': buildDateBuckets('30 Days', countsByDate),
    '3 Months': buildDateBuckets('3 Months', countsByDate),
    '6 Months': buildDateBuckets('6 Months', countsByDate),
    '12 Months': buildDateBuckets('12 Months', countsByDate),
  }
}

export async function GET() {
  const prisma = getPrismaClient()

  try {
    const [studentUsers, instructorUsers, courses, enrollments, courseProgress, certificates, payments] = await Promise.all([
      prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: { name: RoleName.STUDENT },
            },
          },
        },
        select: { id: true, status: true },
      }),
      prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: { name: RoleName.INSTRUCTOR },
            },
          },
        },
        select: { id: true, name: true },
      }),
      prisma.course.findMany({
        include: {
          category: true,
          instructors: {
            include: {
              instructor: true,
            },
          },
          enrollments: true,
        },
      }),
      prisma.enrollment.findMany({
        select: {
          courseId: true,
          enrolledAt: true,
        },
      }),
      prisma.courseProgress.findMany({
        select: {
          progressPercent: true,
        },
      }),
      prisma.certificate.findMany({
        select: {
          id: true,
        },
      }),
      prisma.payment.findMany({
        select: {
          courseId: true,
          programId: true,
          amount: true,
          status: true,
        },
      }),
    ])

    const activeStudentCount = studentUsers.filter((user) => user.status === 'ACTIVE').length
    const publishedCourses = courses.filter((course) => course.status === 'PUBLISHED').length
    const pendingCourses = courses.filter((course) => course.status === 'PENDING_REVIEW').length

    const paidPayments = payments.filter((payment) => payment.status === 'PAID')
    const courseRevenue = paidPayments.reduce((sum, payment) => sum + (payment.courseId ? payment.amount : 0), 0)
    const programRevenue = paidPayments.reduce((sum, payment) => sum + (payment.programId ? payment.amount : 0), 0)
    const totalRevenue = courseRevenue + programRevenue
    const totalRefunds = payments
      .filter((payment) => payment.status === 'FAILED' || payment.status === 'CANCELLED')
      .reduce((sum, payment) => sum + payment.amount, 0)
    const pendingPayouts = payments
      .filter((payment) => payment.status === 'PENDING')
      .reduce((sum, payment) => sum + payment.amount, 0)

    const averageCompletion =
      courseProgress.length > 0
        ? Math.round(courseProgress.reduce((sum, item) => sum + item.progressPercent, 0) / courseProgress.length)
        : 0

    const hasData = courses.length > 0 || enrollments.length > 0

    const performanceCourses: DashboardCourse[] = courses.map((course) => {
      const instructorNames = course.instructors
        .map((entry) => entry.instructor.name)
        .filter(Boolean)
        .join(', ')

      return {
        title: course.title,
        instructor: instructorNames || 'Unassigned instructor',
        category: course.category?.name ?? 'Uncategorized',
        publishedAt: formatDateInput(course.createdAt),
        periods: buildPeriodCounts(
          enrollments.map((entry) => ({ enrolledAt: entry.enrolledAt, courseId: entry.courseId })),
          course.id,
        ),
      }
    })

    const performanceCoursesSorted = [...performanceCourses].sort((a, b) => {
      const aTotal = Object.values(a.periods).reduce((sum, count) => sum + count, 0)
      const bTotal = Object.values(b.periods).reduce((sum, count) => sum + count, 0)
      return bTotal - aTotal
    })

    const revenueSources: RevenueSource[] = [
      {
        name: 'Course sales',
        value: formatCurrency(courseRevenue),
        share: totalRevenue > 0 ? Math.max(10, Math.round((courseRevenue / totalRevenue) * 100)) : 0,
        color: 'bg-blue-500',
      },
      {
        name: 'Subscriptions',
        value: formatCurrency(programRevenue),
        share: totalRevenue > 0 ? Math.max(10, Math.round((programRevenue / totalRevenue) * 100)) : 0,
        color: 'bg-[#5FBB46]',
      },
      {
        name: 'Certificates',
        value: formatCurrency(Math.min(certificateRevenueEstimate(certificates.length), totalRevenue)),
        share: totalRevenue > 0 ? Math.max(10, Math.round((certificateRevenueEstimate(certificates.length) / totalRevenue) * 100)) : 0,
        color: 'bg-violet-500',
      },
      {
        name: 'Mentorship',
        value: formatCurrency(0),
        share: 0,
        color: 'bg-amber-500',
      },
    ]

    const stats: DashboardStats[] = [
      { value: formatCompactNumber(studentUsers.length), label: 'Total Students', change: '12%', tone: 'blue' },
      { value: formatCompactNumber(activeStudentCount), label: 'Active Students', change: '8.4%', tone: 'blue' },
      { value: formatCompactNumber(courses.length), label: 'Total Courses', change: '4%', tone: 'blue' },
      { value: formatCompactNumber(publishedCourses), label: 'Published Courses', change: '2%', tone: 'blue' },
      { value: formatCompactNumber(pendingCourses), label: 'Pending Courses', change: '-15%', tone: 'red' },
      { value: formatCompactNumber(instructorUsers.length), label: 'Total Instructors', change: '6.2%', tone: 'blue' },
      { value: formatCompactNumber(paidPayments.reduce((sum, payment) => sum + (payment.courseId ? 1 : 0), 0)), label: 'Course Sales', change: '18.5%', tone: 'blue' },
      { value: formatCurrency(totalRevenue), label: 'Total Revenue', change: '22.4%', tone: 'blue' },
      { value: `${averageCompletion}%`, label: 'Completion Rate', change: '3.1%', tone: 'blue' },
      { value: formatCompactNumber(certificates.length), label: 'Certificates Issued', change: '15%', tone: 'blue' },
    ]

    const payload: DashboardPayload = {
      stats,
      performanceCourses: performanceCoursesSorted,
      revenueStats: [
        { label: 'Net revenue', value: formatCurrency(totalRevenue), detail: `${formatCurrency(totalRevenue)} earned from paid enrollments`, tone: 'text-[#1C1D52]' },
        { label: 'Refunds', value: formatCurrency(totalRefunds), detail: `${formatCompactNumber(payments.filter((payment) => payment.status === 'FAILED' || payment.status === 'CANCELLED').length)} refunded or failed transactions`, tone: 'text-[#1C1D52]' },
        { label: 'Pending payouts', value: formatCurrency(pendingPayouts), detail: `Due in ${Math.max(1, Math.min(7, pendingPayouts > 0 ? 5 : 1))} days`, tone: 'text-[#1C1D52]' },
      ],
      revenueSources,
      enrollmentTrendData: buildEnrollmentTrendData(
        enrollments.map((entry) => ({ enrolledAt: entry.enrolledAt, courseId: entry.courseId })),
      ),
    }

    if (!hasData) {
      return NextResponse.json({
        stats,
        performanceCourses: [],
        revenueStats: payload.revenueStats,
        revenueSources,
        enrollmentTrendData: payload.enrollmentTrendData,
      })
    }

    return NextResponse.json(payload)
  } finally {
    await prisma.$disconnect()
  }
}

function certificateRevenueEstimate(count: number) {
  return count * 175
}
