import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: 'Paystack is not configured. Add PAYSTACK_SECRET_KEY to the server environment.' }, { status: 503 })
  }

  const prisma = getPrisma()
  let pendingApplicationId: string | null = null

  try {
    const body = await request.json().catch(() => null)
    const programSlug =
      typeof body?.programSlug === 'string'
        ? body.programSlug.trim()
        : null
    const user = await prisma.user.findUnique({ where: { id: userId } })
    let application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true, payment: true },
      orderBy: { createdAt: 'desc' },
    })

    if (programSlug) {
      const program = await prisma.internshipProgram.findUnique({
        where: { slug: programSlug },
        select: { id: true, status: true },
      })

      if (!program || program.status !== 'PUBLISHED') {
        return NextResponse.json({ message: 'Internship program not found.' }, { status: 404 })
      }

      await prisma.internshipApplication.upsert({
        where: { studentId_programId: { studentId: userId, programId: program.id } },
        create: { studentId: userId, programId: program.id },
        update: {},
      })

      application = await prisma.internshipApplication.findUnique({
        where: { studentId_programId: { studentId: userId, programId: program.id } },
        include: { program: true, payment: true },
      })
    }

    if (!application || !user) {
      return NextResponse.json({ message: 'No internship application found.' }, { status: 404 })
    }

    if (application.payment?.status === 'PAID') {
      return NextResponse.json({ message: 'Your acceptance fee has already been paid.' }, { status: 409 })
    }

    const reference = `acceptance_${application.id}_${Date.now()}`
    const amountKobo = application.program.assessmentFee * 100

    // Persist the pending record before sending the user to Paystack. This
    // gives verification an account-owned reference to settle and preserves
    // failed initialization attempts for operational follow-up.
    pendingApplicationId = application.id
    await prisma.internshipPayment.upsert({
      where: { applicationId: application.id },
      create: { applicationId: application.id, reference, amount: application.program.assessmentFee, currency: 'NGN', status: 'PENDING' },
      update: { reference, amount: application.program.assessmentFee, currency: 'NGN', status: 'PENDING', paidAt: null },
    })

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        amount: amountKobo,
        reference,
        metadata: { applicationId: application.id, purpose: 'internship_acceptance_fee' },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internship/payment/callback`,
      }),
    })
    const data = await response.json()
    if (!response.ok || !data.status) {
      await prisma.internshipPayment.update({
        where: { applicationId: application.id },
        data: { status: 'FAILED' },
      })
      return NextResponse.json({ message: data.message || 'Paystack rejected the payment request.' }, { status: 502 })
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url, reference })
  } catch (error) {
    if (pendingApplicationId) {
      try {
        await prisma.internshipPayment.update({
          where: { applicationId: pendingApplicationId },
          data: { status: 'FAILED' },
        })
      } catch (recordError) {
        console.error('Failed to mark payment initialization as failed:', recordError)
      }
    }
    console.error('Failed to initialize acceptance fee payment:', error)
    return NextResponse.json({ message: 'Unable to initialize payment.' }, { status: 500 })
  }
}
