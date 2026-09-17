import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

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
      return NextResponse.json({ error: 'No application found.' }, { status: 404 })
    }

    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { applicationId: application.id, status: { in: ['PASSED', 'FAILED'] } },
      orderBy: { createdAt: 'desc' },
    })

    if (!attempt) {
      return NextResponse.json({ error: 'No completed assessment found.' }, { status: 404 })
    }

    return NextResponse.json({
      programName: application.program.name,
      scorePercent: attempt.scorePercent,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      passed: attempt.status === 'PASSED',
    })
  } catch (error) {
    console.error('Failed to load assessment result:', error)
    return NextResponse.json({ error: 'Unable to load your result.' }, { status: 500 })
  }
}