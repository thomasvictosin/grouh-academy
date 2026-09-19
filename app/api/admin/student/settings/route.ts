import { NextResponse } from 'next/server'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

const SETTINGS_ID = 'singleton'

async function requireAdmin() {
  const userId = await getCurrentUserId()
  if (!userId) return null
  return (await userHasRole(userId, RoleName.ADMIN)) ? userId : null
}

function serialize(settings: Awaited<ReturnType<typeof getSettings>>) {
  return {
    ...settings,
    updatedAt: settings.updatedAt.toISOString(),
  }
}

async function getSettings() {
  return getPrisma().platformSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID },
    update: {},
  })
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  try {
    return NextResponse.json(serialize(await getSettings()))
  } catch (error) {
    console.error('Failed to load platform settings:', error)
    return NextResponse.json({ error: 'Unable to load platform settings.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const userId = await requireAdmin()
  if (!userId) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'A settings payload is required.' }, { status: 400 })
  }

  const value = body as Record<string, unknown>
  const text = (key: string, maxLength: number) => {
    const field = value[key]
    return typeof field === 'string' && field.trim() && field.trim().length <= maxLength
      ? field.trim()
      : undefined
  }
  const boolean = (key: string) => typeof value[key] === 'boolean' ? value[key] : undefined

  const academyName = text('academyName', 120)
  const supportEmail = text('supportEmail', 254)
  const platformUrl = typeof value.platformUrl === 'string' ? value.platformUrl.trim() : undefined
  const defaultLanguage = text('defaultLanguage', 60)
  const timezone = text('timezone', 100)
  const maxUploadSizeMb = typeof value.maxUploadSizeMb === 'number'
    && Number.isInteger(value.maxUploadSizeMb)
    && value.maxUploadSizeMb >= 1
    && value.maxUploadSizeMb <= 25
    ? value.maxUploadSizeMb
    : undefined
  const certificateIssuerName = text('certificateIssuerName', 120)
  const certificatePrefix = text('certificatePrefix', 24)?.toUpperCase()
  const certificateMinimumCompletion = typeof value.certificateMinimumCompletion === 'number'
    && Number.isInteger(value.certificateMinimumCompletion)
    && value.certificateMinimumCompletion >= 1
    && value.certificateMinimumCompletion <= 100
    ? value.certificateMinimumCompletion
    : undefined

  if (supportEmail && !/^\S+@\S+\.\S+$/.test(supportEmail)) {
    return NextResponse.json({ error: 'Enter a valid support email address.' }, { status: 400 })
  }
  if (platformUrl) {
    try {
      const url = new URL(platformUrl)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol')
    } catch {
      return NextResponse.json({ error: 'Enter a valid http(s) platform URL.' }, { status: 400 })
    }
  }

  try {
    const settings = await getPrisma().platformSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID },
      update: {
        updatedById: userId,
        ...(academyName !== undefined && { academyName }),
        ...(supportEmail !== undefined && { supportEmail }),
        ...(platformUrl !== undefined && { platformUrl: platformUrl || null }),
        ...(defaultLanguage !== undefined && { defaultLanguage }),
        ...(timezone !== undefined && { timezone }),
        ...(maxUploadSizeMb !== undefined && { maxUploadSizeMb }),
        ...(boolean('courseEnrollmentEnabled') !== undefined && { courseEnrollmentEnabled: boolean('courseEnrollmentEnabled') }),
        ...(boolean('allowStudentRegistration') !== undefined && { allowStudentRegistration: boolean('allowStudentRegistration') }),
        ...(boolean('enableCourseReviews') !== undefined && { enableCourseReviews: boolean('enableCourseReviews') }),
        ...(boolean('autoApproveCourses') !== undefined && { autoApproveCourses: boolean('autoApproveCourses') }),
        ...(boolean('internshipApplicationsEnabled') !== undefined && { internshipApplicationsEnabled: boolean('internshipApplicationsEnabled') }),
        ...(boolean('maintenanceMode') !== undefined && { maintenanceMode: boolean('maintenanceMode') }),
        ...(certificateIssuerName !== undefined && { certificateIssuerName }),
        ...(certificatePrefix !== undefined && { certificatePrefix }),
        ...(certificateMinimumCompletion !== undefined && { certificateMinimumCompletion }),
        ...(boolean('automaticCertificateIssue') !== undefined && { automaticCertificateIssue: boolean('automaticCertificateIssue') }),
        ...(boolean('notifyAdminOnRegistration') !== undefined && { notifyAdminOnRegistration: boolean('notifyAdminOnRegistration') }),
        ...(boolean('notifyAdminOnPayment') !== undefined && { notifyAdminOnPayment: boolean('notifyAdminOnPayment') }),
        ...(boolean('notifyStudentOnEnrollment') !== undefined && { notifyStudentOnEnrollment: boolean('notifyStudentOnEnrollment') }),
        ...(boolean('notifyStudentOnCertificate') !== undefined && { notifyStudentOnCertificate: boolean('notifyStudentOnCertificate') }),
      },
    })

    return NextResponse.json(serialize(settings))
  } catch (error) {
    console.error('Failed to save platform settings:', error)
    return NextResponse.json({ error: 'Unable to save platform settings.' }, { status: 500 })
  }
}
