'use client'

import { ChevronDown, PencilLine, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type QuestionRow = {
  id: string
  assessmentId: string
  assessmentTitle: string
  track: string
  prompt: string
  instructions: string
  options: Array<{ id: string; optionText: string }>
  correctOptionIndex: number
}

export default function InternshipAssessmentsPage() {
  const [questions, setQuestions] = useState<QuestionRow[]>([])
  const [track, setTrack] = useState('All')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/assessments', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Assessment data request failed (${response.status}).`)
        const payload = (await response.json()) as { questions?: QuestionRow[]; programs?: Array<{ id: string; name: string }> }
        setQuestions(payload.questions ?? [])
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Assessment data is unavailable.'))
      .finally(() => setLoading(false))
  }, [])

  const trackOptions = useMemo(() => ['All', ...new Set(questions.map((question) => question.track))], [questions])

  const visibleQuestions = useMemo(() => {
    const term = query.trim().toLowerCase()
    return questions.filter((question) => {
      const matchesTrack = track === 'All' || question.track === track
      const searchable = `${question.assessmentTitle} ${question.track} ${question.prompt}`.toLowerCase()
      return matchesTrack && (!term || searchable.includes(term))
    })
  }, [questions, query, track])

  async function handleDelete(questionId: string) {
    try {
      const response = await fetch('/api/admin/internship/assessments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Unable to delete this question.')
      }
      setQuestions((current) => current.filter((question) => question.id !== questionId))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete this question.')
    }
  }

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Entrance exam</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Existing exam questions</h1>
            <p className="mt-2 text-xs text-slate-500">Manage the objectivity-based questions used in the internship entrance exam.</p>
          </div>

          <Link href="/admin/internship/assessments/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Create Assessment
          </Link>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[320px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search question or track" />
            </label>

            <FilterSelect label="Track" value={track} onChange={setTrack} options={trackOptions} />
          </div>

          {loading ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Loading exam question bank…</p>
          ) : visibleQuestions.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">No exam questions found for this track yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left text-[10px]">
                <thead>
                  <tr className="bg-[#f5f8fb] text-slate-600">
                    <th className="px-3 py-3 font-semibold">Question</th>
                    <th className="px-3 py-3 font-semibold">Track</th>
                    <th className="px-3 py-3 font-semibold">Options</th>
                    <th className="px-3 py-3 font-semibold">Correct answer</th>
                    <th className="px-3 py-3 font-semibold">Assessment</th>
                    <th className="px-3 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-slate-100 align-top text-[#1C1D52]">
                      <td className="px-3 py-3.5">
                        <p className="font-semibold text-[#1C1D52]">{question.prompt}</p>
                        {question.instructions ? <p className="mt-1 text-[9px] text-slate-500">{question.instructions}</p> : null}
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{question.track}</td>
                      <td className="px-3 py-3.5 text-slate-600">
                        <ul className="space-y-1">
                          {question.options.map((option, index) => (
                            <li key={option.id} className={index === question.correctOptionIndex ? 'font-semibold text-[#1C1D52]' : ''}>
                              {String.fromCharCode(65 + index)}. {option.optionText}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="rounded-full bg-[#e8faf7] px-2 py-1 font-semibold text-teal-700">
                          {String.fromCharCode(65 + question.correctOptionIndex)}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{question.assessmentTitle}</td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/internship/assessments/new?edit=${encodeURIComponent(question.id)}`} className="inline-flex items-center gap-1 rounded bg-[#f3f6fb] px-2 py-1 font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">
                            <PencilLine className="h-3 w-3" />
                            Edit
                          </Link>
                          <button type="button" onClick={() => handleDelete(question.id)} className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 font-semibold text-red-600 hover:bg-red-100">
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex w-fit items-center">
      <span className="sr-only">Filter by {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />
    </label>
  )
}
