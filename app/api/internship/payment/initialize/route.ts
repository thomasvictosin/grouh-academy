import { NextResponse } from 'next/server'
import { internshipPrograms } from '@/lib/internship'

export async function POST(request: Request) {
  const { programSlug, email } = await request.json()
  const program = internshipPrograms.find((item) => item.slug === programSlug)
  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!program) return NextResponse.json({ message: 'Internship program not found.' }, { status: 404 })
  if (!secretKey) return NextResponse.json({ message: 'Paystack is not configured. Add PAYSTACK_SECRET_KEY to the server environment.' }, { status: 503 })

  const reference = `internship_${program.slug}_${Date.now()}`
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secretKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, amount: program.price * 100, reference, metadata: { programSlug: program.slug, purpose: 'internship_enrollment' }, callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/internship/payment/callback` }),
  })
  const data = await response.json()
  if (!response.ok || !data.status) return NextResponse.json({ message: data.message || 'Paystack rejected the payment request.' }, { status: 502 })
  return NextResponse.json({ authorization_url: data.data.authorization_url, reference })
}
