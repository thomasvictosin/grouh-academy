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
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-12">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]"><ClipboardList className="h-6 w-6" /></span>
      <h1 className="mt-5 text-2xl font-bold text-[#1C1D52]">Ready for your assessment?</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        This is a short set of multiple-choice questions. Once you start, answer at your own pace and submit when you're done.
        Your results will be graded automatically.
      </p>
      {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}
      <button
        type="button"
        onClick={startAssessment}
        disabled={starting}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-6 py-3.5 text-sm font-bold text-[#14204f] disabled:cursor-wait disabled:opacity-70"
      >
        {starting ? <><Loader2 className="h-4 w-4 animate-spin" />Starting...</> : 'Start Assessment'}
      </button>
    </div>
  )
}