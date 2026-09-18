import { RoleName } from '@/generated/prisma/client'
import { requireRouteAccess } from '@/lib/route-guards'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const start = performance.now()

  await requireRouteAccess({
    requiredRoles: [RoleName.ADMIN],
  })

  console.log(
    `[admin/layout] requireRouteAccess: ${Math.round(
      performance.now() - start,
    )}ms`,
  )

  return children
}