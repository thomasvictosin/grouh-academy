import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, RoleName } from '@/generated/prisma/client'
import { getUserRBAC } from '@/lib/rbac'

export type SupabaseAuthUser = {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown> | null
}

function getPrismaClient(): PrismaClient {
  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Missing DIRECT_URL or DATABASE_URL environment variable for Prisma auth synchronization.')
  }

  const adapter = new PrismaPg({ connectionString })

  return new PrismaClient({ adapter })
}

const rolePriority: RoleName[] = [
  RoleName.ADMIN,
  RoleName.INSTRUCTOR,
  RoleName.MENTOR,
  RoleName.INTERN,
  RoleName.STUDENT,
]

export function getAuthorizedHomeRouteForRoles(roles: RoleName[]): string {
  for (const role of rolePriority) {
    if (roles.includes(role)) {
      switch (role) {
        case RoleName.ADMIN:
          return '/admin/student'
        case RoleName.INSTRUCTOR:
          return '/instructor'
        case RoleName.MENTOR:
          return '/mentor'
        case RoleName.INTERN:
          return '/internship/dashboard'
        case RoleName.STUDENT:
        default:
          return '/student'
      }
    }
  }

  return '/student'
}

export async function getAuthorizedHomeRouteForUserId(userId: string): Promise<string> {
  const { roles } = await getUserRBAC(userId)
  return getAuthorizedHomeRouteForRoles(roles)
}

export async function ensurePrismaUserForSupabaseAuth(authUser: SupabaseAuthUser): Promise<string> {
  if (!authUser.id) {
    throw new Error('Supabase auth user is missing an id.')
  }

  const prisma = getPrismaClient()

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: { roles: { include: { role: true } } },
    })

    if (existingUser) {
      if (existingUser.roles.length === 0) {
        const studentRole = await prisma.role.findUnique({
          where: { name: RoleName.STUDENT },
        })

        if (studentRole) {
          await prisma.userRole.upsert({
            where: {
              userId_roleId: {
                userId: existingUser.id,
                roleId: studentRole.id,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              roleId: studentRole.id,
            },
          })
        }
      }

      return existingUser.id
    }

    const studentRole = await prisma.role.findUnique({
      where: { name: RoleName.STUDENT },
    })

    if (!studentRole) {
      throw new Error('The STUDENT role was not found in the Prisma RBAC data.')
    }

    const createdUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email ?? `${authUser.id}@supabase.local`,
        name:
          typeof authUser.user_metadata?.full_name === 'string'
            ? authUser.user_metadata.full_name
            : typeof authUser.user_metadata?.name === 'string'
              ? authUser.user_metadata.name
              : authUser.email?.split('@')[0] ?? 'Supabase User',
        status: 'ACTIVE',
      },
    })

    await prisma.userRole.create({
      data: {
        userId: createdUser.id,
        roleId: studentRole.id,
      },
    })

    return createdUser.id
  } finally {
    await prisma.$disconnect()
  }
}
