import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = request.nextUrl.searchParams.get('next')
  const redirectUrl = new URL(next?.startsWith('/') ? next : '/student', request.url)

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (assurance?.currentLevel === 'aal1' && assurance.nextLevel === 'aal2') {
        return NextResponse.redirect(new URL(`/auth/mfa?next=${encodeURIComponent(next ?? '/student')}`, request.url))
      }
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url))
}