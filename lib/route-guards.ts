import { redirect } from 'next/navigation'
import { RoleName } from '@/generated/prisma/client'
import {
  getDevelopmentRolePermissions,
  getDevelopmentAuthRole,
  isDevelopmentBypassEnabled,
  ensureDevelopmentUser,
} from '@/lib/dev-auth'
import {
  userHasPermission,
  userHasRole,
} from '@/lib/rbac'
import { ensurePrismaUserForSupabaseAuth } from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

type RouteAccessOptions = {
  requiredRoles?: RoleName[]
  requiredPermissions?: string[]
  redirectTo?: string
}

/**
 * Get the currently authenticated user's ID.
 *
 * Development:
 * - If DEV_AUTH_BYPASS is enabled, return the development
 *   user's real Prisma ID so API routes that need database
 *   relations continue to work.
 *
 * Production:
 * - Get the authenticated Supabase user.
 * - Synchronize the Supabase user into Prisma and return their ID.
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (isDevelopmentBypassEnabled()) {
    const developmentRole = await getDevelopmentAuthRole()

    if (developmentRole) {
      return ensureDevelopmentUser(developmentRole)
    }
  }

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  try {
    return await ensurePrismaUserForSupabaseAuth(user)
  } catch (syncError) {
    console.error(
      'Failed to synchronize Supabase auth user with Prisma:',
      syncError,
    )
    return null
  }
}

/**
 * Protect server-rendered routes.
 *
 * In development, the role cookie is trusted when the development
 * bypass is enabled. This avoids a database lookup just to render
 * a protected page.
 *
 * In production, the real authenticated user's database RBAC
 * permissions are checked.
 */
export async function requireRouteAccess({
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
}: RouteAccessOptions = {}): Promise<string> {
  /*
   * DEVELOPMENT BYPASS
   *
   * The role cookie is trusted only while the bypass is enabled. The
   * returned identity still maps to a real Prisma User so downstream
   * domain queries can safely use it as a UUID foreign key.
   */
  if (isDevelopmentBypassEnabled()) {
    const developmentRole = await getDevelopmentAuthRole()

    if (developmentRole) {
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(developmentRole)
      ) {
        redirect(redirectTo)
      }

      if (requiredPermissions.length > 0) {
        const permissions = await getDevelopmentRolePermissions(
          developmentRole,
        )
        const hasRequiredPermission = requiredPermissions.some(
          (permission) => permissions.includes(permission),
        )

        if (!hasRequiredPermission) {
          redirect(redirectTo)
        }
      }

      return ensureDevelopmentUser(developmentRole)
    }
  }

  /*
   * REAL AUTHENTICATION
   */
  const userId = await getCurrentUserId()

  if (!userId) {
    redirect(redirectTo)
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = await userHasRole(
      userId,
      requiredRoles,
    )

    if (!hasRequiredRole) {
      redirect(redirectTo)
    }
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermission =
      await userHasPermission(
        userId,
        requiredPermissions,
      )

    if (!hasRequiredPermission) {
      redirect(redirectTo)
    }
  }

  return userId
}
