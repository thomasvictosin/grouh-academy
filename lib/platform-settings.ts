import { getPrisma } from '@/lib/prisma'

export async function getPlatformSettings() {
  const prisma = getPrisma()
  const existing = await prisma.platformSettings.findUnique({ where: { id: 'singleton' } })
  if (existing) return existing
  return prisma.platformSettings.create({ data: { id: 'singleton' } })
}