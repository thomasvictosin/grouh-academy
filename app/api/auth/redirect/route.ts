import { NextResponse } from 'next/server'

import {
  ensurePrismaUserForSupabaseAuth,
  getAuthorizedHomeRouteForUserId,
} from '@/lib/supabase/auth'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase.auth.getUser()

    if (error || !data.user) {
      return NextResponse.json({ redirectTo: '/login' }, { status: 401 })
    }

    const userId = await ensurePrismaUserForSupabaseAuth(data.user)
    const redirectTo = await getAuthorizedHomeRouteForUserId(userId)

    return NextResponse.json({ redirectTo })
  } catch (error) {
    console.error('Failed to resolve redirect destination for authenticated session:', error)

    return NextResponse.json({ redirectTo: '/login' }, { status: 500 })
  }
}
