import { RoleName } from '../generated/prisma/client';
import { getPrisma } from '@/lib/prisma';
import {
  getDevelopmentRolePermissions,
  getValidatedDevelopmentRole,
  isDevelopmentBypassEnabled,
} from '@/lib/dev-auth';

export type PermissionKey = string;

export interface UserRBAC {
  userId: string;
  roles: RoleName[];
  permissions: PermissionKey[];
}

const DEV_USER_ID_PREFIX = 'dev:';

export async function getUserRBAC(userId: string): Promise<UserRBAC> {
  // Development-bypass identities (e.g. "dev:INSTRUCTOR") are not rows
  // in the database and are never valid UUIDs, so they must never reach
  // the userId-keyed Prisma queries below.
  if (userId.startsWith(DEV_USER_ID_PREFIX)) {
    if (!isDevelopmentBypassEnabled()) {
      return { userId, roles: [], permissions: [] };
    }

    const developmentRole = getValidatedDevelopmentRole(
      userId.slice(DEV_USER_ID_PREFIX.length),
    );

    if (!developmentRole) {
      return { userId, roles: [], permissions: [] };
    }

    const permissions = await getDevelopmentRolePermissions(developmentRole);

    return {
      userId,
      roles: [developmentRole],
      permissions,
    };
  }

  const prisma = getPrisma();

  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: { roleId: true, role: { select: { name: true } } },
  });

  const roleIds = userRoles.map((entry) => entry.roleId);

  const rolePermissionRows = roleIds.length
    ? await prisma.rolePermission.findMany({
        where: { roleId: { in: roleIds } },
        select: { permission: { select: { key: true } } },
      })
    : [];

  const roles = Array.from(
    new Set(userRoles.map((entry) => entry.role.name as RoleName)),
  );

  const permissions = Array.from(
    new Set(rolePermissionRows.map((entry) => entry.permission.key)),
  );

  return {
    userId,
    roles,
    permissions,
  };
}

export async function userHasRole(
  userId: string,
  targetRoles: RoleName | RoleName[],
): Promise<boolean> {
  const rbac = await getUserRBAC(userId);
  const rolesToCheck = Array.isArray(targetRoles) ? targetRoles : [targetRoles];

  return rolesToCheck.some((role) => rbac.roles.includes(role));
}

export async function userHasPermission(
  userId: string,
  targetPermissions: PermissionKey | PermissionKey[],
): Promise<boolean> {
  const rbac = await getUserRBAC(userId);
  const permissionsToCheck = Array.isArray(targetPermissions)
    ? targetPermissions
    : [targetPermissions];

  return permissionsToCheck.some((permission) => rbac.permissions.includes(permission));
}

export async function requireUserPermissions(
  userId: string,
  targetPermissions: PermissionKey | PermissionKey[],
): Promise<boolean> {
  return userHasPermission(userId, targetPermissions);
}

export async function getUserRoleNames(userId: string): Promise<RoleName[]> {
  return (await getUserRBAC(userId)).roles;
}

export async function getUserPermissions(userId: string): Promise<PermissionKey[]> {
  return (await getUserRBAC(userId)).permissions;
}