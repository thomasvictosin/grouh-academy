'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (password.length < 8 || password !== confirmation) {
      setError(password.length < 8 ? 'Use at least 8 characters.' : 'Passwords do not match.')
      return
    }
    setSaving(true)
    const { createSupabaseBrowserClient } = await import('@/lib/supabase/client')
    const { error: updateError } = await createSupabaseBrowserClient().auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }
    router.replace('/reset-password-success')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <img src="/logo.png" alt="Grouh Academy logo" className="mb-6 h-10 w-auto" />
        <h1 className="text-3xl font-bold text-[#1c1d52]">Set a new password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Choose a new password for your Grouh Academy account.</p>
        <label className="mt-6 block text-sm font-semibold text-slate-700">New password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fbb46]" /></label>
        <label className="mt-4 block text-sm font-semibold text-slate-700">Confirm password<input required minLength={8} type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fbb46]" /></label>
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={saving} className="mt-6 w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Updating...' : 'Update password'}</button>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-[#4d9d39]">Back to login</Link>
      </form>
    </main>
  )
}