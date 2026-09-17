import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getInternshipAccessStatus } from '@/lib/internship-access'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  try {
    const status = await getInternshipAccessStatus(userId)
    return NextResponse.json(status)
  } catch (error) {
    console.error('Failed to load internship access status:', error)
    return NextResponse.json({ error: 'Unable to load access status.' }, { status: 500 })
  }
}