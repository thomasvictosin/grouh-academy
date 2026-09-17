'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'

type Option = { id: string; optionText: string }
type Question = { id: string; prompt: string; options: Option[] }

export default function AssessmentTakePage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/internship/assessment/questions')
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load assessment.')
        setQuestions(data.questions)
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load assessment.'))
      .finally(() => setLoading(false))
  }, [])

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const isLastQuestion = currentIndex === questions.length - 1

  function selectOption(optionId: string) {
    if (!currentQuestion) return
    setAnswers((current) => ({ ...current, [currentQuestion.id]: optionId }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/internship/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to submit your assessment.')
      router.push('/internship/results')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your assessment.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#5FBB46]" /></div>
  }

  if (error && questions.length === 0) {
    return <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div>
  }

  if (!currentQuestion) {
    return <div className="mx-auto max-w-xl rounded-2xl bg-white px-6 py-12 text-center text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">This assessment has no questions yet.</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-[#1C1D52]">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>{answeredCount} answered</span>
      </div>
      <div className="mb-6 h-2 rounded-full bg-[#E7EEF8]"><div className="h-full rounded-full bg-[#5FBB46] transition-all" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} /></div>

      <div className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-8">
        <h2 className="text-lg font-bold text-[#1C1D52]">{currentQuestion.prompt}</h2>
        <div className="mt-5 space-y-2">
          {currentQuestion.options.map((option) => (
            <label key={option.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition ${answers[currentQuestion.id] === option.id ? 'border-[#5FBB46] bg-[#f4faf2]' : 'border-slate-200'}`}>
              <input type="radio" name={currentQuestion.id} checked={answers[currentQuestion.id] === option.id} onChange={() => selectOption(option.id)} />
              {option.optionText}
            </label>
          ))}
        </div>

        {error && <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"><AlertCircle className="h-4 w-4 shrink-0" /><span>{error}</span></div>}

        <div className="mt-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-[#1C1D52] shadow-[inset_0_0_0_2px_#1C1D52] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || answeredCount < questions.length}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-5 py-2.5 text-xs font-bold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : 'Submit Assessment'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-5 py-2.5 text-xs font-bold text-[#14204f]"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}