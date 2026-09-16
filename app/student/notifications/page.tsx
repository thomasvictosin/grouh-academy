'use client'

import { useEffect, useState } from 'react'

type NotificationItem = { id: string; title: string; message: string; read: boolean; time: string }
type Announcement = { id: string; title: string; message: string; authorName: string | null; postedLabel: string }
type Summary = {
  assignmentsDueCount: number
  assignmentsDue: { title: string; dueLabel: string }[]
  certificatesCount: number
  upcomingDeadlines: { title: string; dueLabel: string }[]
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/student/notifications').then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch('/api/announcements').then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch('/api/student/notifications-summary').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([notificationsData, announcementsData, summaryData]) => {
        setNotifications(notificationsData)
        setAnnouncements(announcementsData)
        setSummary(summaryData)
      })
      .catch(() => setError('Unable to load notifications.'))
      .finally(() => setLoading(false))
  }, [])

  async function markAllRead() {
    setNotifications((current) => current.map((n) => ({ ...n, read: true })))
    try {
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      })
    } catch {
      // Local state already optimistically updated; a failed request here
      // just means the badge count may be briefly stale on next load.
    }
  }

  async function markRead(id: string) {
    setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
    } catch {
      // See note in markAllRead.
    }
  }

  if (loading) {
    return <p className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-[0_8px_24px_rgba(28,29,82,0.06)]">Loading notifications...</p>
  }

  if (error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div>
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <main className="space-y-6 lg:col-span-2">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Notifications</h1>
            <p className="text-sm text-gray-500">Recent system and course notifications.</p>
          </div>
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} className="text-xs font-semibold text-[#5FBB46] hover:underline">
              Mark all as read
            </button>
          )}
        </header>

        <section className="space-y-2">
          {notifications.length === 0 ? (
            <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-400 shadow-[0_8px_24px_rgba(28,29,82,0.06)]">No notifications yet.</div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => !n.read && markRead(n.id)}
                className={`block w-full rounded-lg p-4 text-left shadow-[0_8px_24px_rgba(28,29,82,0.06)] transition sm:p-5 ${n.read ? 'bg-white' : 'bg-[#f4faf2]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#5FBB46]" />}
                      {n.title}
                    </div>
                    {n.message && <p className="mt-1 text-xs text-gray-500">{n.message}</p>}
                  </div>
                  <div className="shrink-0 text-xs text-gray-400">{n.time}</div>
                </div>
              </button>
            ))
          )}
        </section>
      </main>

      <aside className="space-y-6">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Assignments Due</h3>
          {summary?.assignmentsDue && summary.assignmentsDue.length > 0 ? (
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {summary.assignmentsDue.map((a) => (
                <li key={a.title} className="flex items-center justify-between gap-2">
                  <span className="truncate">{a.title}</span>
                  <span className="shrink-0 text-xs text-gray-400">{a.dueLabel}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3 text-sm text-gray-600">No upcoming assignments due this week.</div>
          )}
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Certificates</h3>
          <div className="mt-3 text-sm text-gray-600">You have earned {summary?.certificatesCount ?? 0} certificate{summary?.certificatesCount === 1 ? '' : 's'}.</div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Announcements</h3>
          {announcements.length > 0 ? (
            <ul className="mt-2 space-y-3 text-sm text-gray-600">
              {announcements.map((a) => (
                <li key={a.id}>
                  <p className="font-medium text-[#1C1D52]">{a.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{a.message}</p>
                  <p className="mt-0.5 text-[10px] text-gray-400">{a.authorName ?? 'Announcement'} · {a.postedLabel}</p>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>No new announcements.</li>
            </ul>
          )}
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Upcoming Deadlines</h3>
          {summary?.upcomingDeadlines && summary.upcomingDeadlines.length > 0 ? (
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {summary.upcomingDeadlines.map((d) => (
                <li key={d.title} className="flex items-center justify-between gap-2">
                  <span className="truncate">{d.title}</span>
                  <span className="shrink-0 text-xs text-gray-400">{d.dueLabel}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-2 text-sm text-gray-600">No upcoming deadlines.</div>
          )}
        </div>
      </aside>
    </div>
  )
}