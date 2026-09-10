import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RoleName } from '../generated/prisma/client';

export type PermissionKey = string;

export interface UserRBAC {
  userId: string;
  roles: RoleName[];
  permissions: PermissionKey[];
}

declare global {
  var __grouhPrismaClient: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (!globalThis.__grouhPrismaClient) {
    const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('Missing DIRECT_URL or DATABASE_URL environment variable for Prisma RBAC utilities.');
    }

    const adapter = new PrismaPg({ connectionString });
    globalThis.__grouhPrismaClient = new PrismaClient({ adapter });
  }

  return globalThis.__grouhPrismaClient;
}

export async function getUserRBAC(userId: string): Promise<UserRBAC> {
  const prisma = getPrismaClient();

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
