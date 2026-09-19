import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { getPlatformSettings } from '@/lib/platform-settings'
import { userHasRole } from '@/lib/rbac'
import { RoleName } from '@/generated/prisma/client'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, [RoleName.ADMIN]))) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })
  }

  try {
    const settings = await getPlatformSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to load platform settings:', error)
    return NextResponse.json({ error: 'Unable to load settings.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, [RoleName.ADMIN]))) {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const prisma = getPrisma()

  const allowedFields = [
    'platformName', 'supportEmail', 'defaultLanguage', 'timezone', 'maxUploadSizeMb',
    'allowStudentRegistration', 'enableCourseReviews', 'autoApproveSubmittedCourses', 'maintenanceMode',
    'premiumTier1Amount', 'premiumTier2Amount', 'defaultAssessmentPassScore', 'maxGroupSize', 'certificateNumberPrefix',
  ] as const

  const data: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (field in body) data[field] = body[field]
  }

  try {
    await getPlatformSettings() // ensures the singleton row exists first
    const updated = await prisma.platformSettings.update({
      where: { id: 'singleton' },
      data: { ...data, updatedById: userId },
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update platform settings:', error)
    return NextResponse.json({ error: 'Unable to save settings.' }, { status: 500 })
  }
}