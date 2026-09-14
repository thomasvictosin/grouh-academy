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

function developmentUserEmail(role: DevelopmentRole): string {
  return `dev-${role.toLowerCase()}@developer.local`
}

/**
 * Returns the id of a real User row backing the given development-bypass
 * role, creating it (and its Role assignment) on first use.
 *
 * This exists so getCurrentUserId() can hand back a genuine UUID under
 * the dev bypass, instead of a synthetic string like "dev:INSTRUCTOR".
 * A synthetic id is not a row in the database, so it fails the instant
 * it's used anywhere a real foreign key is expected (RBAC lookups,
 * Course.createdById, CourseInstructor.instructorId, etc) — a genuine
 * placeholder user with a real UserRole avoids that entire category of
 * bug, since every downstream query just sees a normal user.
 */
export async function ensureDevelopmentUser(role: DevelopmentRole): Promise<string> {
  if (!isDevelopmentBypassEnabled()) {
    throw new Error('ensureDevelopmentUser() called outside of development bypass mode.')
  }

  const prisma = getPrismaClient()

  try {
    const roleRecord = await prisma.role.findUnique({ where: { name: role } })

    if (!roleRecord) {
      throw new Error(
        `Development bypass role "${role}" has no matching Role row. Seed the Role table before using DEV_AUTH_BYPASS.`,
      )
    }

    const email = developmentUserEmail(role)

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: `Dev ${role}`,
      },
    })

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: roleRecord.id } },
      update: {},
      create: { userId: user.id, roleId: roleRecord.id },
    })

    return user.id
  } finally {
    await prisma.$disconnect()
  }
}