'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Check, CheckCircle2, Clock3, CreditCard, Crown, GraduationCap, Loader2, LockKeyhole, X } from 'lucide-react'

type AccessStatus = { premiumTier: 'NONE' | 'TIER_100K' | 'TIER_400K'; programName: string | null }

const PLANS: { tier: 'TIER_100K' | 'TIER_400K'; name: string; price: string; priceValue: string; duration: string; features: string[] }[] = [
  {
    tier: 'TIER_100K',
    name: 'Tier 1',
    price: '₦100,000',
    priceValue: '₦100,000',
    duration: 'Mentor Access',
    features: ['1-on-1 mentor assigned to you', 'Direct mentor messaging', 'Priority feedback on tasks'],
  },
  {
    tier: 'TIER_400K',
    name: 'Tier 2',
    price: '₦400,000',
    priceValue: '₦400,000',
    duration: 'Mentor + Career Track',
    features: ['Everything in Tier 1', 'Dedicated senior mentor', 'Career placement support', 'Extended program access'],
  },
]

export default function InternshipPremiumPage() {
  const router = useRouter()
  const [status, setStatus] = useState<AccessStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTier, setActiveTier] = useState<'TIER_100K' | 'TIER_400K' | ''>('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [paymentError, setPaymentError] = useState('')

  const activePlan = PLANS.find((plan) => plan.tier === activeTier)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    fetch('/api/internship/access-status')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStatus)
      .finally(() => setLoading(false))
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (activePlan) document.body.style.overflow = 'hidden'
  }, [activePlan])

  function selectPlan(tier: 'TIER_100K' | 'TIER_400K') {
    setActiveTier(tier)
    setPaymentStatus('idle')
    setPaymentError('')
  }

  function closePayment() {
    if (paymentStatus !== 'loading') setActiveTier('')
  }

  async function payNow() {
    if (!activePlan) return
    setPaymentStatus('loading')
    setPaymentError('')
    try {
      const response = await fetch('/api/internship/premium/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: activePlan.tier }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.authorization_url) throw new Error(data?.error || `Payment could not be initialized (request returned ${response.status}).`)
      window.location.href = data.authorization_url
    } catch (error) {
      setPaymentStatus('error')
      setPaymentError(error instanceof Error ? error.message : 'Payment could not be initialized. Please try again.')
    }
  }

  const alreadyPremium = status && status.premiumTier !== 'NONE'
  const activatedPlan = alreadyPremium ? PLANS.find((p) => p.tier === status!.premiumTier) : null

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#11132f] px-4 py-6 sm:px-6 sm:py-10">
      <button
        type="button"
        onClick={() => router.push('/internship/dashboard')}
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mx-auto max-w-[1180px]">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#5FBB46]" /></div>
        ) : alreadyPremium && activatedPlan ? (
          <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
            <Crown className="mx-auto h-12 w-12 text-[#5FBB46]" />
            <h1 className="mt-4 text-xl font-bold text-[#1C1D52]">You're on {activatedPlan.name}</h1>
            <p className="mt-2 text-sm text-slate-500">A mentor has been assigned to you — check your dashboard or the mentor chat to get started.</p>
          </div>
        ) : (
          <>
            <h1 className="mt-2 text-center text-2xl font-bold text-white sm:text-3xl">Premium Plans</h1>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:max-w-3xl sm:mx-auto">
              {PLANS.map((plan, index) => (
                <article key={plan.tier} className={`relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6 ${index === 1 ? 'ring-2 ring-[#5FBB46]' : ''}`}>
                  {index === 1 && <span className="absolute -top-3 left-5 rounded-full bg-[#5FBB46] px-3 py-1 text-[10px] font-bold text-[#14204f]">Most popular</span>}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">{plan.duration}</p>
                      <h2 className="mt-2 text-xl font-bold text-[#1C1D52]">{plan.name}</h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><GraduationCap className="h-5 w-5" /></span>
                  </div>
                  <p className="mt-5 text-3xl font-bold text-[#1C1D52]">{plan.price}<span className="ml-1 text-[10px] font-medium text-slate-400">total</span></p>
                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                    {plan.features.map((feature) => <p key={feature} className="flex gap-2 text-xs text-slate-600"><Check className="h-4 w-4 shrink-0 text-[#5FBB46]" />{feature}</p>)}
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-500"><Clock3 className="h-3.5 w-3.5" />Added on top of your current program</div>
                  <button
                    type="button"
                    onClick={() => selectPlan(plan.tier)}
                    className={`mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold ${activeTier === plan.tier ? 'bg-[#e8f7eb] text-[#397d3a]' : 'bg-[#5FBB46] text-[#14204f]'}`}
                  >
                    {activeTier === plan.tier ? 'Plan selected' : `Choose ${plan.name}`}
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {activePlan && (
        <div className="fixed inset-0 z-[210] overflow-y-auto bg-[#11132f]/85 px-4 py-5 backdrop-blur-sm sm:px-6 sm:py-8" role="dialog" aria-modal="true" aria-labelledby="premium-payment-modal-title">
          <div className="mx-auto flex min-h-full max-w-4xl items-center justify-center">
            <section className="relative w-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <button type="button" onClick={closePayment} disabled={paymentStatus === 'loading'} className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Close payment"><X className="h-5 w-5" /></button>
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="bg-[#1C1D52] px-6 py-8 text-white sm:px-10 sm:py-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">Confirm your upgrade</p>
                  <h2 id="premium-payment-modal-title" className="mt-3 max-w-md text-3xl font-bold tracking-tight">You&apos;re one step away from a mentor.</h2>
                  <p className="mt-4 max-w-md text-sm leading-6 text-white/70">Review your plan below. You will be securely redirected to Paystack to complete payment.</p>
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be28a]">Selected plan</p>
                        <h3 className="mt-2 text-xl font-bold">{activePlan.name}</h3>
                        <p className="mt-1 text-xs text-white/60">{activePlan.duration}</p>
                      </div>
                      <GraduationCap className="h-6 w-6 text-[#9be28a]" />
                    </div>
                    <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                      {activePlan.features.map((feature) => <p key={feature} className="flex gap-2 text-xs text-white/75"><Check className="h-4 w-4 shrink-0 text-[#9be28a]" />{feature}</p>)}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-8 sm:px-10 sm:py-10">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f7eb] text-[#5FBB46]"><CreditCard className="h-5 w-5" /></span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Secure payment</p>
                      <h3 className="mt-1 text-lg font-bold text-[#1C1D52]">Payment summary</h3>
                    </div>
                  </div>
                  <div className="mt-7 space-y-4 rounded-2xl bg-[#f8fbff] p-5 text-xs">
                    <p className="flex justify-between gap-4 text-slate-500"><span>Plan</span><strong className="text-[#1C1D52]">{activePlan.name}</strong></p>
                    <div className="border-t border-slate-200 pt-4">
                      <p className="flex items-end justify-between gap-4"><span className="font-semibold text-[#1C1D52]">Total</span><strong className="text-2xl text-[#1C1D52]">{activePlan.priceValue}</strong></p>
                    </div>
                  </div>
                  {paymentStatus === 'error' && <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{paymentError}</span></div>}
                  <button type="button" onClick={payNow} disabled={paymentStatus === 'loading'} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-4 py-3.5 text-xs font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70">
                    {paymentStatus === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" />Connecting to Paystack...</> : <><LockKeyhole className="h-4 w-4" />Pay {activePlan.priceValue}</>}
                  </button>
                  <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500"><CheckCircle2 className="h-3.5 w-3.5 text-[#5FBB46]" />Payment is verified securely before your mentor is assigned.</p>
                  <button type="button" onClick={closePayment} disabled={paymentStatus === 'loading'} className="mt-5 w-full text-center text-xs font-semibold text-slate-500 hover:text-[#1C1D52] disabled:opacity-50">Cancel and return to plans</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
