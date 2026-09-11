'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function MfaSettings() {
  const [factorId, setFactorId] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)

  async function loadFactors() {
    const { data, error: factorsError } = await createSupabaseBrowserClient().auth.mfa.listFactors()
    if (factorsError) setError(factorsError.message)
    else setFactorId(data.totp.find((factor) => factor.status === 'verified')?.id ?? null)
    setLoading(false)
  }

  useEffect(() => {
    const task = window.setTimeout(() => { void loadFactors() }, 0)
    return () => window.clearTimeout(task)
  }, [])

  async function enroll() {
    setError(null)
    setMessage(null)
    setWorking(true)
    const { data, error: enrollError } = await createSupabaseBrowserClient().auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Google Authenticator' })
    if (enrollError || !data?.totp) setError(enrollError?.message ?? 'Unable to start authenticator setup.')
    else { setFactorId(data.id); setQrCode(data.totp.qr_code); setSecret(data.totp.secret) }
    setWorking(false)
  }

  async function verify() {
    if (!factorId || code.length !== 6) return
    setError(null)
    setWorking(true)
    const supabase = createSupabaseBrowserClient()
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) setError(challengeError.message)
    else {
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.id, code })
      if (verifyError) setError(verifyError.message)
      else { setQrCode(null); setSecret(null); setCode(''); setMessage('Google Authenticator is now protecting your account.') }
    }
    setWorking(false)
  }

  async function remove() {
    if (!factorId || !window.confirm('Remove Google Authenticator from this account?')) return
    setError(null)
    setWorking(true)
    const { error: removeError } = await createSupabaseBrowserClient().auth.mfa.unenroll({ factorId })
    if (removeError) setError(removeError.message)
    else { setFactorId(null); setMessage('Google Authenticator was removed.') }
    setWorking(false)
  }

  if (loading) return <p className="mt-4 text-xs text-slate-500">Checking authenticator status...</p>

  return <div className="mt-5 border-t border-slate-100 pt-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-sm font-bold text-[#1C1D52]">Google Authenticator</h3><p className="mt-1 max-w-xl text-[10px] leading-5 text-slate-500">Use a time-based code from Google Authenticator whenever you sign in.</p></div>{factorId && !qrCode && <button type="button" onClick={() => void remove()} disabled={working} className="rounded-lg border border-red-200 px-3 py-2 text-[10px] font-bold text-red-600 disabled:opacity-60">Remove</button>}</div>{!factorId && !qrCode && <button type="button" onClick={() => void enroll()} disabled={working} className="mt-4 rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-bold text-[#14204f] disabled:opacity-60">Set up authenticator</button>}{qrCode && <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center"><img src={qrCode} alt="QR code for Google Authenticator" className="h-40 w-40 rounded-lg border border-slate-200 p-2" /><div><p className="text-xs font-semibold text-[#1C1D52]">Scan this QR code, then enter the six-digit code.</p><p className="mt-2 break-all rounded-lg bg-slate-50 p-2 font-mono text-[10px] text-slate-500">Manual key: {secret}</p><div className="mt-3 flex gap-2"><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="000000" className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm tracking-[0.2em] outline-none focus:border-blue-500" /><button type="button" onClick={() => void verify()} disabled={working || code.length !== 6} className="rounded-lg bg-[#1C1D52] px-3 py-2 text-[10px] font-bold text-white disabled:opacity-60">Verify</button></div></div></div>}{message && <p className="mt-3 text-xs font-semibold text-[#397d3a]" role="status">{message}</p>}{error && <p className="mt-3 text-xs font-semibold text-red-600" role="alert">{error}</p>}</div>
}