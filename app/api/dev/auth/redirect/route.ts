import { NextResponse } from 'next/server'

import {
  getDevelopmentRouteForRole,
  getValidatedDevelopmentRole,
  isDevelopmentBypassEnabled,
} from '@/lib/dev-auth'

export async function GET(request: Request) {
  if (!isDevelopmentBypassEnabled()) {
    return NextResponse.json({ error: 'Development auth bypass is unavailable.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const role = getValidatedDevelopmentRole(searchParams.get('role'))

  if (!role) {
    return NextResponse.json({ error: 'Invalid development role.' }, { status: 400 })
  }

  const redirectTo = getDevelopmentRouteForRole(role)

  return NextResponse.redirect(new URL(redirectTo, request.url))
}
