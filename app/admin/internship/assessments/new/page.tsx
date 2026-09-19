'use client'

import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type QuestionDraft = {
  prompt: string
  options: string[]
  correctIndex: number
}

type ProgramOption = { id: string; name: string }

type QuestionPayload = {
  id: string
  assessmentId: string
  assessmentTitle: string
  track: string
  prompt: string
  instructions: string
  options: Array<{ id: string; optionText: string }>
  correctOptionIndex: number
}

const emptyQuestion = (): QuestionDraft => ({
  prompt: '',
  options: ['', '', '', ''],
  correctIndex: 0,
})

export default function NewAssessmentPage() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [assessmentTitle, setAssessmentTitle] = useState('Entrance Exam')
  const [instructions, setInstructions] = useState('Select the correct answer for each multiple-choice question. There are no open-ended questions in this entrance exam.')
  const [programId, setProgramId] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    fetch('/api/admin/internship/assessments', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Assessment setup request failed (${response.status}).`)
        const payload = (await response.json()) as { programs?: ProgramOption[]; questions?: QuestionPayload[] }
        if (!isMounted) return

        const nextPrograms = payload.programs ?? []
        setPrograms(nextPrograms)

        if (nextPrograms[0]) {
          setProgramId((current) => current || nextPrograms[0].id)
        }

        if (editId) {
          const targetQuestion = payload.questions?.find((question) => question.id === editId)
          if (targetQuestion) {
            setAssessmentTitle(targetQuestion.assessmentTitle)
            setInstructions(targetQuestion.instructions)
            const matchedProgram = nextPrograms.find((program) => program.name === targetQuestion.track)
            setProgramId(matchedProgram?.id ?? nextPrograms[0]?.id ?? '')
            setQuestions([
              {
                prompt: targetQuestion.prompt,
                options: targetQuestion.options.map((option) => option.optionText),
                correctIndex: targetQuestion.correctOptionIndex >= 0 ? targetQuestion.correctOptionIndex : 0,
              },
            ])
          }
        }
      })
      .catch((reason) => {
        if (isMounted) setError(reason instanceof Error ? reason.message : 'Assessment setup is unavailable.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [editId])

  const optionLetters = useMemo(() => ['A', 'B', 'C', 'D'], [])

  function updateQuestion(index: number, field: 'prompt' | 'correctIndex' | 'options', value: string | number | string[]) {
    setQuestions((current) => current.map((question, currentIndex) => {
      if (currentIndex !== index) return question
      if (field === 'options') return { ...question, options: value as string[] }
      if (field === 'correctIndex') return { ...question, correctIndex: Number(value) }
      return { ...question, prompt: String(value) }
    }))
  }

  function addQuestion() {
    setQuestions((current) => [...current, emptyQuestion()])
  }

  function removeQuestion(index: number) {
    setQuestions((current) => current.length === 1 ? [emptyQuestion()] : current.filter((_, currentIndex) => currentIndex !== index))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!programId) {
      setError('Please choose the track for this entrance exam.')
      return
    }

    const validQuestions = questions.filter((question) => question.prompt.trim() && question.options.every((option) => option.trim()))
    if (!validQuestions.length) {
      setError('Add at least one multiple-choice question before saving the assessment.')
      return
    }

    setSaving(true)

    try {
      const response = await fetch('/api/admin/internship/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: assessmentTitle.trim() || 'Entrance Exam',
          instructions,
          passingScore,
          programId,
          questionId: editId,
          questions: validQuestions.map((question) => ({
            prompt: question.prompt.trim(),
            options: question.options.map((option) => option.trim()),
            correctIndex: question.correctIndex,
          })),
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Unable to save the assessment.')
      setSuccess(editId ? 'Question updated successfully.' : 'Assessment saved successfully.')
      if (!editId) {
        setAssessmentTitle('Entrance Exam')
        setInstructions('Select the correct answer for each multiple-choice question. There are no open-ended questions in this entrance exam.')
        setQuestions([emptyQuestion()])
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save the assessment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/assessments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to entrance exam
      </Link>

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Assessment Builder</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{editId ? 'Edit entrance exam question' : 'Create assessment'}</h1>
            </div>
            <button type="submit" disabled={saving || loading} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-60">
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving…' : editId ? 'Update question' : 'Save assessment'}
            </button>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
          {success && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</p>}

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block text-[10px] font-semibold text-slate-500">
              Assessment title
              <input value={assessmentTitle} onChange={(event) => setAssessmentTitle(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
            </label>

            <label className="block text-[10px] font-semibold text-slate-500">
              Track
              <select value={programId} onChange={(event) => setProgramId(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
                <option value="" disabled>Select a track</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>{program.name}</option>
                ))}
              </select>
            </label>

            <label className="block text-[10px] font-semibold text-slate-500 md:col-span-2">
              Instructions
              <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={4} className="mt-2 block min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
            </label>

            <label className="block text-[10px] font-semibold text-slate-500">
              Passing score (%)
              <input type="number" min={1} max={100} value={passingScore} onChange={(event) => setPassingScore(Math.max(1, Math.min(100, Number(event.target.value) || 70)))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
          <div className="flex items-center justify-between pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Question bank</p>
              <h2 className="mt-1 text-xl font-semibold text-[#1C1D52]">Multiple-choice questions</h2>
            </div>
            <button type="button" onClick={addQuestion} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-[#1C1D52] hover:bg-slate-50">
              <Plus className="h-3.5 w-3.5" />
              Add question
            </button>
          </div>

          <div className="space-y-5">
            {questions.map((question, questionIndex) => (
              <div key={`${questionIndex}-${question.prompt || 'new-question'}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-[#1C1D52]">Question {questionIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(questionIndex)} className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100">
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>

                <label className="block text-[10px] font-semibold text-slate-500">
                  Question
                  <textarea value={question.prompt} onChange={(event) => updateQuestion(questionIndex, 'prompt', event.target.value)} rows={3} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="Which of the following is a marketing channel?" />
                </label>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={`${questionIndex}-${optionIndex}`} className="block text-[10px] font-semibold text-slate-500">
                      Option {optionLetters[optionIndex]}
                      <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                        <input
                          type="radio"
                          name={`correct-option-${questionIndex}`}
                          checked={question.correctIndex === optionIndex}
                          onChange={() => updateQuestion(questionIndex, 'correctIndex', optionIndex)}
                          className="h-4 w-4 text-[#5FBB46]"
                        />
                        <input
                          value={option}
                          onChange={(event) => {
                            const updatedOptions = [...question.options]
                            updatedOptions[optionIndex] = event.target.value
                            updateQuestion(questionIndex, 'options', updatedOptions)
                          }}
                          className="w-full bg-transparent text-sm text-[#1C1D52] outline-none placeholder:text-slate-400"
                          placeholder={`Option ${optionLetters[optionIndex]}`}
                        />
                      </div>
                    </label>
                  ))}
                </div>

                <p className="mt-3 text-[9px] font-semibold text-slate-500">
                  Correct answer: <span className="text-[#1C1D52]">{optionLetters[question.correctIndex]}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      </form>
    </div>
  )
}
