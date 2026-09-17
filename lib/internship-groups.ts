import { getPrisma } from '@/lib/prisma'

const GROUP_CAPACITY = 12

export async function ensureGroupMembership(userId: string, programId: string) {
  const prisma = getPrisma()

  const existingMembership = await prisma.internshipGroupMember.findUnique({
    where: { programId_userId: { programId, userId } },
    include: { group: true },
  })
  if (existingMembership) {
    return existingMembership.group
  }

  const groups = await prisma.internshipGroup.findMany({
    where: { programId },
    orderBy: { number: 'asc' },
    include: { _count: { select: { members: true } } },
  })

  const groupWithRoom = groups.find((g) => g._count.members < g.capacity)

  const targetGroup =
    groupWithRoom ??
    (await prisma.internshipGroup.create({
      data: {
        programId,
        number: (groups[groups.length - 1]?.number ?? 0) + 1,
        capacity: GROUP_CAPACITY,
      },
    }))

  const currentMemberCount = await prisma.internshipGroupMember.count({ where: { groupId: targetGroup.id } })

  await prisma.internshipGroupMember.create({
    data: { groupId: targetGroup.id, programId, userId },
  })

  if (currentMemberCount === 0) {
    await prisma.internshipGroup.update({ where: { id: targetGroup.id }, data: { leaderId: userId } })
  }

  return prisma.internshipGroup.findUniqueOrThrow({ where: { id: targetGroup.id } })
}