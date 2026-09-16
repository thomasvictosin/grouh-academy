import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function generateCertificateNumber(userId: string, programId: string): string {
  const raw = `${userId}${programId}`.replace(/-/g, '').toUpperCase()
  return `CERT-INT-${raw.slice(0, 10)}`
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!application) {
      return NextResponse.json({ eligible: false, reason: 'No internship application found.' })
    }

    const progress = await prisma.internshipProgress.findUnique({
      where: { userId_programId: { userId, programId: application.programId } },
    })

    const isComplete = !!progress && progress.totalTasks > 0 && progress.progressPercent >= 100

    if (!isComplete) {
      return NextResponse.json({
        eligible: false,
        reason: 'Complete all internship tasks and projects to unlock your certificate.',
        progressPercent: progress?.progressPercent ?? 0,
      })
    }

    let certificate = await prisma.internshipCertificate.findFirst({
      where: { userId, programId: application.programId },
    })

    if (!certificate) {
      certificate = await prisma.internshipCertificate.create({
        data: {
          userId,
          programId: application.programId,
          applicationId: application.id,
          title: `${application.program.name} Completion Certificate`,
          certificateNumber: generateCertificateNumber(userId, application.programId),
        },
      })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    return NextResponse.json({
      eligible: true,
      studentName: user?.name ?? 'Student',
      programName: application.program.name,
      certificateNumber: certificate.certificateNumber,
      issuedDateLabel: formatDate(certificate.issuedAt),
    })
  } catch (error) {
    console.error('Failed to load certificate:', error)
    return NextResponse.json({ error: 'Unable to load certificate.' }, { status: 500 })
  }
}