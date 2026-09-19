import { NextResponse } from 'next/server'

import { AnnouncementScope, EnrollmentStatus, InternshipPaymentStatus, NotificationType, RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

type ActivityType = 'Students' | 'Payments' | 'System'

function learnerName(user: { name: string | null; profile: { firstName: string | null; lastName: string | null } | null }) {
  return user.name || [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(' ') || 'A learner'
}

async function requireAdmin() {
  const adminId = await getCurrentUserId()
  return adminId && await userHasRole(adminId, RoleName.ADMIN) ? adminId : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const prisma = getPrisma()
  try {
    const [students, payments, completions, certificates, announcements] = await Promise.all([
      prisma.user.findMany({ where: { roles: { some: { role: { name: RoleName.STUDENT } } } }, orderBy: { createdAt: 'desc' }, take: 15, select: { id: true, name: true, createdAt: true, profile: { select: { firstName: true, lastName: true } } } }),
      prisma.payment.findMany({ where: { courseId: { not: null }, status: InternshipPaymentStatus.PAID, paidAt: { not: null } }, orderBy: { paidAt: 'desc' }, take: 15, select: { id: true, amount: true, currency: true, paidAt: true, user: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } } } }),
      prisma.enrollment.findMany({ where: { status: EnrollmentStatus.COMPLETED, completedAt: { not: null } }, orderBy: { completedAt: 'desc' }, take: 15, select: { id: true, completedAt: true, user: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } }, course: { select: { title: true } } } }),
      prisma.certificate.findMany({ orderBy: { issuedAt: 'desc' }, take: 15, select: { id: true, issuedAt: true, user: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } }, course: { select: { title: true } } } }),
      prisma.announcement.findMany({ where: { scope: AnnouncementScope.GLOBAL }, orderBy: { createdAt: 'desc' }, take: 15, select: { id: true, title: true, message: true, createdAt: true, author: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } } } }),
    ])
    const activities: { id: string; title: string; body: string; createdAt: string; type: ActivityType }[] = [
      ...students.map((student) => ({ id: `student-${student.id}`, title: 'New student registration', body: `${learnerName(student)} created a student account.`, createdAt: student.createdAt.toISOString(), type: 'Students' as const })),
      ...payments.map((payment) => ({ id: `payment-${payment.id}`, title: 'Payment received', body: `${new Intl.NumberFormat(undefined, { style: 'currency', currency: payment.currency }).format(payment.amount)} was received from ${learnerName(payment.user)}.`, createdAt: payment.paidAt!.toISOString(), type: 'Payments' as const })),
      ...completions.map((completion) => ({ id: `completion-${completion.id}`, title: 'Course completed', body: `${learnerName(completion.user)} completed ${completion.course.title}.`, createdAt: completion.completedAt!.toISOString(), type: 'Students' as const })),
      ...certificates.map((certificate) => ({ id: `certificate-${certificate.id}`, title: 'Certificate issued', body: `${learnerName(certificate.user)} received a certificate for ${certificate.course.title}.`, createdAt: certificate.issuedAt.toISOString(), type: 'System' as const })),
      ...announcements.map((announcement) => ({ id: `announcement-${announcement.id}`, title: 'Announcement published', body: `${learnerName(announcement.author)}: ${announcement.title} — ${announcement.message}`, createdAt: announcement.createdAt.toISOString(), type: 'System' as const })),
    ]
    return NextResponse.json({ activities: activities.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50) })
  } catch (error) {
    console.error('Failed to load student-admin notifications:', error)
    return NextResponse.json({ error: 'Unable to load notification activity.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const adminId = await requireAdmin()
  if (!adminId) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const body = await request.json().catch(() => null)
  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  if (!title || !message) return NextResponse.json({ error: 'A title and message are required.' }, { status: 400 })
  if (title.length > 160 || message.length > 2000) return NextResponse.json({ error: 'Keep the title under 160 characters and the message under 2,000 characters.' }, { status: 400 })
  try {
    const result = await getPrisma().$transaction(async (tx) => {
      const students = await tx.user.findMany({ where: { roles: { some: { role: { name: RoleName.STUDENT } } } }, select: { id: true } })
      const announcement = await tx.announcement.create({ data: { authorId: adminId, scope: AnnouncementScope.GLOBAL, title, message } })
      const notifications = students.length ? await tx.notification.createMany({ data: students.map((student) => ({ userId: student.id, title, message, type: NotificationType.INFO })) }) : { count: 0 }
      return { announcementId: announcement.id, recipientCount: notifications.count }
    })
    return NextResponse.json({ success: true, ...result }, { status: 201 })
  } catch (error) {
    console.error('Failed to publish student announcement:', error)
    return NextResponse.json({ error: 'Unable to publish the announcement.' }, { status: 500 })
  }
}
