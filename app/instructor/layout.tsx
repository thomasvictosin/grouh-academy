import { RoleName } from '@/generated/prisma/client'
import InstructorShell from '@/components/InstructorShell'
import { requireRouteAccess } from '@/lib/route-guards'

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  await requireRouteAccess({ requiredRoles: [RoleName.INSTRUCTOR] })

  return <InstructorShell>{children}</InstructorShell>
}
