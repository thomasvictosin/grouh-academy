'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

function MfaChallengeForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [factorId, setFactorId] = useState<string | null>(null)
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const next = searchParams.get('next')?.startsWith('/') ? searchParams.get('next')! : '/student'

  useEffect(() => {
    async function startChallenge() {
      const supabase = createSupabaseBrowserClient()
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors()
      const factor = factors?.totp.find((item) => item.status === 'verified')
      if (factorsError || !factor) { router.replace('/login'); return }
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id })
      if (challengeError) setError(challengeError.message)
      else { setFactorId(factor.id); setChallengeId(challenge.id) }
      setLoading(false)
    }
    void startChallenge()
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!factorId || !challengeId) return
    setVerifying(true)
    setError(null)
    const { error: verifyError } = await createSupabaseBrowserClient().auth.mfa.verify({ factorId, challengeId, code })
    if (verifyError) { setError(verifyError.message); setVerifying(false); return }
    router.replace(next)
    router.refresh()
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6"><form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"><img src="/logo.png" alt="Grouh Academy logo" className="mb-6 h-10 w-auto" /><h1 className="text-3xl font-bold text-[#1c1d52]">Verify your sign-in</h1><p className="mt-3 text-sm leading-6 text-slate-500">Enter the six-digit code from Google Authenticator to continue.</p><label className="mt-6 block text-sm font-semibold text-slate-700">Authenticator code<input required minLength={6} maxLength={6} inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-[#5fbb46]" /></label>{error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button disabled={loading || verifying || code.length !== 6} className="mt-6 w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Preparing...' : verifying ? 'Verifying...' : 'Verify code'}</button></form></main>
}

export default function MfaChallengePage() {
  return <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500">Preparing verification...</main>}><MfaChallengeForm /></Suspense>
}