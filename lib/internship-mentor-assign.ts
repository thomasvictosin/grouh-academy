import { getPrisma } from '@/lib/prisma'

// Picks the approved mentor with the fewest current ACTIVE assignments.
// Not wired into any route yet — Phase 3 calls this after a premium payment
// verifies. Kept here now since the decision (auto-assign, admin can change
// later) is already settled.
export async function autoAssignMentor(userId: string, programId: string) {
  const prisma = getPrisma()

  const existing = await prisma.mentorAssignment.findFirst({
    where: { internId: userId, programId, status: 'ACTIVE' },
  })
  if (existing) return existing

  const mentors = await prisma.mentorProfile.findMany({
    where: { status: 'APPROVED' },
    include: { user: { include: { mentorAssignments: { where: { status: 'ACTIVE' } } } } },
  })

  if (mentors.length === 0) {
    throw new Error('No approved mentors are available for assignment.')
  }

  const leastLoaded = mentors.reduce((best, current) =>
    current.user.mentorAssignments.length < best.user.mentorAssignments.length ? current : best,
  )

  return prisma.mentorAssignment.create({
    data: { mentorId: leastLoaded.userId, internId: userId, programId, status: 'ACTIVE' },
  })
}