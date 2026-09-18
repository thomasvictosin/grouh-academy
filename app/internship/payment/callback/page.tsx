'use client'

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your payment securely...')
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')
    const type = params.get('type') === 'premium' ? 'premium' : 'acceptance'
    setIsPremium(type === 'premium')

    if (!reference) {
      setStatus('error')
      setMessage('The payment reference is missing. You can safely retry payment from your dashboard.')
      return
    }

    const verifyUrl = type === 'premium'
      ? `/api/internship/premium/verify?reference=${encodeURIComponent(reference)}`
      : `/api/internship/payment/verify?reference=${encodeURIComponent(reference)}`

    fetch(verifyUrl)
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        setStatus('success')
      })
      .catch((error) => {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.')
      })
  }, [])

  return (
    <div className="mx-auto max-w-[620px] rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
      {status === 'loading' && <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#5FBB46]" />}
      {status === 'success' && <CheckCircle2 className="mx-auto h-12 w-12 text-[#5FBB46]" />}
      {status === 'error' && <AlertCircle className="mx-auto h-10 w-10 text-red-500" />}
      <h1 className="mt-5 text-2xl font-bold text-[#1C1D52]">{status === 'success' ? 'Payment confirmed' : status === 'loading' ? 'Confirming payment' : 'Payment confirmation failed'}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {status === 'success'
          ? isPremium
            ? 'Your premium upgrade is active. A mentor is being assigned to you now.'
            : 'Your acceptance fee has been verified. You now have full access to your internship dashboard.'
          : message}
      </p>
      {status === 'success' ? (
        <Link href={isPremium ? '/internship/premium' : '/internship/dashboard'} className="mt-6 inline-flex rounded-lg bg-[#5FBB46] px-5 py-3 text-xs font-bold text-[#14204f]">
          {isPremium ? 'View premium status' : 'Go to dashboard'}
        </Link>
      ) : status === 'error' ? (
        <Link href="/internship/dashboard" className="mt-6 inline-flex rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f]">Back to dashboard</Link>
      ) : null}
    </div>
  )
}
