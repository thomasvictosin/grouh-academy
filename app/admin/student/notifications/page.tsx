'use client'

import { Bell, Info, LoaderCircle, Megaphone, Search, Send, UserPlus, WalletCards } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import AdminShell from '@/components/AdminShell'

type NotificationType = 'All' | 'Students' | 'Payments' | 'System'
type Activity = { id: string; title: string; body: string; createdAt: string; type: Exclude<NotificationType, 'All'> }

const notificationIcons = { Students: UserPlus, Payments: WalletCards, System: Info }

function timeAgo(dateString: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateString).getTime()) / 1000))
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Yesterday' : `${days} days ago`
}

export default function NotificationsPage() {
  const [activeType, setActiveType] = useState<NotificationType>('All')
  const [activities, setActivities] = useState<Activity[]>([])
  const [query, setQuery] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function loadActivities() {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/student/notifications', { cache: 'no-store' })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error ?? 'Unable to load notification activity.')
      setActivities(data.activities)
      setError(null)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load notification activity.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    fetch('/api/admin/student/notifications', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error ?? 'Unable to load notification activity.')
        return data
      })
      .then((data) => { if (mounted) { setActivities(data.activities); setError(null) } })
      .catch((loadError) => { if (mounted) setError(loadError instanceof Error ? loadError.message : 'Unable to load notification activity.') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const visibleActivities = useMemo(() => activities.filter((activity) => (activeType === 'All' || activity.type === activeType) && `${activity.title} ${activity.body}`.toLowerCase().includes(query.toLowerCase())), [activeType, activities, query])

  async function publishAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPublishing(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch('/api/admin/student/notifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, message }) })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error ?? 'Unable to publish the announcement.')
      setTitle('')
      setMessage('')
      setSuccess(`Announcement sent to ${data.recipientCount} student${data.recipientCount === 1 ? '' : 's'}.`)
      await loadActivities()
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Unable to publish the announcement.')
    } finally {
      setPublishing(false)
    }
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1000px] space-y-5"><header><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Notifications</h1><p className="mt-2 text-xs text-slate-500">Monitor live learner activity and send announcements directly to students.</p></header><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8f0ff] text-blue-600"><Megaphone className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-[#1C1D52]">New student announcement</h2><p className="text-[10px] text-slate-500">Every current student will receive this in their notification feed.</p></div></div><form onSubmit={publishAnnouncement} className="mt-4 space-y-3"><label className="block text-[10px] font-semibold text-[#1C1D52]">Title<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" placeholder="e.g. Scheduled platform maintenance" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Message<textarea required maxLength={2000} value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" placeholder="Write the announcement students should see..." /></label><div className="flex flex-wrap items-center gap-3"><button disabled={publishing} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-[10px] font-semibold text-white disabled:opacity-60">{publishing ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}{publishing ? 'Sending...' : 'Send to students'}</button>{success && <p className="text-[10px] font-medium text-emerald-600">{success}</p>}</div></form></section><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{(['All', 'Students', 'Payments', 'System'] as NotificationType[]).map((type) => <button key={type} type="button" onClick={() => setActiveType(type)} className={`rounded-full px-3 py-2 text-[10px] font-semibold ${activeType === type ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{type}<span className="ml-1.5 opacity-75">{type === 'All' ? activities.length : activities.filter((activity) => activity.type === type).length}</span></button>)}</div><label className="flex w-full max-w-[240px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search activity</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search activity..." /></label></div>{error && <p className="py-6 text-center text-xs text-red-600">{error}</p>}{loading ? <div className="flex justify-center py-12"><LoaderCircle className="h-5 w-5 animate-spin text-blue-500" /></div> : !error && <div className="divide-y divide-slate-100">{visibleActivities.map((activity) => { const Icon = notificationIcons[activity.type]; return <article key={activity.id} className="flex gap-3 py-4"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.type === 'Payments' ? 'bg-[#fff0d8] text-orange-600' : activity.type === 'System' ? 'bg-slate-100 text-slate-500' : 'bg-[#e8faf7] text-teal-600'}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h2 className="text-xs font-bold text-[#1C1D52]">{activity.title}</h2><p className="mt-1 text-[10px] text-slate-500">{activity.body}</p><time className="mt-2 block text-[9px] text-slate-400" dateTime={activity.createdAt}>{timeAgo(activity.createdAt)}</time></div></article> })}{visibleActivities.length === 0 && <div className="py-12 text-center"><Bell className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-xs text-slate-500">No activity found.</p></div>}</div>}</section></div></AdminShell>
}
