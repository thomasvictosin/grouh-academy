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

  useEffect(() => {
    fetch('/api/internship/assessment/result')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'No result found.')
        setResult(data)
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
          onClick={() => router.push('/internship/dashboard')}
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
  )
}