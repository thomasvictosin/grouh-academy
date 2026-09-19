import { NextResponse } from 'next/server'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

type TaskKind = 'INDIVIDUAL' | 'GROUP'

type TaskPayload = {
  id: string
  title: string
  kind: TaskKind
  track: string
  trackId: string
  weekLabel: string
  duration: string
  attemptsAllowed: number
  attemptedBy: number
  completedCount: number
  status: string
  dueDate: string | null
  description: string
}

function parseWeekLabel(title: string | null): string {
  if (!title) return 'Week 1'
  const match = /week\s*(\d+)/i.exec(title)
  return match ? `Week ${match[1]}` : title
}

function parseMetadata(description: string | null) {
  const summary = description ?? ''
  const durationMatch = /Duration:\s*([^|]+)/i.exec(summary)
  const attemptsMatch = /Attempts:\s*(\d+)/i.exec(summary)
  const startWeekMatch = /Start Week:\s*(\d+)/i.exec(summary)
  const endWeekMatch = /End Week:\s*(\d+)/i.exec(summary)

  return {
    duration: durationMatch?.[1]?.trim() || '1 week',
    attemptsAllowed: attemptsMatch ? Number(attemptsMatch[1]) : 1,
    startWeek: startWeekMatch ? Number(startWeekMatch[1]) : null,
    endWeek: endWeekMatch ? Number(endWeekMatch[1]) : null,
  }
}

export async function GET(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const selectedTrack = searchParams.get('track')
  const selectedKind = searchParams.get('kind')

  const prisma = getPrisma()
  const [programs, tasks] = await Promise.all([
    prisma.internshipProgram.findMany({
      select: { id: true, name: true, duration: true },
      orderBy: { name: 'asc' },
    }),
    prisma.internshipTask.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        module: { include: { program: { select: { id: true, name: true, duration: true } } } },
        submissions: { select: { id: true, status: true, userId: true } },
      },
    }),
  ])

  const filteredTasks = tasks.filter((task) => {
    const programName = task.module.program.name
    const matchesTrack = !selectedTrack || selectedTrack === 'all' || selectedTrack === task.module.program.id
    const matchesKind = !selectedKind || selectedKind === 'all' || selectedKind === task.kind
    return matchesTrack && matchesKind && programName
  })

  const payload: TaskPayload[] = filteredTasks.map((task) => {
    const metadata = parseMetadata(task.description)
    const attemptedBy = new Set(task.submissions.map((submission) => submission.userId)).size
    const completedCount = task.submissions.filter((submission) => submission.status === 'ACCEPTED' || submission.status === 'SUBMITTED').length
    const dueDate = task.dueDate ? task.dueDate.toISOString() : null

    let status = 'Upcoming'
    if (task.dueDate && new Date(task.dueDate).getTime() < Date.now() && completedCount === 0) {
      status = 'Overdue'
    } else if (completedCount > 0) {
      status = 'Active'
    }

    return {
      id: task.id,
      title: task.title,
      kind: task.kind as TaskKind,
      track: task.module.program.name,
      trackId: task.module.program.id,
      weekLabel: parseWeekLabel(task.module.title),
      duration: metadata.duration,
      attemptsAllowed: metadata.attemptsAllowed,
      attemptedBy,
      completedCount,
      status,
      dueDate,
      description: task.description ?? '',
    }
  })

  return NextResponse.json({
    tracks: programs,
    tasks: payload,
    summary: {
      total: payload.length,
      individual: payload.filter((task) => task.kind === 'INDIVIDUAL').length,
      group: payload.filter((task) => task.kind === 'GROUP').length,
    },
  })
}

export async function POST(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'Task payload is required.' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim()
  const programId = String(body.programId ?? '').trim()
  const kind = body.kind === 'GROUP' ? 'GROUP' : 'INDIVIDUAL'
  const rawWeek = Number(body.week ?? body.startWeek ?? 1)
  const weekNumber = Number.isFinite(rawWeek) && rawWeek > 0 ? rawWeek : 1
  const endWeek = Number(body.endWeek ?? rawWeek)
  const duration = String(body.duration ?? `${Math.max(1, endWeek - weekNumber + 1)} week${endWeek - weekNumber + 1 === 1 ? '' : 's'}`).trim()
  const attemptsAllowed = Number(body.allowedAttempts ?? body.attemptsAllowed ?? 1)
  const dueDate = body.dueDate ? new Date(body.dueDate) : null
  const description = String(body.description ?? '').trim()

  if (!title || !programId) {
    return NextResponse.json({ error: 'Task title and track are required.' }, { status: 400 })
  }

  const program = await prisma.internshipProgram.findUnique({ where: { id: programId } })
  if (!program) {
    return NextResponse.json({ error: 'Selected internship track was not found.' }, { status: 400 })
  }

  const moduleTitle = `Week ${weekNumber}`
  let taskModule = await prisma.internshipModule.findFirst({
    where: { programId, title: moduleTitle },
  })

  if (!taskModule) {
    taskModule = await prisma.internshipModule.create({
      data: {
        programId,
        title: moduleTitle,
        description: `Week ${weekNumber} tasks for ${program.name}`,
        order: weekNumber,
      },
    })
  }

  const metadataText = [
    description ? `Summary: ${description}` : '',
    `Duration: ${duration}`,
    `Start Week: ${weekNumber}`,
    `End Week: ${Math.max(weekNumber, endWeek)}`,
    `Attempts: ${Math.max(1, attemptsAllowed)}`,
  ].filter(Boolean).join(' | ')

  const task = await prisma.internshipTask.create({
    data: {
      moduleId: taskModule.id,
      title,
      description: metadataText,
      kind,
      dueDate: dueDate ?? null,
      maxScore: 100,
    },
  })

  return NextResponse.json({ success: true, taskId: task.id })
}

export async function DELETE(request: Request) {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const taskId = typeof body?.taskId === 'string' ? body.taskId : null

  if (!taskId) {
    return NextResponse.json({ error: 'Task id is required.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const task = await prisma.internshipTask.findUnique({ where: { id: taskId } })
  if (!task) {
    return NextResponse.json({ error: 'Task not found.' }, { status: 404 })
  }

  await prisma.internshipTask.delete({ where: { id: taskId } })
  return NextResponse.json({ success: true })
}
