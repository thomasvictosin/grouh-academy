import { NextResponse } from 'next/server'

import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'
import { userHasRole } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/route-guards'

function calculateStatus(startDate: Date, endDate: Date) {
  const now = new Date()
  if (now < startDate) return 'UPCOMING'
  if (now > endDate) return 'COMPLETED'
  return 'ACTIVE'
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function monthName(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'cohort'
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const prisma = getPrisma()
  const [programs, cohorts] = await Promise.all([
    prisma.internshipProgram.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.internshipCohort.findMany({
      orderBy: { startDate: 'asc' },
      include: { program: { select: { id: true, name: true } } },
    }),
  ])

  return NextResponse.json({
    programs,
    cohorts: cohorts.map((cohort) => ({
      id: cohort.id,
      name: cohort.name,
      slug: cohort.slug,
      description: cohort.description,
      programId: cohort.programId,
      programName: cohort.program.name,
      trackName: cohort.program.name,
      startDate: cohort.startDate.toISOString(),
      endDate: cohort.endDate.toISOString(),
      status: calculateStatus(cohort.startDate, cohort.endDate),
      startDateLabel: formatDate(cohort.startDate),
      endDateLabel: formatDate(cohort.endDate),
      monthLabel: monthName(cohort.startDate),
    })),
  })
}

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Cohort data is required.' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const programId = String(body.programId ?? '').trim()
  const description = String(body.description ?? '').trim()

  if (!name || !programId) {
    return NextResponse.json({ error: 'Cohort name and track are required.' }, { status: 400 })
  }

  const startDate = new Date(body.startDate)
  const endDate = new Date(body.endDate)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: 'Use valid cohort start and end dates.' }, { status: 400 })
  }

  if (startDate >= endDate) {
    return NextResponse.json({ error: 'Cohort end date must be after the start date.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const program = await prisma.internshipProgram.findUnique({ where: { id: programId } })
  if (!program) {
    return NextResponse.json({ error: 'Selected internship track was not found.' }, { status: 400 })
  }

  const cohort = await prisma.internshipCohort.create({
    data: {
      programId,
      name,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      description: description || null,
      startDate,
      endDate,
      status: calculateStatus(startDate, endDate),
    },
  })

  return NextResponse.json({ success: true, cohort: { id: cohort.id, name: cohort.name } })
}

export async function PUT(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: 'Cohort update payload is required.' }, { status: 400 })
  }

  const id = String(body.id ?? '').trim()
  const name = String(body.name ?? '').trim()
  const programId = String(body.programId ?? '').trim()
  const description = String(body.description ?? '').trim()
  const startDate = new Date(body.startDate)
  const endDate = new Date(body.endDate)

  if (!id || !name || !programId || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return NextResponse.json({ error: 'Invalid cohort update data.' }, { status: 400 })
  }

  if (startDate >= endDate) {
    return NextResponse.json({ error: 'Cohort end date must be after the start date.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const cohort = await prisma.internshipCohort.findUnique({ where: { id } })
  if (!cohort) {
    return NextResponse.json({ error: 'Cohort not found.' }, { status: 404 })
  }

  const updated = await prisma.internshipCohort.update({
    where: { id },
    data: {
      name,
      programId,
      description: description || null,
      startDate,
      endDate,
      slug: `${slugify(name)}-${Date.now().toString(36)}`,
      status: calculateStatus(startDate, endDate),
    },
  })

  return NextResponse.json({ success: true, cohort: { id: updated.id, name: updated.name } })
}

export async function DELETE(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId || !(await userHasRole(userId, RoleName.ADMIN))) {
    return NextResponse.json({ error: 'Administrator access is required.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const id = String(body?.id ?? '').trim()

  if (!id) {
    return NextResponse.json({ error: 'A cohort id is required.' }, { status: 400 })
  }

  const prisma = getPrisma()
  const cohort = await prisma.internshipCohort.findUnique({ where: { id } })
  if (!cohort) {
    return NextResponse.json({ error: 'Cohort not found.' }, { status: 404 })
  }

  await prisma.internshipCohort.delete({ where: { id } })

  return NextResponse.json({ success: true, deletedId: id })
}
