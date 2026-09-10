import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get('reference')
  const secretKey = process.env.PAYSTACK_SECRET_KEY
  if (!reference) return NextResponse.json({ message: 'Missing payment reference.' }, { status: 400 })
  if (!secretKey) return NextResponse.json({ message: 'Paystack is not configured.' }, { status: 503 })

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secretKey}` } })
  const data = await response.json()
  if (!response.ok || data.data?.status !== 'success') return NextResponse.json({ message: 'Payment was not successful.' }, { status: 402 })
  return NextResponse.json({ status: 'success', programSlug: data.data.metadata?.programSlug })
}
