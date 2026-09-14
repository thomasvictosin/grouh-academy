import { redirect } from 'next/navigation';

import type { RoleName } from '@/generated/prisma/client';
import {
  ensureDevelopmentUser,
  getDevelopmentAuthRole,
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

  if (!error && data.user) {
    try {
      await ensurePrismaUserForSupabaseAuth(data.user);
    } catch (syncError) {
      console.error('Failed to synchronize Supabase auth user with Prisma:', syncError);
      return null;
    }

    return data.user.id;
  }

  // No real Supabase session. Under the development bypass, back the
  // request with a real placeholder User row (see ensureDevelopmentUser)
  // rather than a synthetic id, so every downstream query that treats
  // this id as a real user — RBAC lookups, Course.createdById,
  // CourseInstructor.instructorId, etc — works without special-casing.
  if (isDevelopmentBypassEnabled()) {
    const developmentRole = await getDevelopmentAuthRole();

    if (developmentRole) {
      return ensureDevelopmentUser(developmentRole);
    }
  }

  return null;
}

export async function requireRouteAccess({
  requiredRoles = [],
  requiredPermissions = [],
  redirectTo = '/login',
}: RouteAccessOptions = {}): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(redirectTo);
  }

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