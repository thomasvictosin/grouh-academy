import { RoleName } from '@/generated/prisma/client'
import { requireRouteAccess } from '@/lib/route-guards'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRouteAccess({ requiredRoles: [RoleName.ADMIN] })

  return children
}
