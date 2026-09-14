import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { ThemeMode } from '@/generated/prisma/client'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { settings: true } })
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    const settings = user.settings ?? (await prisma.userSettings.create({ data: { userId } }))

    return NextResponse.json({
      avatarUrl: user.avatarUrl,
      profileVisible: settings.profileVisible,
      showLearningStats: settings.showLearningStats,
      notifications: {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        courseUpdates: settings.courseUpdates,
        assignmentReminders: settings.assignmentReminders,
        gradeNotifications: settings.gradeNotifications,
        mentorshipMessages: settings.mentorshipMessages,
      },
      theme: settings.theme,
      language: settings.language,
      timezone: settings.timezone,
    })
  } catch (error) {
    console.error('Failed to load settings:', error)
    return NextResponse.json({ error: 'Unable to load settings.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const {
    profileVisible,
    showLearningStats,
    notifications,
    theme,
    language,
    timezone,
  } = body as Record<string, unknown>

  const n = (notifications ?? {}) as Record<string, unknown>
  const bool = (v: unknown) => (typeof v === 'boolean' ? v : undefined)

  const themeValue =
    theme === 'LIGHT' || theme === 'DARK' ? (theme as ThemeMode) : undefined

  const prisma = getPrisma()

  try {
    await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        profileVisible: bool(profileVisible) ?? true,
        showLearningStats: bool(showLearningStats) ?? false,
        emailNotifications: bool(n.emailNotifications) ?? true,
        pushNotifications: bool(n.pushNotifications) ?? true,
        courseUpdates: bool(n.courseUpdates) ?? true,
        assignmentReminders: bool(n.assignmentReminders) ?? false,
        gradeNotifications: bool(n.gradeNotifications) ?? true,
        mentorshipMessages: bool(n.mentorshipMessages) ?? false,
        theme: themeValue ?? ThemeMode.LIGHT,
        language: typeof language === 'string' ? language : undefined,
        timezone: typeof timezone === 'string' ? timezone : undefined,
      },
      update: {
        profileVisible: bool(profileVisible),
        showLearningStats: bool(showLearningStats),
        emailNotifications: bool(n.emailNotifications),
        pushNotifications: bool(n.pushNotifications),
        courseUpdates: bool(n.courseUpdates),
        assignmentReminders: bool(n.assignmentReminders),
        gradeNotifications: bool(n.gradeNotifications),
        mentorshipMessages: bool(n.mentorshipMessages),
        theme: themeValue,
        language: typeof language === 'string' ? language : undefined,
        timezone: typeof timezone === 'string' ? timezone : undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: 'Unable to save settings.' }, { status: 500 })
  }
}