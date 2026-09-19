'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type TrackOption = { id: string; name: string }
type TaskRecord = {
  id: string
  title: string
  kind: 'INDIVIDUAL' | 'GROUP'
  trackId: string
  weekLabel: string
  duration: string
  attemptsAllowed: number
  dueDate: string | null
  description: string
}

export default function NewInternshipTaskPage() {
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  const [tracks, setTracks] = useState<TrackOption[]>([])
  const [title, setTitle] = useState('')
  const [trackId, setTrackId] = useState('')
  const [kind, setKind] = useState<'INDIVIDUAL' | 'GROUP'>('INDIVIDUAL')
  const [week, setWeek] = useState(1)
  const [endWeek, setEndWeek] = useState(1)
  const [duration, setDuration] = useState('1 week')
  const [allowedAttempts, setAllowedAttempts] = useState(1)
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/tasks', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Task setup request failed (${response.status}).`)
        const payload = (await response.json()) as { tracks?: TrackOption[]; tasks?: TaskRecord[] }
        const nextTracks = payload.tracks ?? []
        setTracks(nextTracks)
        if (nextTracks[0] && !trackId) setTrackId(nextTracks[0].id)

        if (editId) {
          const task = payload.tasks?.find((entry) => entry.id === editId)
          if (task) {
            setTitle(task.title)
            setTrackId(task.trackId)
            setKind(task.kind)
            setDuration(task.duration)
            setAllowedAttempts(task.attemptsAllowed)
            setDescription(task.description)
            const weekMatch = /\d+/.exec(task.weekLabel || 'Week 1')
            const parsedWeek = weekMatch ? Number(weekMatch[0]) : 1
            setWeek(parsedWeek)
            setEndWeek(parsedWeek)
            setDueDate(task.dueDate ?? '')
          }
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Task setup is unavailable.'))
  }, [editId, trackId])

  const availableWeeks = useMemo(() => Array.from({ length: 12 }, (_, index) => index + 1), [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!trackId || !title.trim()) {
      setError('Please pick a valid track and add a task title.')
      return
    }

    const normalizedDuration = duration.trim() || `${Math.max(1, endWeek - week + 1)} week${Math.max(1, endWeek - week + 1) === 1 ? '' : 's'}`

    setSaving(true)

    try {
      const response = await fetch('/api/admin/internship/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          programId: trackId,
          kind,
          week,
          startWeek: week,
          endWeek,
          duration: normalizedDuration,
          allowedAttempts,
          dueDate,
          description,
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error || 'Unable to save the task.')
      setSuccess('Task saved successfully.')
      setTitle('')
      setDescription('')
      setDuration('1 week')
      setAllowedAttempts(1)
      setDueDate('')
      setWeek(1)
      setEndWeek(1)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to save the task.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/tasks" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to tasks
      </Link>

      <form onSubmit={handleSubmit} className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Task creation</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">Configure internship task</h1>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save task'}
          </button>
        </div>

        {error && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</p>}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block text-[10px] font-semibold text-slate-500 md:col-span-2">
            Task name
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="Build a marketing strategy" />
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Internship track
            <select value={trackId} onChange={(event) => setTrackId(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              <option value="" disabled>Select a track</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Task type
            <select value={kind} onChange={(event) => setKind(event.target.value as 'INDIVIDUAL' | 'GROUP')} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              <option value="INDIVIDUAL">Individual Task</option>
              <option value="GROUP">Group Task</option>
            </select>
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Week assignment
            <select value={week} onChange={(event) => setWeek(Number(event.target.value))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              {availableWeeks.map((item) => (
                <option key={item} value={item}>Week {item}</option>
              ))}
            </select>
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            End week (multi-week tasks)
            <select value={endWeek} onChange={(event) => setEndWeek(Number(event.target.value))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none">
              {availableWeeks.map((item) => (
                <option key={item} value={item}>Week {item}</option>
              ))}
            </select>
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Task duration
            <input value={duration} onChange={(event) => setDuration(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="2 weeks" />
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Allowed attempts
            <input type="number" min={1} max={10} value={allowedAttempts} onChange={(event) => setAllowedAttempts(Math.max(1, Number(event.target.value) || 1))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
          </label>

          <label className="block text-[10px] font-semibold text-slate-500">
            Due date
            <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" />
          </label>

          <label className="block text-[10px] font-semibold text-slate-500 md:col-span-2">
            Task brief / instructions
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={5} className="mt-2 block min-h-[130px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#1C1D52] outline-none" placeholder="Explain what the intern should do, what to submit, and what success looks like." />
          </label>
        </div>
      </form>
    </div>
  )
}
