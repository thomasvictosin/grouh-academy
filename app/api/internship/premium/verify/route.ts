import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import { amountToTier } from '@/lib/internship-premium'
import { autoAssignMentor } from '@/lib/internship-mentor-assign'

export async function GET(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 })
  }

  const reference = new URL(request.url).searchParams.get('reference')
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!reference) return NextResponse.json({ message: 'Missing payment reference.' }, { status: 400 })
  if (!secretKey) return NextResponse.json({ message: 'Paystack is not configured.' }, { status: 503 })

  const prisma = getPrisma()

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    })
    const data = await response.json()
    if (!response.ok || data.data?.status !== 'success') {
      return NextResponse.json({ message: 'Payment was not successful.' }, { status: 402 })
    }

    const payment = await prisma.payment.findUnique({ where: { reference } })
    if (!payment || payment.userId !== userId) {
      return NextResponse.json({ message: 'This payment does not belong to your account.' }, { status: 403 })
    }

    const tier = await amountToTier(payment.amount)
    if (!tier) {
      return NextResponse.json({ message: 'Unrecognized payment amount.' }, { status: 400 })
    }

    await prisma.payment.update({ where: { reference }, data: { status: 'PAID', paidAt: new Date() } })

    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ message: 'No application found.' }, { status: 404 })
    }

    await prisma.internshipApplication.update({
      where: { id: application.id },
      data: { premiumTier: tier, premiumActivatedAt: new Date() },
    })

    let mentorAssigned = true
    try {
      await autoAssignMentor(userId, application.programId)
    } catch (mentorError) {
      // Don't fail the payment confirmation just because no mentor is
      // available right now — an admin can assign one manually later.
      console.error('Premium payment succeeded but mentor auto-assignment failed:', mentorError)
      mentorAssigned = false
    }

    return NextResponse.json({ status: 'success', tier, mentorAssigned })
  } catch (error) {
    console.error('Failed to verify premium payment:', error)
    return NextResponse.json({ message: 'Payment verification failed.' }, { status: 500 })
  }
}