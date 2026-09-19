'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ClipboardList, Loader2 } from 'lucide-react'

export default function AssessmentReadinessPage() {
  const router = useRouter()
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  async function startAssessment() {
    setStarting(true)
    setError('')
    try {
      const response = await fetch('/api/internship/assessment/start', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to start your assessment.')
      router.push('/internship/assessment/take')
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : 'Unable to start your assessment.')
      setStarting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(28,29,82,0.12)]">
      <div className="bg-[#1C1D52] px-6 pb-8 pt-7 text-center text-white sm:px-8">
        <span className="inline-flex items-center rounded-full border border-[#9be28a]/40 bg-[#9be28a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">
          Entrance exam
        </span>
        <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]">
          <ClipboardList className="h-8 w-8" />
        </div>
      </div>

      <div className="px-6 pb-8 pt-6 text-center sm:px-8">
        <h1 className="text-2xl font-bold text-[#1C1D52]">Ready for your assessment?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          This is a short multiple-choice assessment designed to measure your readiness for the internship program.
          You can answer at your own pace, and your results will be scored automatically as soon as you submit.
        </p>

        {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

        <button
          type="button"
          onClick={startAssessment}
          disabled={starting}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-6 py-3.5 text-sm font-bold text-[#14204f] shadow-[0_10px_24px_rgba(95,187,70,0.22)] transition hover:translate-y-[-1px] disabled:cursor-wait disabled:opacity-70"
        >
          {starting ? <><Loader2 className="h-4 w-4 animate-spin" />Starting...</> : 'Start Assessment'}
        </button>
      </div>
    </div>
  )
}