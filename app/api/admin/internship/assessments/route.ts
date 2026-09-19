import { NextResponse } from 'next/server'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

type QuestionInput = {
  prompt: string
  options: string[]
  correctIndex: number
}

function normalizeQuestions(input: unknown): QuestionInput[] {
  if (!Array.isArray(input)) return []

  return input
    .map((question) => {
      if (!question || typeof question !== 'object') return null
      const promptValue = 'prompt' in question ? String((question as { prompt?: unknown }).prompt ?? '') : ''
      const rawOptions = 'options' in question ? (question as { options?: unknown[] }).options ?? [] : []
      const options = Array.isArray(rawOptions) ? rawOptions.map((option) => String(option).trim()) : []
      const rawCorrectIndex = 'correctIndex' in question ? Number((question as { correctIndex?: unknown }).correctIndex ?? 0) : 0
      const correctIndex = Number.isFinite(rawCorrectIndex) ? Math.max(0, Math.min(3, rawCorrectIndex)) : 0

      if (!promptValue.trim() || options.length !== 4 || options.some((option) => !option)) {
        return null
      }

      return { prompt: promptValue.trim(), options, correctIndex }
    })
    .filter((question): question is QuestionInput => Boolean(question))
}

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()

  const [programs, assessments] = await Promise.all([
    prisma.internshipProgram.findMany({
      where: { status: 'PUBLISHED' },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.internshipAssessment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        program: { select: { id: true, name: true } },
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: { id: true, optionText: true, isCorrect: true },
            },
          },
        },
      },
    }),
  ])

  const questions = assessments.flatMap((assessment) =>
    assessment.questions.map((question) => {
      const correctOptionIndex = question.options.findIndex((option) => option.isCorrect)

      return {
        id: question.id,
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        track: assessment.program.name,
        instructions: assessment.description ?? '',
        prompt: question.prompt,
        options: question.options.map((option) => ({
          id: option.id,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
        correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
      }
    }),
  )

  return NextResponse.json({
    programs,
    assessments: assessments.map((assessment) => ({
      id: assessment.id,
      title: assessment.title,
      track: assessment.program.name,
      questionCount: assessment.questions.length,
      passingScore: assessment.passingScore,
      instructions: assessment.description ?? '',
    })),
    questions,
  })
}

export async function POST(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.programId) {
    return NextResponse.json({ error: 'Please choose a valid internship track.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const { title, instructions, passingScore, programId, questionId, questions } = body
  const normalizedQuestions = normalizeQuestions(questions)

  if (typeof questionId === 'string' && questionId.trim()) {
    const question = await prisma.assessmentQuestion.findUnique({
      where: { id: questionId },
      include: { assessment: true },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 })
    }

    if (!normalizedQuestions[0]) {
      return NextResponse.json({ error: 'Question details are missing.' }, { status: 400 })
    }

    const incoming = normalizedQuestions[0]

    await prisma.$transaction(async (tx) => {
      await tx.internshipAssessment.update({
        where: { id: question.assessmentId },
        data: {
          title: typeof title === 'string' && title.trim() ? title.trim() : question.assessment.title,
          description: typeof instructions === 'string' ? instructions : question.assessment.description,
          passingScore: Number(passingScore) || question.assessment.passingScore,
          programId: programId || question.assessment.programId,
        },
      })

      await tx.assessmentQuestion.update({
        where: { id: questionId },
        data: {
          prompt: incoming.prompt,
          order: 0,
          options: {
            deleteMany: {},
            create: incoming.options.map((optionText, optionIndex) => ({
              optionText,
              order: optionIndex,
              isCorrect: optionIndex === incoming.correctIndex,
            })),
          },
        },
      })
    })

    return NextResponse.json({ success: true, updated: true })
  }

  if (normalizedQuestions.length === 0) {
    return NextResponse.json({ error: 'No valid assessment questions were provided.' }, { status: 400 })
  }

  const createdAssessment = await prisma.internshipAssessment.create({
    data: {
      programId,
      title: String(title || 'Entrance Exam'),
      description: typeof instructions === 'string' ? instructions : '',
      passingScore: Number(passingScore) || 70,
      questions: {
        create: normalizedQuestions.map((question, questionIndex) => ({
          prompt: String(question.prompt),
          order: questionIndex,
          options: {
            create: question.options.map((optionText, optionIndex) => ({
              optionText: String(optionText),
              order: optionIndex,
              isCorrect: optionIndex === Number(question.correctIndex),
            })),
          },
        })),
      },
    },
  })

  return NextResponse.json({ success: true, assessmentId: createdAssessment.id })
}

export async function DELETE(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const questionId = typeof body?.questionId === 'string' ? body.questionId : null

  if (!questionId) {
    return NextResponse.json({ error: 'A valid question id is required.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const question = await prisma.assessmentQuestion.findUnique({ where: { id: questionId } })
  if (!question) {
    return NextResponse.json({ error: 'Question not found.' }, { status: 404 })
  }

  await prisma.assessmentQuestion.delete({ where: { id: questionId } })
  return NextResponse.json({ success: true })
}
