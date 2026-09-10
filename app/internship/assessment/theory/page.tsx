'use client'

import { ArrowLeft, CheckCircle2, FileUp } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { defaultInternshipState, internshipStorageKey, theoryQuestions } from '@/lib/internship'

export default function TheoryAssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [files, setFiles] = useState<Record<string, string>>({})
  useEffect(() => { const saved = window.localStorage.getItem(internshipStorageKey); if (saved) { const state = { ...defaultInternshipState, ...JSON.parse(saved) }; setAnswers(state.theoryAnswers); setFiles(state.theoryFiles) } }, [])
  useEffect(() => {
    const saved = window.localStorage.getItem(internshipStorageKey)
    const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState
    if (state.paymentStatus !== 'PAID' || state.assessmentStatus === 'LOCKED' || state.assessmentStatus === 'NOT_STARTED') window.location.href = '/internship/assessment/readiness'
    if (state.assessmentStatus === 'UNDER_REVIEW') window.location.href = '/internship/assessment/submitted'
  }, [])
  const update = (id: number, value: string) => { const next = { ...answers, [id]: value }; setAnswers(next); persist(next, files) }
  const updateFile = (id: number, value: string) => { const next = { ...files, [id]: value }; setFiles(next); persist(answers, next) }
  const persist = (theoryAnswers: Record<string, string>, theoryFiles: Record<string, string>) => { const saved = window.localStorage.getItem(internshipStorageKey); const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState; window.localStorage.setItem(internshipStorageKey, JSON.stringify({ ...state, theoryAnswers, theoryFiles, assessmentStatus: 'IN_PROGRESS' })) }
  const submit = () => { if (theoryQuestions.some((question) => !answers[question.id]?.trim())) return; const saved = window.localStorage.getItem(internshipStorageKey); const state = saved ? { ...defaultInternshipState, ...JSON.parse(saved) } : defaultInternshipState; window.localStorage.setItem(internshipStorageKey, JSON.stringify({ ...state, theoryAnswers: answers, theoryFiles: files, assessmentStatus: 'UNDER_REVIEW' })); window.location.href = '/internship/assessment/submitted' }
  return <div className="mx-auto max-w-[900px] space-y-5"><div className="flex items-center justify-between"><Link href="/internship/assessment/objective" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Objective completed</Link><span className="text-xs font-bold text-[#5FBB46]">Theory section</span></div><section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Final section</p><h1 className="mt-2 text-2xl font-bold text-[#1C1D52]">Write your theory responses</h1><p className="mt-2 text-sm text-slate-500">Answer each question clearly. You may save your progress and return before submitting.</p><div className="mt-7 space-y-6">{theoryQuestions.map((question, index) => <div key={question.id} className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4"><p className="text-sm font-bold leading-6 text-[#1C1D52]">{index + 1}. {question.prompt}</p><textarea value={answers[question.id] || ''} onChange={(event) => update(question.id, event.target.value)} rows={6} placeholder="Write your response here..." className="mt-4 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-blue-400" />{question.acceptsFile && <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-500"><FileUp className="h-4 w-4 text-blue-500" />{files[question.id] || 'Upload supporting document'}<input type="file" className="sr-only" onChange={(event) => updateFile(question.id, event.target.files?.[0]?.name || '')} /></label>}</div>)}</div><button type="button" onClick={submit} disabled={theoryQuestions.some((question) => !answers[question.id]?.trim())} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-3 text-xs font-bold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Submit theory assessment</button><p className="mt-3 text-center text-[10px] text-slate-500">Submitting completes this paid assessment attempt and it cannot be retaken.</p></section></div>
}
