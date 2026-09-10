export type InternshipProgram = {
  slug: string
  name: string
  duration: string
  price: number
  assessmentFee: number
  description: string
  features: string[]
  requirements: string[]
  certificateEligibility: string
  companyPlacement: boolean
  mentorAvailability: boolean
  communityAvailability: boolean
  status: 'PUBLISHED' | 'DRAFT' | 'DISABLED'
}

export const internshipPrograms: InternshipProgram[] = [
  {
    slug: 'one-month',
    name: 'One-Month Internship',
    duration: '1 month',
    price: 1000,
    assessmentFee: 1000,
    description: 'A focused internship assessment experience with supervised tasks and a completion certificate.',
    features: ['Practical internship tasks', 'Task supervision', 'Certificate on successful completion'],
    requirements: ['Registered Academy student', 'Complete and submit the assessment'],
    certificateEligibility: 'Successful internship completion',
    companyPlacement: false,
    mentorAvailability: false,
    communityAvailability: false,
    status: 'PUBLISHED',
  },
  {
    slug: 'three-month',
    name: 'Three-Month Internship',
    duration: '3 months',
    price: 100000,
    assessmentFee: 100000,
    description: 'A practical company-facing internship with supervision, community support, and a certificate.',
    features: ['Work with an actual company', 'Supervised practical tasks', 'Student community access', 'Certificate on completion'],
    requirements: ['Registered Academy student', 'Complete and submit the assessment'],
    certificateEligibility: 'Successful internship completion',
    companyPlacement: true,
    mentorAvailability: false,
    communityAvailability: true,
    status: 'PUBLISHED',
  },
  {
    slug: 'six-month',
    name: 'Six-Month Internship',
    duration: '6 months',
    price: 400000,
    assessmentFee: 400000,
    description: 'A complete placement experience with a company, assigned mentor, community, and certificate.',
    features: ['Work with an actual company', 'Assigned mentor', 'Supervised practical tasks', 'Student community access', 'Certificate on completion'],
    requirements: ['Registered Academy student', 'Complete and submit the assessment'],
    certificateEligibility: 'Successful internship completion',
    companyPlacement: true,
    mentorAvailability: true,
    communityAvailability: true,
    status: 'PUBLISHED',
  },
]

export const objectiveQuestions = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  prompt: [
    'Which practice best supports reliable project delivery?',
    'What is the strongest reason to document a technical decision?',
    'Which response demonstrates professional collaboration?',
    'What should happen before a task is marked complete?',
  ][index % 4],
  options: ['Work alone and avoid feedback', 'Clarify the goal and verify the outcome', 'Skip the brief and start immediately', 'Wait until the deadline to ask questions'],
}))

export const theoryQuestions = [
  { id: 1, prompt: 'Describe how you would approach a task whose requirements are unclear.', acceptsFile: false },
  { id: 2, prompt: 'Explain how you would communicate progress, blockers, and next steps to a supervisor.', acceptsFile: true },
  { id: 3, prompt: 'Share an example of how you would improve the quality of a deliverable before submission.', acceptsFile: true },
]

export const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

export const internshipStorageKey = 'grouh-internship-state'

export type InternshipClientState = {
  programSlug?: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  assessmentStatus: 'LOCKED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'OBJECTIVE_SUBMITTED' | 'UNDER_REVIEW'
  objectiveAnswers: Record<string, string>
  theoryAnswers: Record<string, string>
  theoryFiles: Record<string, string>
}

export const defaultInternshipState: InternshipClientState = {
  paymentStatus: 'PENDING',
  assessmentStatus: 'LOCKED',
  objectiveAnswers: {},
  theoryAnswers: {},
  theoryFiles: {},
}
