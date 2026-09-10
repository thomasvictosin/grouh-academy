import React from 'react'
import { RoleName } from '@/generated/prisma/client'
import StudentShell from '../../components/StudentShell'
import { requireRouteAccess } from '@/lib/route-guards'

export const metadata = {
  title: 'Student Dashboard',
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  await requireRouteAccess({ requiredRoles: [RoleName.STUDENT] })

  return (
    <StudentShell>{children}</StudentShell>
  )
}
