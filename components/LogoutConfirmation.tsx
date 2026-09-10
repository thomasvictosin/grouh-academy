'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type LogoutConfirmationProps = {
  title?: string
  description?: string
  cancelHref?: string
  logoutHref?: string
}

export default function LogoutConfirmation({
  title = 'Are you sure you want to log out?',
  description = 'You will need to sign in again to access your courses and learning materials.',
  cancelHref = '/student',
  logoutHref = '/login',
}: LogoutConfirmationProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout failed:', error.message)
    }

    router.push(logoutHref)
    router.refresh()
  }

  return (
    <main className="flex min-h-[calc(100dvh-88px)] items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white px-6 py-7 text-center shadow-[0_12px_30px_rgba(28,29,82,0.12)] sm:px-8 sm:py-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <LogOut className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 text-lg font-bold text-[#1C1D52]">{title}</h1>
        <p className="mx-auto mt-3 max-w-xs text-xs leading-5 text-slate-500">{description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => router.push(cancelHref)} className="rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#1C1D52] transition hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={handleLogout} className="rounded-lg bg-[#c90000] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#a90000]">Log Out</button>
        </div>
      </section>
    </main>
  )
}
