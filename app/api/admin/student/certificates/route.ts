import { NextResponse } from 'next/server'
import { EnrollmentStatus, RoleName } from '@/generated/prisma/client'
import { ensureCertificateIssued } from '@/lib/certificates'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

async function isAdmin() {
  const userId = await getCurrentUserId()
  return Boolean(userId && await userHasRole(userId, RoleName.ADMIN))
}

function studentName(student: { name: string | null; profile: { firstName: string | null; lastName: string | null } | null }) {
  return [student.profile?.firstName, student.profile?.lastName].filter(Boolean).join(' ') || student.name || 'Unnamed learner'
}

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const prisma = getPrisma()
  const [certificates, students, courses] = await Promise.all([
    prisma.certificate.findMany({ orderBy: { issuedAt: 'desc' }, select: { id: true, certificateNumber: true, issuedAt: true, user: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } }, course: { select: { title: true } } } }),
    prisma.user.findMany({ where: { roles: { some: { role: { name: RoleName.STUDENT } } } }, orderBy: { name: 'asc' }, select: { id: true, name: true, profile: { select: { firstName: true, lastName: true } } } }),
    prisma.course.findMany({ where: { status: 'PUBLISHED' }, orderBy: { title: 'asc' }, select: { id: true, title: true } }),
  ])
  return NextResponse.json({
    certificates: certificates.map((certificate) => ({ id: certificate.id, certificateNumber: certificate.certificateNumber, student: studentName(certificate.user), course: certificate.course.title, issuedAt: certificate.issuedAt.toISOString() })),
    students: students.map((student) => ({ id: student.id, name: studentName(student) })),
    courses,
  })
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const body = await request.json().catch(() => null)
  if (!body || typeof body.studentId !== 'string' || typeof body.courseId !== 'string') return NextResponse.json({ error: 'A learner and course are required.' }, { status: 400 })
  const enrollment = await getPrisma().enrollment.findFirst({ where: { userId: body.studentId, courseId: body.courseId, status: EnrollmentStatus.COMPLETED }, select: { id: true } })
  if (!enrollment) return NextResponse.json({ error: 'Certificates can only be issued for completed enrollments.' }, { status: 422 })
  const certificate = await ensureCertificateIssued(getPrisma(), { userId: body.studentId, courseId: body.courseId, enrollmentId: enrollment.id })
  return NextResponse.json({ id: certificate.id }, { status: 201 })
}
