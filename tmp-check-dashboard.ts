import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, AssessmentAttemptStatus, InternshipApplicationStatus, InternshipPaymentStatus, MentorAssignmentStatus, RoleName } from '@/generated/prisma/client'

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL
  if (!connectionString) throw new Error('Missing DATABASE_URL')

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

  try {
    const res = await Promise.all([
      prisma.internshipApplication.count(),
      prisma.internshipApplication.count({ where: { status: InternshipApplicationStatus.ACTIVE } }),
      prisma.internshipProgram.count({ where: { status: 'PUBLISHED' } }),
      prisma.user.count({ where: { roles: { some: { role: { name: RoleName.MENTOR } } } } }),
      prisma.internshipProgress.findMany({ select: { progressPercent: true } }),
      prisma.assessmentAttempt.count({ where: { status: { not: AssessmentAttemptStatus.NOT_STARTED } } }),
      prisma.mentorAssignment.findMany({ where: { status: MentorAssignmentStatus.ACTIVE }, include: { mentor: { select: { id: true, name: true } }, program: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, }),
      prisma.internshipApplication.findMany({ where: { status: InternshipApplicationStatus.ACTIVE }, include: { student: { select: { name: true } }, program: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 4, }),
      prisma.internshipPayment.findMany({ where: { status: { in: [InternshipPaymentStatus.PAID, InternshipPaymentStatus.PENDING] } }, include: { application: { include: { student: { select: { name: true } }, program: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' }, take: 4, }),
      prisma.announcement.findMany({ where: { scope: 'GLOBAL' }, include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 3, }),
      prisma.internshipPayment.aggregate({ _sum: { amount: true }, where: { status: InternshipPaymentStatus.PAID } }),
      prisma.assessmentAttempt.count({ where: { status: AssessmentAttemptStatus.PASSED } }),
    ])

    console.log(JSON.stringify(res.map((entry) => Array.isArray(entry) ? entry.length : entry), null, 2))
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
