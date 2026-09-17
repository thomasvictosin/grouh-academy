import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const targetUserId = searchParams.get('userId')
  if (!targetUserId) {
    return NextResponse.json({ error: 'userId is required.' }, { status: 400 })
  }

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ error: 'No internship application found.' }, { status: 404 })
    }

    const myMembership = await prisma.internshipGroupMember.findUnique({
      where: { programId_userId: { programId: application.programId, userId } },
    })
    const targetMembership = await prisma.internshipGroupMember.findUnique({
      where: { programId_userId: { programId: application.programId, userId: targetUserId } },
    })

    if (!myMembership || !targetMembership || myMembership.groupId !== targetMembership.groupId) {
      return NextResponse.json({ error: 'That member is not in your group.' }, { status: 403 })
    }

    const [targetUser, targetSettings, targetProgress, group] = await Promise.all([
      prisma.user.findUnique({ where: { id: targetUserId }, include: { profile: true } }),
      prisma.userSettings.findUnique({ where: { userId: targetUserId } }),
      prisma.internshipProgress.findUnique({
        where: { userId_programId: { userId: targetUserId, programId: application.programId } },
      }),
      prisma.internshipGroup.findUnique({ where: { id: myMembership.groupId } }),
    ])

    if (!targetUser) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 });
    }

    const profileVisible = targetSettings?.profileVisible ?? true

    if (!profileVisible) {
      return NextResponse.json({
        visible: false,
        name: targetUser.name ?? 'Member',
        isLeader: group?.leaderId === targetUserId,
      })
    }

    return NextResponse.json({
      visible: true,
      name: targetUser.name ?? 'Member',
      avatarUrl: targetUser.avatarUrl,
      bio: targetUser.profile?.bio ?? null,
      skills: targetUser.profile?.skills ?? [],
      isLeader: group?.leaderId === targetUserId,
      progressPercent: targetProgress?.progressPercent ?? 0,
      completedTasks: targetProgress?.completedTasks ?? 0,
      totalTasks: targetProgress?.totalTasks ?? 0,
    })
  } catch (error) {
    console.error('Failed to load teammate profile:', error)
    return NextResponse.json({ error: 'Unable to load member profile.' }, { status: 500 })
  }
}