import { PrismaPg } from '@prisma/adapter-pg'
import { cookies } from 'next/headers'

import { PrismaClient, RoleName } from '@/generated/prisma/client'
import { getAuthorizedHomeRouteForRoles } from '@/lib/supabase/auth'

export const DEV_AUTH_COOKIE_NAME = 'grouh_dev_auth_role'

export const DEVELOPMENT_TEST_ROLES = [
  RoleName.ADMIN,
  RoleName.STUDENT,
  RoleName.INTERN,
  RoleName.INSTRUCTOR,
  RoleName.MENTOR,
] as const

export type DevelopmentRole = (typeof DEVELOPMENT_TEST_ROLES)[number]

export function isDevelopmentBypassEnabled(): boolean {
  return process.env.NODE_ENV === 'development' && process.env.DEV_AUTH_BYPASS === 'true'
}

export function getValidatedDevelopmentRole(value: unknown): DevelopmentRole | null {
  if (typeof value !== 'string') {
    return null
  }

  return DEVELOPMENT_TEST_ROLES.includes(value as DevelopmentRole)
    ? (value as DevelopmentRole)
    : null
}

export async function getDevelopmentAuthRole(): Promise<DevelopmentRole | null> {
  if (!isDevelopmentBypassEnabled()) {
    return null
  }

  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(DEV_AUTH_COOKIE_NAME)?.value

  return getValidatedDevelopmentRole(cookieValue)
}

function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Missing DIRECT_URL or DATABASE_URL environment variable for development auth helpers.')
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({ adapter })
}

export async function getDevelopmentRolePermissions(role: DevelopmentRole): Promise<string[]> {
  if (!isDevelopmentBypassEnabled()) {
    return []
  }

  const prisma = getPrismaClient()

  try {
    const roleRecord = await prisma.role.findUnique({
      where: { name: role },
      include: { permissions: { include: { permission: true } } },
    })

    if (!roleRecord) {
      return []
    }

    return Array.from(
      new Set(roleRecord.permissions.map((entry) => entry.permission.key)),
    )
  } finally {
    await prisma.$disconnect()
  }
}

export function getDevelopmentRouteForRole(role: DevelopmentRole): string {
  return getAuthorizedHomeRouteForRoles([role])
}
