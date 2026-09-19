import React from 'react'
import { redirect } from 'next/navigation'
import { RoleName } from '@/generated/prisma/client'
import StudentShell from '../../components/StudentShell'
import { requireRouteAccess } from '@/lib/route-guards'
import { getInternshipAccessStatus } from '@/lib/internship-access'

export const metadata = {
  title: 'Student Dashboard',
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const userId = await requireRouteAccess({ requiredRoles: [RoleName.STUDENT] })

  const access = await getInternshipAccessStatus(userId)
  if (!access.hasApplication) {
    redirect('/internship/onboarding')
  }

  if (access.hasApplication && !access.acceptanceFeePaid) {
    redirect('/internship/dashboard')
  }

  return (
    <StudentShell>{children}</StudentShell>
  )
}