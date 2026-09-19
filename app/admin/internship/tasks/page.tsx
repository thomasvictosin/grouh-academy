'use client'

import { Eye, PencilLine, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type TaskRecord = {
  id: string
  title: string
  kind: 'INDIVIDUAL' | 'GROUP'
  track: string
  trackId: string
  weekLabel: string
  duration: string
  attemptsAllowed: number
  attemptedBy: number
  completedCount: number
  status: string
  dueDate: string | null
  description: string
}

type TrackOption = { id: string; name: string }

export default function InternshipTasksPage() {
  const [tasks, setTasks] = useState<TaskRecord[]>([])
  const [tracks, setTracks] = useState<TrackOption[]>([])
  const [trackFilter, setTrackFilter] = useState('all')
  const [kindFilter, setKindFilter] = useState<'all' | 'INDIVIDUAL' | 'GROUP'>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/tasks', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Task data request failed (${response.status}).`)
        const payload = (await response.json()) as { tracks?: TrackOption[]; tasks?: TaskRecord[] }
        setTracks(payload.tracks ?? [])
        setTasks(payload.tasks ?? [])
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Task data is unavailable.'))
      .finally(() => setLoading(false))
  }, [])

  const visibleTasks = useMemo(() => {
    const term = query.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesTrack = trackFilter === 'all' || task.trackId === trackFilter
      const matchesKind = kindFilter === 'all' || task.kind === kindFilter
      const matchesSearch = !term || `${task.title} ${task.track} ${task.weekLabel}`.toLowerCase().includes(term)
      return matchesTrack && matchesKind && matchesSearch
    })
  }, [kindFilter, query, tasks, trackFilter])

  async function handleDelete(taskId: string) {
    try {
      const response = await fetch('/api/admin/internship/tasks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Unable to delete this task.')
      }
      setTasks((current) => current.filter((task) => task.id !== taskId))
      if (selectedTask?.id === taskId) setSelectedTask(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to delete this task.')
    }
  }

  const totalIndividual = tasks.filter((task) => task.kind === 'INDIVIDUAL').length
  const totalGroup = tasks.filter((task) => task.kind === 'GROUP').length

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Internship tasks</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Track tasks by week and program</h1>
          </div>
          <Link href="/admin/internship/tasks/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Plus className="h-4 w-4" />
            Create task
          </Link>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Total tasks', value: tasks.length },
            { label: 'Individual tasks', value: totalIndividual },
            { label: 'Group tasks', value: totalGroup },
            { label: 'Tracks', value: tracks.length },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
              <strong className="mt-3 block text-2xl text-[#1C1D52]">{item.value}</strong>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[300px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search task or week" />
            </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <select value={trackFilter} onChange={(event) => setTrackFilter(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-[#1C1D52] outline-none">
                <option value="all">All tracks</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>

              <select value={kindFilter} onChange={(event) => setKindFilter(event.target.value as 'all' | 'INDIVIDUAL' | 'GROUP')} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-semibold text-[#1C1D52] outline-none">
                <option value="all">All task types</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="GROUP">Group</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Loading internship tasks…</p>
          ) : visibleTasks.length === 0 ? (
            <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">No tasks match the current track or task-type filter.</p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left text-[10px]">
                <thead>
                  <tr className="bg-[#f5f8fb] text-slate-600">
                    <th className="px-3 py-3 font-semibold">Task</th>
                    <th className="px-3 py-3 font-semibold">Track</th>
                    <th className="px-3 py-3 font-semibold">Week</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 font-semibold">Attempted</th>
                    <th className="px-3 py-3 font-semibold">Completed</th>
                    <th className="px-3 py-3 font-semibold">Duration</th>
                    <th className="px-3 py-3 font-semibold">Attempts</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((task) => (
                    <tr key={task.id} className="border-b border-slate-100 align-top text-[#1C1D52]">
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="font-semibold">{task.title}</p>
                          <p className="mt-1 text-[9px] text-slate-500">{task.description || 'No summary provided.'}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{task.track}</td>
                      <td className="px-3 py-3.5 text-slate-600">{task.weekLabel}</td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-full px-2 py-1 font-semibold ${task.kind === 'GROUP' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#edf4ff] text-[#3557a5]'}`}>
                          {task.kind === 'GROUP' ? 'Group' : 'Individual'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{task.attemptedBy}</td>
                      <td className="px-3 py-3.5 text-slate-600">{task.completedCount}</td>
                      <td className="px-3 py-3.5 text-slate-600">{task.duration}</td>
                      <td className="px-3 py-3.5 text-slate-600">{task.attemptsAllowed}</td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${task.status === 'Overdue' ? 'bg-red-100 text-red-600' : task.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <button type="button" onClick={() => setSelectedTask(task)} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-semibold text-[#1C1D52] hover:bg-slate-200">
                            <Eye className="h-3 w-3" />
                            Preview
                          </button>
                          <Link href={`/admin/internship/tasks/new?edit=${task.id}`} className="inline-flex items-center gap-1 rounded bg-[#f3f6fb] px-2 py-1 font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">
                            <PencilLine className="h-3 w-3" />
                            Edit
                          </Link>
                          <button type="button" onClick={() => void handleDelete(task.id)} className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-1 font-semibold text-red-600 hover:bg-red-100">
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

        {selectedTask && (
          <section className="rounded-2xl bg-[#1C1D52] p-5 text-white shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be28a]">Task preview</p>
                <h2 className="mt-2 text-xl font-bold">{selectedTask.title}</h2>
              </div>
              <button type="button" onClick={() => setSelectedTask(null)} className="rounded-full bg-white/10 px-2 py-1 text-[9px] font-semibold text-white/80 hover:bg-white/15">
                Close
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] uppercase tracking-[0.12em] text-white/60">Track</p><p className="mt-2 text-sm font-semibold">{selectedTask.track}</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] uppercase tracking-[0.12em] text-white/60">Week</p><p className="mt-2 text-sm font-semibold">{selectedTask.weekLabel}</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] uppercase tracking-[0.12em] text-white/60">Duration</p><p className="mt-2 text-sm font-semibold">{selectedTask.duration}</p></div>
              <div className="rounded-xl bg-white/5 p-3"><p className="text-[9px] uppercase tracking-[0.12em] text-white/60">Attempt limit</p><p className="mt-2 text-sm font-semibold">{selectedTask.attemptsAllowed}</p></div>
            </div>
            <p className="mt-4 text-sm text-white/80">{selectedTask.description || 'No task summary has been added yet.'}</p>
          </section>
        )}
      </div>
    </AdminShell>
  )
}
