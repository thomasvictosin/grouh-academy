import { redirect } from 'next/navigation';

import type { RoleName } from '@/generated/prisma/client';
import {
  getDevelopmentAuthRole,
  getDevelopmentRolePermissions,
  isDevelopmentBypassEnabled,
} from '@/lib/dev-auth';
import type { PermissionKey } from '@/lib/rbac';
import { userHasPermission, userHasRole } from '@/lib/rbac';
import { ensurePrismaUserForSupabaseAuth } from '@/lib/supabase/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type RouteAccessOptions = {
  requiredRoles?: RoleName[];
  requiredPermissions?: PermissionKey[];
  redirectTo?: string;
};

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  try {
    await ensurePrismaUserForSupabaseAuth(data.user);
  } catch (error) {
    console.error('Failed to synchronize Supabase auth user with Prisma:', error);
    return null;
  }

  return data.user.id;
}

export async function requireRouteAccess({
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
}: RouteAccessOptions = {}): Promise<string> {
  const userId = await getCurrentUserId();

  if (userId) {
    if (requiredRoles.length > 0) {
      const hasRole = await userHasRole(userId, requiredRoles);

      if (!hasRole) {
        redirect(redirectTo);
      }
    }

    if (requiredPermissions.length > 0) {
      const hasPermission = await userHasPermission(userId, requiredPermissions);

      if (!hasPermission) {
        redirect(redirectTo);
      }
    }

    return userId;
  }

  const developmentRole = await getDevelopmentAuthRole();

  if (isDevelopmentBypassEnabled() && developmentRole) {
    if (requiredRoles.length > 0 && !requiredRoles.includes(developmentRole)) {
      redirect(redirectTo);
    }

    if (requiredPermissions.length > 0) {
      const developmentPermissions = await getDevelopmentRolePermissions(developmentRole);
      const hasPermission = requiredPermissions.some((permission) =>
        developmentPermissions.includes(permission),
      );

      if (!hasPermission) {
        redirect(redirectTo);
      }
    }

    return `dev:${developmentRole}`;
  }

  redirect(redirectTo);
}
