export type TaskStatusLabel =
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Graded'
  | 'Rejected'
  | 'Defaulted'

export type TaskTone = 'yellow' | 'slate' | 'green' | 'red'

export type InternshipTaskItem = {
  id: string
  title: string
  kind: 'INDIVIDUAL' | 'GROUP'
  moduleTitle: string
  weekLabel: string
  weekNumber: number
  dueDateLabel: string | null
  timeLeftLabel: string
  status: TaskStatusLabel
  tone: TaskTone
  scoreLabel: string
  score: number | null
  maxScore: number
  submittedAt: string | null
}

export type InternshipAlert = {
  id: string
  text: string
  tone: 'orange' | 'green' | 'red' | 'slate'
  postedLabel: string
}

export type InternshipTaskListResponse = {
  hasProgram: boolean
  tasks: InternshipTaskItem[]
  stats: {
    pending: number
    submitted: number
    overdue: number
    activeIndividual: number
    activeGroup: number
  }
  alerts: InternshipAlert[]
}