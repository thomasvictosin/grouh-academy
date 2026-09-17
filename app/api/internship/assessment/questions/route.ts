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
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ error: 'No application found.' }, { status: 404 })
    }

    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { applicationId: application.id, status: 'IN_PROGRESS' },
      orderBy: { createdAt: 'desc' },
    })
    if (!attempt || !attempt.assessmentId) {
      return NextResponse.json({ error: 'No assessment currently in progress.' }, { status: 404 })
    }

    const questions = await prisma.assessmentQuestion.findMany({
      where: { assessmentId: attempt.assessmentId },
      orderBy: { order: 'asc' },
      include: { options: { orderBy: { order: 'asc' }, select: { id: true, optionText: true } } },
    })

    return NextResponse.json({
      attemptId: attempt.id,
      questions: questions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
      })),
    })
  } catch (error) {
    console.error('Failed to load assessment questions:', error)
    return NextResponse.json({ error: 'Unable to load assessment questions.' }, { status: 500 })
  }
}