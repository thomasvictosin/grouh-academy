import { NextResponse } from 'next/server'

import { getPremiumTierAmounts, type PremiumTierKey } from '@/lib/internship-premium'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'

export async function POST(request: Request) {
  const userId = await getCurrentUserId()
  if (!userId) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const tier = body?.tier as PremiumTierKey | undefined
  const tierAmounts = await getPremiumTierAmounts()
  if (!tier || !(tier in tierAmounts)) return NextResponse.json({ error: 'Invalid premium tier.' }, { status: 400 })

  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Paystack is not configured.' }, { status: 503 })

  const prisma = getPrisma()
  try {
    const [user, application] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.internshipApplication.findFirst({ where: { studentId: userId }, orderBy: { createdAt: 'desc' } }),
    ])
    if (!application || !user) return NextResponse.json({ error: 'Complete your internship application before upgrading.' }, { status: 404 })

    const amount = tierAmounts[tier]
    const reference = `premium_${application.id}_${Date.now()}`
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        amount: amount * 100,
        reference,
        metadata: { applicationId: application.id, tier, purpose: 'internship_premium' },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internship/payment/callback?type=premium`,
      }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok || !data?.status || !data.data?.authorization_url) {
      return NextResponse.json({ error: data?.message || 'Paystack rejected the payment request.' }, { status: 502 })
    }

    await prisma.payment.create({
      data: { userId, programId: application.programId, reference, amount, currency: 'NGN', provider: 'paystack', status: 'PENDING' },
    })
    return NextResponse.json({ authorization_url: data.data.authorization_url, reference })
  } catch (error) {
    console.error('Failed to initialize premium payment:', error)
    return NextResponse.json({ error: 'Unable to initialize payment.' }, { status: 500 })
  }
}
