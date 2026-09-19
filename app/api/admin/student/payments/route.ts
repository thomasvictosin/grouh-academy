import { NextResponse } from 'next/server'
import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

export async function GET() {
  const adminId = await getCurrentUserId()
  if (!adminId || !(await userHasRole(adminId, RoleName.ADMIN))) return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  const payments = await getPrisma().payment.findMany({ orderBy: { createdAt: 'desc' }, select: { id: true, reference: true, amount: true, currency: true, provider: true, status: true, createdAt: true, paidAt: true, user: { select: { name: true, email: true } }, course: { select: { title: true } }, internshipProgram: { select: { name: true } } } })
  return NextResponse.json({ payments: payments.map((item) => ({ id: item.id, reference: item.reference, amount: item.amount, currency: item.currency, provider: item.provider, status: item.status, createdAt: item.createdAt.toISOString(), paidAt: item.paidAt?.toISOString() ?? null, student: item.user.name || item.user.email, email: item.user.email, item: item.course?.title || item.internshipProgram?.name || 'Platform payment' })) })
}
