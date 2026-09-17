import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const taskId = typeof body?.taskId === 'string' ? body.taskId : null
  const content = typeof body?.content === 'string' ? body.content.trim() : ''

  if (!taskId) {
    return NextResponse.json({ error: 'No task to submit to.' }, { status: 400 })
  }
  if (!content) {
    return NextResponse.json({ error: 'Submission cannot be empty.' }, { status: 400 })
  }

  const prisma = getPrisma()

  try {
    const submission = await prisma.taskSubmission.upsert({
      where: { taskId_userId: { taskId, userId } },
      create: { taskId, userId, content, status: 'SUBMITTED' },
      update: { content, status: 'SUBMITTED', submittedAt: new Date() },
    })

    return NextResponse.json({ id: submission.id, success: true })
  } catch (error) {
    console.error('Failed to submit task:', error)
    return NextResponse.json({ error: 'Unable to submit assignment.' }, { status: 500 })
  }
}