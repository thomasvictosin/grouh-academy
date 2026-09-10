import { RoleName } from '@/generated/prisma/client'
import MentorShell from '@/components/MentorShell'
import { requireRouteAccess } from '@/lib/route-guards'

export default async function MentorLayout({ children }: { children: React.ReactNode }) {
  await requireRouteAccess({ requiredRoles: [RoleName.MENTOR] })

  return <MentorShell>{children}</MentorShell>
}
