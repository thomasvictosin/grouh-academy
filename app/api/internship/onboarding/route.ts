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
    const programs = await prisma.internshipProgram.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, name: true, slug: true, duration: true, description: true },
      orderBy: { createdAt: 'asc' },
    })

    const existingApplication = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      programs,
      existingProgramId: existingApplication?.programId ?? null,
      existingAnswers: existingApplication?.onboardingAnswers ?? null,
    })
  } catch (error) {
    console.error('Failed to load onboarding data:', error)
    return NextResponse.json({ error: 'Unable to load onboarding options.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const programId = typeof body?.programId === 'string' ? body.programId : null
  const answers = body?.answers && typeof body.answers === 'object' ? body.answers : {}

  if (!programId) {
    return NextResponse.json({ error: 'Please choose a program.' }, { status: 400 })
  }

  const prisma = getPrisma()

  try {
    const program = await prisma.internshipProgram.findUnique({ where: { id: programId } })
    if (!program || program.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Selected program is not available.' }, { status: 404 })
    }

    const application = await prisma.internshipApplication.upsert({
      where: { studentId_programId: { studentId: userId, programId } },
      create: { studentId: userId, programId, onboardingAnswers: answers },
      update: { onboardingAnswers: answers },
    })

    return NextResponse.json({ applicationId: application.id })
  } catch (error) {
    console.error('Failed to save onboarding answers:', error)
    return NextResponse.json({ error: 'Unable to save your answers.' }, { status: 500 })
  }
}