import { NextResponse } from 'next/server'
import { NotificationType, SubmissionStatus } from '@/generated/prisma/client'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import type { InternshipAlert, InternshipTaskItem, InternshipTaskListResponse, TaskTone } from '@/lib/internship-data'

const MS_PER_HOUR = 1000 * 60 * 60
const MS_PER_DAY = MS_PER_HOUR * 24

function formatTimeLeft(dueDate: Date | null, isResolved: boolean): string {
  if (!dueDate) return 'No due date'
  if (isResolved) return '—'

  const diffMs = dueDate.getTime() - Date.now()

  if (diffMs <= 0) return 'Overdue'
  if (diffMs < MS_PER_HOUR) return `${Math.max(1, Math.round(diffMs / (1000 * 60)))} minutes left`
  if (diffMs < MS_PER_DAY) return `${Math.round(diffMs / MS_PER_HOUR)} hours left`
  return `${Math.round(diffMs / MS_PER_DAY)} days left`
}

function formatDueDate(dueDate: Date | null): string | null {
  if (!dueDate) return null
  return dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / (1000 * 60))
  if (minutes < 60) return `${Math.max(1, minutes)} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function parseWeekNumber(title: string | null): number {
  if (!title) return 1
  const match = /week\s*(\d+)/i.exec(title)
  if (match) return Number(match[1])
  const numericMatch = /\d+/.exec(title)
  return numericMatch ? Number(numericMatch[0]) : 1
}

function parseWeekLabel(title: string | null): string {
  if (!title) return 'Week 1'
  const match = /week\s*(\d+)/i.exec(title)
  if (match) return `Week ${match[1]}`
  const numericMatch = /\d+/.exec(title)
  return numericMatch ? `Week ${numericMatch[0]}` : 'Week 1'
}

function notificationTone(type: NotificationType): InternshipAlert['tone'] {
  switch (type) {
    case NotificationType.ERROR:
      return 'red'
    case NotificationType.WARNING:
      return 'orange'
    case NotificationType.SUCCESS:
      return 'green'
    default:
      return 'slate'
  }
}

export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  const application = await prisma.internshipApplication.findFirst({
    where: { studentId: userId },
    orderBy: { createdAt: 'desc' },
  })

  if (!application) {
    const empty: InternshipTaskListResponse = {
      hasProgram: false,
      tasks: [],
      stats: { pending: 0, submitted: 0, overdue: 0, activeIndividual: 0, activeGroup: 0 },
      alerts: [],
    }
    return NextResponse.json(empty)
  }

  const modules = await prisma.internshipModule.findMany({
    where: { programId: application.programId },
    include: {
      tasks: {
        include: {
          submissions: { where: { userId } },
        },
      },
    },
  })

  const now = new Date()

  const tasks: InternshipTaskItem[] = []
  let pending = 0
  let submitted = 0
  let overdue = 0
  let activeIndividual = 0
  let activeGroup = 0

  for (const programModule of modules) {
    for (const task of programModule.tasks) {
      // @@unique([taskId, userId]) guarantees at most one row here.
      const submission = task.submissions[0]
      const isPastDue = Boolean(task.dueDate && task.dueDate.getTime() < now.getTime())

      let status: InternshipTaskItem['status']
      let tone: TaskTone
      let isResolved = false
      let isActive = true

      if (!submission) {
        if (isPastDue) {
          status = 'Defaulted'
          tone = 'red'
          isActive = false
        } else {
          status = 'Not Started'
          tone = 'slate'
        }
      } else {
        switch (submission.status) {
          case SubmissionStatus.DRAFT:
            status = 'In Progress'
            tone = 'yellow'
            break
          case SubmissionStatus.SUBMITTED:
            status = 'Submitted'
            tone = 'green'
            break
          case SubmissionStatus.UNDER_REVIEW:
            status = 'Under Review'
            tone = 'green'
            break
          case SubmissionStatus.ACCEPTED:
            status = 'Graded'
            tone = 'green'
            isResolved = true
            isActive = false
            break
          case SubmissionStatus.REJECTED:
            status = 'Rejected'
            tone = 'red'
            break
          default:
            status = 'Not Started'
            tone = 'slate'
        }
      }

      if (status === 'Not Started' || status === 'In Progress') pending += 1
      if (status === 'Submitted' || status === 'Under Review' || status === 'Graded') submitted += 1
      if (status === 'Defaulted') overdue += 1

      if (isActive) {
        if (task.kind === 'GROUP') activeGroup += 1
        else activeIndividual += 1
      }

      const scoreLabel =
        submission?.score != null ? `${submission.score}/${task.maxScore} marks` : `${task.maxScore} marks`
      const moduleTitle = programModule.title || 'General'
      const weekLabel = parseWeekLabel(moduleTitle)
      const weekNumber = parseWeekNumber(moduleTitle)

      tasks.push({
        id: task.id,
        title: task.title,
        kind: task.kind,
        moduleTitle,
        weekLabel,
        weekNumber,
        dueDateLabel: formatDueDate(task.dueDate),
        timeLeftLabel: formatTimeLeft(task.dueDate, isResolved),
        status,
        tone,
        scoreLabel,
        score: submission?.score ?? null,
        maxScore: task.maxScore,
        submittedAt: submission?.submittedAt ? submission.submittedAt.toISOString() : null,
      })
    }
  }

  tasks.sort((a, b) => {
    if (a.weekNumber !== b.weekNumber) return a.weekNumber - b.weekNumber
    if (a.dueDateLabel && !b.dueDateLabel) return -1
    if (!a.dueDateLabel && b.dueDateLabel) return 1
    return a.title.localeCompare(b.title)
  })

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const alerts: InternshipAlert[] = notifications.map((notification) => ({
    id: notification.id,
    text: notification.message,
    tone: notificationTone(notification.type),
    postedLabel: timeAgo(notification.createdAt),
  }))

  const response: InternshipTaskListResponse = {
    hasProgram: true,
    tasks,
    stats: { pending, submitted, overdue, activeIndividual, activeGroup },
    alerts,
  }

  return NextResponse.json(response)
}