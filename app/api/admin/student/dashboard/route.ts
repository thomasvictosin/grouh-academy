import { NextResponse } from 'next/server'
import { EnrollmentStatus, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'

const periods = ['7 Days', '30 Days', '3 Months', '6 Months', '12 Months'] as const
type Period = (typeof periods)[number]
type EnrollmentRecord = { enrolledAt: Date; courseId: string }

function formatNumber(value: number) { return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) }
function formatAmounts(payments: Array<{ amount: number; currency: string }>) {
  if (!payments.length) return '—'
  const totals = new Map<string, number>()
  payments.forEach(({ amount, currency }) => totals.set(currency, (totals.get(currency) ?? 0) + amount))
  return [...totals.entries()].map(([currency, amount]) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)).join(' · ')
}
function countForWindow(enrollments: EnrollmentRecord[], courseId: string, days: number) {
  const start = new Date(); start.setDate(start.getDate() - days)
  return enrollments.filter((enrollment) => enrollment.courseId === courseId && enrollment.enrolledAt >= start).length
}
function buildTrend(period: Period, enrollments: EnrollmentRecord[]) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const days = period === '7 Days' ? 7 : period === '30 Days' ? 30 : period === '3 Months' ? 90 : period === '6 Months' ? 180 : 365
  const bucketCount = period === '7 Days' ? 7 : period === '30 Days' ? 4 : period === '3 Months' ? 3 : period === '6 Months' ? 6 : 12
  const bucketDays = Math.ceil(days / bucketCount)
  return Array.from({ length: bucketCount }, (_, index) => {
    const start = new Date(today); start.setDate(today.getDate() - days + index * bucketDays)
    const end = new Date(start); end.setDate(start.getDate() + bucketDays)
    const count = enrollments.filter(({ enrolledAt }) => enrolledAt >= start && enrolledAt < end).length
    const day = period === '7 Days' ? start.toLocaleDateString('en-US', { weekday: 'short' }) : period === '30 Days' ? `Week ${index + 1}` : start.toLocaleDateString('en-US', { month: 'short' })
    return { day, count }
  })
}

export async function GET() {
  const prisma = getPrisma()
  const [students, instructors, certificates, courses, enrollments, payments] = await Promise.all([
    prisma.user.findMany({ where: { roles: { some: { role: { name: RoleName.STUDENT } } } }, select: { status: true } }),
    prisma.user.count({ where: { roles: { some: { role: { name: RoleName.INSTRUCTOR } } } } }),
    prisma.certificate.count(),
    prisma.course.findMany({ select: { id: true, title: true, status: true, category: { select: { name: true } }, instructors: { select: { instructor: { select: { name: true } } } } } }),
    prisma.enrollment.findMany({ select: { courseId: true, enrolledAt: true, status: true } }),
    prisma.payment.findMany({ select: { amount: true, currency: true, status: true } }),
  ])
  const learningEnrollments = enrollments.filter(({ status }) => status === EnrollmentStatus.ACTIVE || status === EnrollmentStatus.COMPLETED)
  const completed = learningEnrollments.filter(({ status }) => status === EnrollmentStatus.COMPLETED)
  const pendingEnrollments = enrollments.filter(({ status }) => status === EnrollmentStatus.PENDING)
  const pendingCourses = courses.filter(({ status }) => status === 'PENDING_REVIEW')
  const publishedCourses = courses.filter(({ status }) => status === 'PUBLISHED')
  const pendingPayments = payments.filter(({ status }) => status === 'PENDING')
  const paidPayments = payments.filter(({ status }) => status === 'PAID')
  const unsuccessfulPayments = payments.filter(({ status }) => status === 'FAILED' || status === 'CANCELLED')
  const completionRate = learningEnrollments.length ? Math.round((completed.length / learningEnrollments.length) * 100) : 0
  const enrollmentRecords: EnrollmentRecord[] = learningEnrollments
  const performanceCourses = courses.map((course) => ({
    id: course.id, title: course.title,
    instructor: course.instructors.map(({ instructor }) => instructor.name).filter(Boolean).join(', ') || 'Unassigned instructor',
    category: course.category?.name ?? 'Uncategorized',
    periods: { '7 Days': countForWindow(enrollmentRecords, course.id, 7), '30 Days': countForWindow(enrollmentRecords, course.id, 30), '3 Months': countForWindow(enrollmentRecords, course.id, 90), '6 Months': countForWindow(enrollmentRecords, course.id, 180), '12 Months': countForWindow(enrollmentRecords, course.id, 365) },
  }))
  return NextResponse.json({
    overview: [
      { value: formatNumber(students.length), label: 'Learner accounts' },
      { value: formatNumber(learningEnrollments.filter(({ status }) => status === EnrollmentStatus.ACTIVE).length), label: 'Active enrollments' },
      { value: `${completionRate}%`, label: 'Completion rate' },
      { value: formatNumber(instructors), label: 'Instructors' },
      { value: formatNumber(certificates), label: 'Certificates issued' },
      { value: formatNumber(pendingCourses.length), label: 'Courses awaiting review' },
      { value: formatNumber(pendingEnrollments.length), label: 'Enrollments awaiting action' },
      { value: formatNumber(publishedCourses.length), label: 'Live courses' },
    ], performanceCourses,
    enrollmentTrendData: Object.fromEntries(periods.map((period) => [period, buildTrend(period, enrollmentRecords)])),
    financials: [
      { label: 'Paid revenue', value: formatAmounts(paidPayments), detail: `${formatNumber(paidPayments.length)} successful payments` },
      { label: 'Payment follow-up', value: formatAmounts(pendingPayments), detail: `${formatNumber(pendingPayments.length)} pending payments` },
      { label: 'Unsuccessful payments', value: formatNumber(unsuccessfulPayments.length), detail: 'Failed or cancelled transactions' },
    ],
    actions: [
      { label: 'Course reviews', value: pendingCourses.length, href: '/admin/student/courses', detail: 'Courses awaiting publication review' },
      { label: 'Enrollment follow-up', value: pendingEnrollments.length, href: '/admin/student/enrollments', detail: 'Pending learner enrollments' },
      { label: 'Payment follow-up', value: pendingPayments.length, href: '/admin/student/payments', detail: 'Payments awaiting confirmation' },
    ],
  })
}
