import { cookies } from 'next/headers'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { getAuthorizedHomeRouteForRoles } from '@/lib/supabase/auth'

export const DEV_AUTH_COOKIE_NAME = 'grouh_dev_auth_role'

export const DEVELOPMENT_TEST_ROLES = [
  RoleName.ADMIN,
  RoleName.STUDENT,
  RoleName.INTERN,
  RoleName.INSTRUCTOR,
  RoleName.MENTOR,
] as const

export type DevelopmentRole =
  (typeof DEVELOPMENT_TEST_ROLES)[number]

type DevelopmentAuthCache = {
  userIds: Map<DevelopmentRole, string>
  initializationPromises: Map<
    DevelopmentRole,
    Promise<string>
  >
  permissionCache: Map<DevelopmentRole, string[]>
  permissionPromises: Map<
    DevelopmentRole,
    Promise<string[]>
  >
}

const globalForDevelopmentAuth =
  globalThis as typeof globalThis & {
    __grouhDevelopmentAuthCache?: DevelopmentAuthCache
  }

const developmentAuthCache =
  globalForDevelopmentAuth.__grouhDevelopmentAuthCache ??
  {
    userIds: new Map<DevelopmentRole, string>(),
    initializationPromises: new Map<
      DevelopmentRole,
      Promise<string>
    >(),
    permissionCache: new Map<DevelopmentRole, string[]>(),
    permissionPromises: new Map<
      DevelopmentRole,
      Promise<string[]>
    >(),
  }

globalForDevelopmentAuth.__grouhDevelopmentAuthCache =
  developmentAuthCache

export function isDevelopmentBypassEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    process.env.DEV_AUTH_BYPASS === 'true'
  )
}

export function getValidatedDevelopmentRole(
  value: unknown,
): DevelopmentRole | null {
  if (typeof value !== 'string') {
    return null
  }

  return DEVELOPMENT_TEST_ROLES.includes(
    value as DevelopmentRole,
  )
    ? (value as DevelopmentRole)
    : null
}

export async function getDevelopmentAuthRole(): Promise<
  DevelopmentRole | null
> {
  if (!isDevelopmentBypassEnabled()) {
    return null
  }

  const cookieStore = await cookies()

  const cookieValue = cookieStore.get(
    DEV_AUTH_COOKIE_NAME,
  )?.value

  return getValidatedDevelopmentRole(cookieValue)
}

export async function getDevelopmentRolePermissions(
  role: DevelopmentRole,
): Promise<string[]> {
  if (!isDevelopmentBypassEnabled()) {
    return []
  }

  const cachedPermissions =
    developmentAuthCache.permissionCache.get(role)

  if (cachedPermissions) {
    return cachedPermissions
  }

  const existingPromise =
    developmentAuthCache.permissionPromises.get(role)

  if (existingPromise) {
    return existingPromise
  }

  const permissionPromise =
    loadDevelopmentRolePermissions(role)

  developmentAuthCache.permissionPromises.set(
    role,
    permissionPromise,
  )

  try {
    const permissions = await permissionPromise

    developmentAuthCache.permissionCache.set(
      role,
      permissions,
    )

    return permissions
  } finally {
    developmentAuthCache.permissionPromises.delete(role)
  }
}

async function loadDevelopmentRolePermissions(
  role: DevelopmentRole,
): Promise<string[]> {
  const prisma = getPrisma()

  const roleRecord = await prisma.role.findUnique({
    where: {
      name: role,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  })

  if (!roleRecord) {
    return []
  }

  return Array.from(
    new Set(
      roleRecord.permissions.map(
        (entry) => entry.permission.key,
      ),
    ),
  )
}

export function getDevelopmentRouteForRole(
  role: DevelopmentRole,
): string {
  return getAuthorizedHomeRouteForRoles([role])
}

function developmentUserEmail(
  role: DevelopmentRole,
): string {
  return `dev-${role.toLowerCase()}@developer.local`
}

export async function ensureDevelopmentUser(
  role: DevelopmentRole,
): Promise<string> {
  if (!isDevelopmentBypassEnabled()) {
    throw new Error(
      'ensureDevelopmentUser() called outside of development bypass mode.',
    )
  }

  const cachedUserId =
    developmentAuthCache.userIds.get(role)

  if (cachedUserId) {
    return cachedUserId
  }

  const existingPromise =
    developmentAuthCache.initializationPromises.get(role)

  if (existingPromise) {
    return existingPromise
  }

  const initializationPromise =
    initializeDevelopmentUser(role)

  developmentAuthCache.initializationPromises.set(
    role,
    initializationPromise,
  )

  try {
    const userId = await initializationPromise

    developmentAuthCache.userIds.set(
      role,
      userId,
    )

    return userId
  } finally {
    developmentAuthCache.initializationPromises.delete(
      role,
    )
  }
}

async function initializeDevelopmentUser(
  role: DevelopmentRole,
): Promise<string> {
  const prisma = getPrisma()
  const email = developmentUserEmail(role)

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      roles: {
        where: {
          role: {
            name: role,
          },
        },
        select: {
          roleId: true,
        },
      },
    },
  })

  if (
    existingUser &&
    existingUser.roles.length > 0
  ) {
    return existingUser.id
  }

  const roleRecord = await prisma.role.findUnique({
    where: {
      name: role,
    },
    select: {
      id: true,
    },
  })

  if (!roleRecord) {
    throw new Error(
      `Development bypass role "${role}" has no matching Role row. Seed the Role table before using DEV_AUTH_BYPASS.`,
    )
  }

  let userId = existingUser?.id

  if (!userId) {
    const user = await prisma.user.create({
      data: {
        email,
        name: `Dev ${role}`,
      },
      select: {
        id: true,
      },
    })

    userId = user.id
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: roleRecord.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: roleRecord.id,
    },
  })

  return userId
}

export function clearDevelopmentUserCache(): void {
  developmentAuthCache.userIds.clear()
  developmentAuthCache.initializationPromises.clear()
  developmentAuthCache.permissionCache.clear()
  developmentAuthCache.permissionPromises.clear()
}