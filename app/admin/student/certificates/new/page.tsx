'use client'

import { ArrowLeft, Award } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/AdminShell'

type Option = { id: string; name?: string; title?: string }

export default function NewCertificatePage() {
  const router = useRouter()
  const [students, setStudents] = useState<Option[]>([])
  const [courses, setCourses] = useState<Option[]>([])
  const [studentId, setStudentId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => { fetch('/api/admin/student/certificates', { cache: 'no-store' }).then(async (response) => { if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? 'Unable to load issuance options.'); return response.json() }).then((data) => { setStudents(data.students); setCourses(data.courses); setStudentId(data.students[0]?.id ?? ''); setCourseId(data.courses[0]?.id ?? '') }).catch((reason) => setError(reason.message)) }, [])
  async function issue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setSaving(true)
    const response = await fetch('/api/admin/student/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentId, courseId }) })
    const data = await response.json().catch(() => null); setSaving(false)
    if (!response.ok) { setError(data?.error ?? 'Unable to issue certificate.'); return }
    router.push(`/admin/student/certificates/${data.id}`)
  }
  return <AdminShell workspace="student"><div className="mx-auto max-w-[920px] space-y-5"><Link href="/admin/student/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Back to certificates</Link><header className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Certificate management</p><h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Issue Certificate</h1><p className="mt-2 text-xs text-slate-500">A certificate can be issued only where the learner has completed the selected course.</p></header>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}<form onSubmit={issue} className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dceeff] text-blue-600"><Award className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-[#1C1D52]">Certificate details</h2><p className="mt-1 text-[10px] text-slate-500">Certificate numbers are generated automatically.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-semibold text-[#1C1D52]">Learner<select required value={studentId} onChange={(event) => setStudentId(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option value="" disabled>Select learner</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</select></label><label className="text-[10px] font-semibold text-[#1C1D52]">Course<select required value={courseId} onChange={(event) => setCourseId(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal"><option value="" disabled>Select course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label></div><div className="mt-6 flex justify-end gap-3"><Link href="/admin/student/certificates" className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link><button disabled={saving || !studentId || !courseId} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] disabled:opacity-50"><Award className="h-4 w-4" />{saving ? 'Issuing…' : 'Issue certificate'}</button></div></form></div></AdminShell>
}
