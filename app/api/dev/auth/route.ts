import { NextResponse } from 'next/server'

import {
  DEV_AUTH_COOKIE_NAME,
  getValidatedDevelopmentRole,
  isDevelopmentBypassEnabled,
} from '@/lib/dev-auth'

export async function POST(request: Request) {
  if (!isDevelopmentBypassEnabled()) {
    return NextResponse.json({ error: 'Development auth bypass is unavailable.' }, { status: 403 })
  }

  const formData = await request.formData()
  const action = formData.get('action')

  if (action === 'clear') {
    const response = NextResponse.redirect(new URL('/dev/auth', request.url), 303)
    response.cookies.set(DEV_AUTH_COOKIE_NAME, '', { maxAge: 0, httpOnly: true, sameSite: 'lax', path: '/' })
    return response
  }

  const role = getValidatedDevelopmentRole(formData.get('role'))

  if (!role) {
    return NextResponse.json({ error: 'Invalid development role.' }, { status: 400 })
  }

  const response = NextResponse.redirect(new URL(`/api/dev/auth/redirect?role=${encodeURIComponent(role)}`, request.url), 303)

  response.cookies.set(DEV_AUTH_COOKIE_NAME, role, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  })

  return response
}
