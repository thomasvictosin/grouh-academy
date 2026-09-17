'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'

type Program = { id: string; name: string; slug: string; duration: string; description: string | null }

const EXPERIENCE_LEVELS = ['Complete beginner', 'Some self-taught experience', 'Studied it formally', 'Have work experience']
const AVAILABILITY_OPTIONS = ['Less than 10 hrs/week', '10–20 hrs/week', '20–30 hrs/week', '30+ hrs/week']

export default function InternshipOnboardingPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState<Program[]>([])
  const [programId, setProgramId] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [availability, setAvailability] = useState('')
  const [motivation, setMotivation] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/internship/onboarding')
      .then((r) => r.json())
      .then((data) => {
        setPrograms(data.programs ?? [])
        if (data.existingProgramId) setProgramId(data.existingProgramId)
        if (data.existingAnswers) {
          setExperienceLevel(data.existingAnswers.experienceLevel ?? '')
          setAvailability(data.existingAnswers.availability ?? '')
          setMotivation(data.existingAnswers.motivation ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/internship/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          answers: { experienceLevel, availability, motivation },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to save your answers.')
      router.push('/internship/assessment/readiness')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save your answers.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-[#5FBB46]" /></div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-[#1C1D52] px-6 py-8 text-white sm:px-10 sm:py-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9be28a]">Before we begin</p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Tell us a bit about you</h1>
        <p className="mt-2 text-sm text-white/70">A few quick questions before your assessment.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5 rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-8">
        <div>
          <label className="block text-xs font-bold text-[#1C1D52]">Which stack are you interested in?</label>
          <div className="mt-3 space-y-2">
            {programs.map((program) => (
              <label key={program.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${programId === program.id ? 'border-[#5FBB46] bg-[#f4faf2]' : 'border-slate-200'}`}>
                <input type="radio" name="program" value={program.id} checked={programId === program.id} onChange={() => setProgramId(program.id)} className="mt-1" required />
                <span>
                  <strong className="block text-sm text-[#1C1D52]">{program.name}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{program.duration}{program.description ? ` · ${program.description}` : ''}</span>
                </span>
              </label>
            ))}
            {programs.length === 0 && <p className="text-xs text-slate-400">No programs are currently open for applications.</p>}
          </div>
        </div>

        <label className="block text-xs font-bold text-[#1C1D52]">
          What's your experience level?
          <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm">
            <option value="" disabled>Select one</option>
            {EXPERIENCE_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>

        <label className="block text-xs font-bold text-[#1C1D52]">
          How much time can you commit weekly?
          <select value={availability} onChange={(e) => setAvailability(e.target.value)} required className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm">
            <option value="" disabled>Select one</option>
            {AVAILABILITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>

        <label className="block text-xs font-bold text-[#1C1D52]">
          Why do you want to join this internship?
          <textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} required rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
        </label>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">{error}</p>}

        <button type="submit" disabled={submitting || !programId} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5FBB46] px-4 py-3.5 text-sm font-bold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Saving…' : 'Continue'} <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  )
}