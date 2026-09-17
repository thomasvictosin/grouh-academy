'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Check, Crown, Loader2 } from 'lucide-react'

type AccessStatus = { premiumTier: 'NONE' | 'TIER_100K' | 'TIER_400K'; programName: string | null }

const PLANS: { tier: 'TIER_100K' | 'TIER_400K'; name: string; price: string; features: string[] }[] = [
  {
    tier: 'TIER_100K',
    name: 'Mentor Access',
    price: '₦100,000',
    features: ['1-on-1 mentor assigned to you', 'Direct mentor messaging', 'Priority feedback on tasks'],
  },
  {
    tier: 'TIER_400K',
    name: 'Mentor + Career Track',
    price: '₦400,000',
    features: ['Everything in Mentor Access', 'Dedicated senior mentor', 'Career placement support', 'Extended program access'],
  },
]

export default function InternshipPremiumPage() {
  const [status, setStatus] = useState<AccessStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [payingTier, setPayingTier] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/internship/access-status')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStatus)
      .finally(() => setLoading(false))
  }, [])

  async function choosePlan(tier: 'TIER_100K' | 'TIER_400K') {
    setPayingTier(tier)
    setError('')
    try {
      const response = await fetch('/api/internship/premium/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = await response.json()
      if (!response.ok || !data.authorization_url) throw new Error(data.error || 'Payment could not be initialized.')
      window.location.href = data.authorization_url
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : 'Payment could not be initialized.')
      setPayingTier(null)
    }
  }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#5FBB46]" /></div>
  }

  if (status && status.premiumTier !== 'NONE') {
    const activePlan = PLANS.find((p) => p.tier === status.premiumTier)
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
        <Crown className="mx-auto h-12 w-12 text-[#5FBB46]" />
        <h1 className="mt-4 text-xl font-bold text-[#1C1D52]">You're on {activePlan?.name ?? 'a premium plan'}</h1>
        <p className="mt-2 text-sm text-slate-500">A mentor has been assigned to you — check your dashboard or the mentor chat to get started.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl bg-[#1C1D52] px-6 py-8 text-white sm:px-10 sm:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">Level up</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Get a dedicated mentor</h1>
        <p className="mt-2 max-w-xl text-sm text-white/70">Upgrade to unlock 1-on-1 mentorship on top of your current internship program.</p>
      </div>

      {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <article key={plan.tier} className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
            <h2 className="text-lg font-bold text-[#1C1D52]">{plan.name}</h2>
            <p className="mt-2 text-3xl font-bold text-[#1C1D52]">{plan.price}</p>
            <div className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5">
              {plan.features.map((feature) => (
                <p key={feature} className="flex gap-2 text-xs text-slate-600"><Check className="h-4 w-4 shrink-0 text-[#5FBB46]" />{feature}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={() => choosePlan(plan.tier)}
              disabled={payingTier !== null}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70"
            >
              {payingTier === plan.tier ? <><Loader2 className="h-4 w-4 animate-spin" />Connecting...</> : `Choose ${plan.name}`}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}