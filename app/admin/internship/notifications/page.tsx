'use client'

import { Bell, CheckCircle2, ClipboardCheck, LoaderCircle, Megaphone, Send, Sparkles, UserRound, WalletCards } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type ActivityCategory = 'Assessment' | 'Payment' | 'Task' | 'Cohort' | 'Program' | 'Announcement'
type Tone = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
type Audience = 'all' | 'active-cohort' | 'applicants'

type ActivityItem = {
  id: string
  title: string
  body: string
  createdAt: string
  category: ActivityCategory
  tone: Tone
}

const categoryMeta: Record<ActivityCategory, { icon: typeof Bell; chip: string }> = {
  Assessment: { icon: ClipboardCheck, chip: 'bg-[#eef7ff] text-blue-600' },
  Payment: { icon: WalletCards, chip: 'bg-[#edf9f3] text-green-600' },
  Task: { icon: CheckCircle2, chip: 'bg-[#fff6df] text-amber-600' },
  Cohort: { icon: Sparkles, chip: 'bg-[#f2ebff] text-violet-600' },
  Program: { icon: UserRound, chip: 'bg-[#eef7ff] text-sky-700' },
  Announcement: { icon: Megaphone, chip: 'bg-[#eafaf0] text-[#2f7d52]' },
}

const toneMeta: Record<Tone, string> = {
  INFO: 'bg-slate-100 text-slate-600',
  SUCCESS: 'bg-emerald-100 text-emerald-700',
  WARNING: 'bg-amber-100 text-amber-700',
  ERROR: 'bg-red-100 text-red-700',
}

function timeAgo(dateString: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function InternshipNotificationsPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [category, setCategory] = useState<'All' | ActivityCategory>('All')
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<Audience>('all')
  const [tone, setTone] = useState<Tone>('INFO')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadActivities() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/internship/notifications', { cache: 'no-store' })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error ?? 'Unable to load internship notifications.')
      setActivities(payload.activities ?? [])
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load internship notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchActivities = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/admin/internship/notifications', { cache: 'no-store' })
        const payload = await response.json().catch(() => null)
        if (!response.ok) throw new Error(payload?.error ?? 'Unable to load internship notifications.')
        if (active) {
          setActivities(payload.activities ?? [])
          setError(null)
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load internship notifications.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void fetchActivities()
    return () => { active = false }
  }, [])

  const filteredActivities = useMemo(() => activities.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category
    const haystack = `${item.title} ${item.body}`.toLowerCase()
    return matchesCategory && haystack.includes(query.trim().toLowerCase())
  }), [activities, category, query])

  async function publishNotification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPublishing(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/internship/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, audience, type: tone }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) throw new Error(payload?.error ?? 'Unable to publish the internship notification.')
      setTitle('')
      setMessage('')
      setSuccess(`Notification sent to ${payload.recipientCount} intern${payload.recipientCount === 1 ? '' : 's'}.`)
      await loadActivities()
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Unable to publish the internship notification.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Internship operations</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Notifications</h1>
            <p className="mt-2 text-xs text-slate-500">Monitor significant internship activity and send timely updates to interns.</p>
          </div>
        </header>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
        {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">{success}</p>}

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf9f3] text-[#2f7d52]">
                <Megaphone className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Send internship notification</h2>
                <p className="mt-1 text-[10px] text-slate-500">This reaches interns through the internship workspace.</p>
              </div>
            </div>

            <form onSubmit={publishNotification} className="mt-5 space-y-4">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Title
                <input
                  required
                  maxLength={160}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-[#1C1D52] outline-none focus:border-[#5FBB46]"
                  placeholder="Example: Cohort orientation starts this Friday"
                />
              </label>

              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Message
                <textarea
                  required
                  rows={5}
                  maxLength={2000}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="mt-1.5 block w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-[#1C1D52] outline-none focus:border-[#5FBB46]"
                  placeholder="Share the update that interns need to see and act on."
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-semibold text-[#1C1D52]">
                  Audience
                  <select value={audience} onChange={(event) => setAudience(event.target.value as Audience)} className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-[#1C1D52] outline-none focus:border-[#5FBB46]">
                    <option value="all">All active interns</option>
                    <option value="active-cohort">Only active cohort</option>
                    <option value="applicants">All registered internship applicants</option>
                  </select>
                </label>

                <label className="block text-[10px] font-semibold text-[#1C1D52]">
                  Priority
                  <select value={tone} onChange={(event) => setTone(event.target.value as Tone)} className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-[#1C1D52] outline-none focus:border-[#5FBB46]">
                    <option value="INFO">Info</option>
                    <option value="SUCCESS">Success</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Critical</option>
                  </select>
                </label>
              </div>

              <button disabled={publishing} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f] disabled:opacity-60">
                {publishing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {publishing ? 'Sending…' : 'Send to interns'}
              </button>
            </form>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Live internship activity</h2>
                <p className="mt-1 text-[10px] text-slate-500">Filtered to operational updates across the internship environment.</p>
              </div>
              <label className="relative block w-full max-w-[260px]">
                <span className="sr-only">Search notifications</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 pr-9 text-[10px] text-[#1C1D52] outline-none focus:border-[#5FBB46]" placeholder="Search activity" />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {(['All', 'Assessment', 'Payment', 'Task', 'Cohort', 'Program'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`rounded-full px-3 py-1.5 text-[9px] font-semibold ${category === option ? 'bg-[#1C1D52] text-white' : 'bg-slate-100 text-[#1C1D52]'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {loading && <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">Loading internship notifications…</p>}
              {!loading && filteredActivities.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
                  No internship activity matches the current filter.
                </div>
              )}

              {!loading && filteredActivities.map((item) => {
                const MetaIcon = categoryMeta[item.category].icon
                return (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-[#f8fbff] p-3">
                    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${categoryMeta[item.category].chip}`}>
                      <MetaIcon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1C1D52]">{item.title}</p>
                        <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${toneMeta[item.tone]}`}>{item.tone}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{item.body}</p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        <span>{timeAgo(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  )
}
