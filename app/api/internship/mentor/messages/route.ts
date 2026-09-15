import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

async function findActiveMentorAssignment(userId: string) {
  const prisma = getPrisma()
  return prisma.mentorAssignment.findFirst({
    where: { internId: userId, status: 'ACTIVE' },
    include: { mentor: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function GET(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const after = searchParams.get('after')

  const prisma = getPrisma()

  try {
    const assignment = await findActiveMentorAssignment(userId)
    if (!assignment) {
      return NextResponse.json({ error: 'No active mentor assigned yet.' }, { status: 404 })
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        mentorId_internId_programId: {
          mentorId: assignment.mentorId,
          internId: userId,
          programId: assignment.programId,
        },
      },
      create: { mentorId: assignment.mentorId, internId: userId, programId: assignment.programId },
      update: {},
    })

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
        ...(after ? { createdAt: { gt: new Date(after) } } : {}),
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    })

    return NextResponse.json({
      conversationId: conversation.id,
      mentorId: assignment.mentorId,
      mentorName: assignment.mentor.name,
      messages: messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
        isMine: m.senderId === userId,
      })),
    })
  } catch (error) {
    console.error('Failed to load mentor conversation:', error)
    return NextResponse.json({ error: 'Unable to load conversation.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const content = typeof body?.content === 'string' ? body.content.trim() : ''

  if (!content) {
    return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 })
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: 'Message is too long (max 2000 characters).' }, { status: 400 })
  }

  const prisma = getPrisma()

  try {
    const assignment = await findActiveMentorAssignment(userId)
    if (!assignment) {
      return NextResponse.json({ error: 'No active mentor assigned yet.' }, { status: 404 })
    }

    const conversation = await prisma.conversation.upsert({
      where: {
        mentorId_internId_programId: {
          mentorId: assignment.mentorId,
          internId: userId,
          programId: assignment.programId,
        },
      },
      create: { mentorId: assignment.mentorId, internId: userId, programId: assignment.programId },
      update: {},
    })

    const message = await prisma.message.create({
      data: { conversationId: conversation.id, senderId: userId, content },
    })

    return NextResponse.json({
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      isMine: true,
    })
  } catch (error) {
    console.error('Failed to send message:', error)
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 })
  }
}