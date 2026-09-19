'use client'

import { Bell, BookOpen, CheckCircle2, MessageCircleQuestion, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { InstructorPage, StatusBadge } from '@/components/InstructorPage'

type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

type NotificationItem = {
  id: string
  title: string
  message: string
  type: NotificationType
  read: boolean
  time: string
  source: string
}

const toneMap: Record<NotificationType, 'green' | 'amber' | 'blue'> = {
  INFO: 'blue',
  SUCCESS: 'green',
  WARNING: 'amber',
  ERROR: 'amber',
}

export default function InstructorNotificationsPage() {
  const [courses, setCourses] = useState<Array<{ id: string; title: string }>>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', message: '', courseId: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/instructor/notifications', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Unable to load notifications.')
      }

      const data = await response.json()
      setNotifications(data.notifications ?? [])
      setCourses(data.courses ?? [])
    } catch (loadError) {
      console.error(loadError)
      setError('We could not load your notifications right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNotifications()
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.title.trim() || !form.message.trim()) {
      setError('Please add both a title and a message for this announcement.')
      return
    }

    try {
      const response = await fetch('/api/instructor/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to send the notification.')
      }

      setForm({ title: '', message: '', courseId: '' })
      setSuccess(`Announcement sent to ${payload.recipientCount ?? 0} enrolled learner${payload.recipientCount === 1 ? '' : 's'}.`)
      await loadNotifications()
    } catch (submitError) {
      console.error(submitError)
      setError(submitError instanceof Error ? submitError.message : 'Unable to send this update.')
    }
  }

  return (
    <InstructorPage
      title="Notifications"
      description="Stay informed about course reviews, learner activity, grading, and announcements sent to your students."
    >
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dceeff] text-blue-600">
              <Bell className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[#1C1D52]">Send a course update</h2>
              <p className="mt-1 text-[10px] text-slate-500">Notify students enrolled in the course you teach.</p>
            </div>
          </div>
          <Sparkles className="h-4 w-4 text-[#5FBB46]" />
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-bold text-[#1C1D52]">
              Title
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="New lesson is live"
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400"
              />
            </label>

            <label className="block text-xs font-bold text-[#1C1D52]">
              Course
              <select
                value={form.courseId}
                onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
                className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400"
              >
                <option value="">All enrolled courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-xs font-bold text-[#1C1D52]">
            Message
            <textarea
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              rows={4}
              placeholder="Share course notes, deadlines, or important reminders for your learners."
              className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-xs font-normal outline-none focus:border-blue-400"
            />
          </label>

          {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div> : null}
          {success ? <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{success}</div> : null}

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]"
          >
            <Send className="h-4 w-4" />
            Send notification
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1C1D52]">Your activity feed</h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            {loading ? 'Loading' : `${notifications.length} items`}
          </span>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
            Loading teaching updates...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
            No notifications yet. Your learner activity and course updates will appear here.
          </div>
        ) : (
          notifications.map((item) => {
            const Icon =
              item.type === 'SUCCESS'
                ? CheckCircle2
                : item.type === 'WARNING'
                  ? Bell
                  : MessageCircleQuestion

            return (
              <article
                key={item.id}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    item.type === 'SUCCESS'
                      ? 'bg-[#e8f7eb] text-[#5FBB46]'
                      : item.type === 'WARNING'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-[#1C1D52]">{item.title}</h3>
                    <StatusBadge tone={toneMap[item.type]}>{item.read ? 'Seen' : 'New'}</StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.message}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                    <span>{item.time}</span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {item.source === 'system' ? 'System update' : 'Course activity'}
                    </span>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </section>
    </InstructorPage>
  )
}
