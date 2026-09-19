'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2, Loader2, RotateCcw, XCircle } from 'lucide-react'

type Result = { programName: string; scorePercent: number; score: number; totalQuestions: number; passed: boolean }

export default function AssessmentResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)

  useEffect(() => {
    fetch('/api/internship/assessment/result')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'No result found.')
        setResult(data)
        setShowPassModal(Boolean(data.passed))
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'No result found.'))
      .finally(() => setLoading(false))
  }, [])

  async function retryAssessment() {
    setRetrying(true)
    try {
      const response = await fetch('/api/internship/assessment/start', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to start a new attempt.')
      router.push('/internship/assessment/take')
    } catch {
      setRetrying(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#5FBB46]" /></div>
  }

  if (error || !result) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error || 'No result found.'}</div>
  }

  return (
    <>
    <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-12">
      {result.passed ? (
        <CheckCircle2 className="mx-auto h-14 w-14 text-[#5FBB46]" />
      ) : (
        <XCircle className="mx-auto h-14 w-14 text-red-400" />
      )}
      <h1 className="mt-5 text-2xl font-bold text-[#1C1D52]">
        {result.passed ? 'Hooray, you qualified!' : 'Not quite there yet'}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        You scored <strong className="text-[#1C1D52]">{result.scorePercent}%</strong> ({result.score}/{result.totalQuestions}) on the {result.programName} assessment.
        {result.passed ? ' You are qualified for this internship program.' : ' You can try again whenever you\'re ready.'}
      </p>

      {result.passed ? (
        <button
          type="button"
          onClick={() => setShowPassModal(true)}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-6 py-3.5 text-sm font-bold text-[#14204f]"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={retryAssessment}
          disabled={retrying}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1D52] px-6 py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {retrying ? <><Loader2 className="h-4 w-4 animate-spin" />Starting...</> : <><RotateCcw className="h-4 w-4" />Retry Assessment</>}
        </button>
      )}
    </div>

    {result.passed && showPassModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#11132f]/75 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white text-center shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="bg-[#1C1D52] px-6 pb-8 pt-7 text-white">
            <span className="inline-flex items-center rounded-full border border-[#9be28a]/40 bg-[#9be28a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">
              Qualified
            </span>
            <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
          </div>
          <div className="px-7 pb-7 pt-6">
            <h2 className="text-2xl font-bold text-[#1C1D52]">Well done! You did well.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Are you ready to get started with your internship?</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push('/internship/dashboard')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-6 py-3 text-sm font-bold text-[#14204f] shadow-[0_10px_24px_rgba(95,187,70,0.22)] transition hover:translate-y-[-1px]"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPassModal(false)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-[#1C1D52] transition hover:bg-slate-50"
              >
                Review results
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}