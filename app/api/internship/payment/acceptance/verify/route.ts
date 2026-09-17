import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

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

    const applicationId = data.data.metadata?.applicationId as string | undefined
    if (!applicationId) {
      return NextResponse.json({ message: 'Payment reference is missing application context.' }, { status: 400 })
    }

    // Confirm the payment belongs to this user's own application before marking it paid.
    const application = await prisma.internshipApplication.findFirst({
      where: { id: applicationId, studentId: userId },
    })
    if (!application) {
      return NextResponse.json({ message: 'This payment does not belong to your account.' }, { status: 403 })
    }

    await prisma.internshipPayment.update({
      where: { applicationId },
      data: { status: 'PAID', paidAt: new Date(), reference },
    })

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Failed to verify acceptance fee payment:', error)
    return NextResponse.json({ message: 'Payment verification failed.' }, { status: 500 })
  }
}