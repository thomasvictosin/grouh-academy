import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export async function POST() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ message: 'Paystack is not configured. Add PAYSTACK_SECRET_KEY to the server environment.' }, { status: 503 })
  }

  const prisma = getPrisma()

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    })

    if (!application || !user) {
      return NextResponse.json({ message: 'No internship application found.' }, { status: 404 })
    }

    const reference = `acceptance_${application.id}_${Date.now()}`
    const amountKobo = application.program.assessmentFee * 100

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
      return NextResponse.json({ message: data.message || 'Paystack rejected the payment request.' }, { status: 502 })
    }

    await prisma.internshipPayment.upsert({
      where: { applicationId: application.id },
      create: { applicationId: application.id, reference, amount: application.program.assessmentFee, currency: 'NGN', status: 'PENDING' },
      update: { reference, amount: application.program.assessmentFee, status: 'PENDING' },
    })

    return NextResponse.json({ authorization_url: data.data.authorization_url, reference })
  } catch (error) {
    console.error('Failed to initialize acceptance fee payment:', error)
    return NextResponse.json({ message: 'Unable to initialize payment.' }, { status: 500 })
  }
}