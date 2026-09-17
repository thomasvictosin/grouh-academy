'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { CalendarDays, Send, Upload, X } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'

type Member = { userId: string; name: string; isLeader: boolean; isMe: boolean }
type Message = { id: string; senderId: string; content: string; createdAt: string; isMine: boolean }
type Meeting = { title: string; scheduledLabel: string; createdByName: string | null }
type CurrentTask = { id: string; title: string; moduleTitle: string }
type MemberProfile = {
  visible: boolean
  name: string
  avatarUrl?: string | null
  bio?: string | null
  skills?: string[]
  isLeader: boolean
  progressPercent?: number
  completedTasks?: number
  totalTasks?: number
}

const POLL_INTERVAL_MS = 4000

export default function DiscussionPage() {
  const [groupNumber, setGroupNumber] = useState<number | null>(null)
  const [isLeader, setIsLeader] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [currentTask, setCurrentTask] = useState<CurrentTask | null>(null)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  const [showMeetingForm, setShowMeetingForm] = useState(false)
  const [meetingDateTime, setMeetingDateTime] = useState('')
  const [schedulingMeeting, setSchedulingMeeting] = useState(false)

  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submissionText, setSubmissionText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const lastFetchedAt = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function loadGroup(initial: boolean) {
    try {
      const url = new URL('/api/internship/group', window.location.origin)
      if (!initial && lastFetchedAt.current) url.searchParams.set('after', lastFetchedAt.current)

      const response = await fetch(url.toString())
      const body = await response.json()

      if (!response.ok) {
        if (initial) setError(body?.error ?? 'Unable to load your group.')
        return
      }

      if (initial) {
        setGroupNumber(body.groupNumber)
        setIsLeader(body.isLeader)
        setMembers(body.members)
        setMeeting(body.meeting)
        setCurrentTask(body.currentTask)
        setMessages(body.messages)
      } else if (body.messages.length > 0) {
        setMessages((current) => [...current, ...body.messages])
      }

      if (body.messages.length > 0) {
        lastFetchedAt.current = body.messages[body.messages.length - 1].createdAt
      }
      setError(null)
    } catch {
      if (initial) setError('Unable to load your group.')
    } finally {
      if (initial) setLoading(false)
    }
  }

  useEffect(() => {
    loadGroup(true)
    const interval = window.setInterval(() => loadGroup(false), POLL_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = draft.trim()
    if (!content) return

    try {
      const response = await fetch('/api/internship/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body?.error ?? 'Unable to send message.')

      setMessages((current) => [...current, body])
      lastFetchedAt.current = body.createdAt
      setDraft('')
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Unable to send message.')
    }
  }

  async function openMemberProfile(member: Member) {
    setSelectedMember(member)
    setMemberProfile(null)
    setLoadingProfile(true)
    try {
      const response = await fetch(`/api/internship/group/member?userId=${encodeURIComponent(member.userId)}`)
      const body = await response.json()
      if (response.ok) setMemberProfile(body)
    } finally {
      setLoadingProfile(false)
    }
  }

  async function scheduleMeeting(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!meetingDateTime) return
    setSchedulingMeeting(true)
    setError(null)
    try {
      const response = await fetch('/api/internship/group/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: new Date(meetingDateTime).toISOString() }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body?.error ?? 'Unable to schedule meeting.')
      setShowMeetingForm(false)
      setMeetingDateTime('')
      loadGroup(true)
    } catch (scheduleError) {
      setError(scheduleError instanceof Error ? scheduleError.message : 'Unable to schedule meeting.')
    } finally {
      setSchedulingMeeting(false)
    }
  }

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!currentTask || !submissionText.trim()) return
    setSubmitting(true)
    setSubmitMessage('')
    try {
      const response = await fetch('/api/internship/group/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: currentTask.id, content: submissionText.trim() }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body?.error ?? 'Unable to submit assignment.')
      setSubmitMessage('Assignment submitted.')
      setSubmissionText('')
      setShowSubmitForm(false)
    } catch (submitError) {
      setSubmitMessage(submitError instanceof Error ? submitError.message : 'Unable to submit assignment.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <InternshipShell><p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading your group...</p></InternshipShell>
  }

  if (error && messages.length === 0 && members.length === 0) {
    return <InternshipShell><div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div></InternshipShell>
  }

  return (
    <InternshipShell>
      <div className="grid min-h-[calc(100dvh-104px)] gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#1C1D52]">Group {groupNumber}</h1>
            <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-[10px] font-semibold text-[#1C1D52]">{members.length} members</span>
          </div>
          <div className="mt-5">
            {members.map((member) => (
              <button
                key={member.userId}
                type="button"
                onClick={() => openMemberProfile(member)}
                className="flex w-full items-center justify-between border-b border-slate-200 px-3 py-3 text-left transition hover:bg-[#f8fafc]"
              >
                <span>
                  <strong className="block text-sm text-[#1C1D52]">{member.name}{member.isMe ? ' (You)' : ''}</strong>
                  <span className="mt-1 block text-xs text-slate-500">{member.isLeader ? 'Group Leader' : 'Intern'}</span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
          <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-xl font-bold text-[#1C1D52]">Group {groupNumber} - Discussion</h2>
              <p className="mt-1 text-xs text-slate-500">
                {meeting ? `Next meeting: ${meeting.scheduledLabel}` : 'No meeting scheduled'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {isLeader && (
                <button
                  type="button"
                  onClick={() => setShowMeetingForm((current) => !current)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${meeting ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] shadow-[inset_0_0_0_2px_#1C1D52]'}`}
                >
                  <CalendarDays className="h-4 w-4" />
                  {meeting ? 'Reschedule Meeting' : 'Schedule Meeting'}
                </button>
              )}
              {currentTask && (
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4aaa3e]"
                >
                  <Upload className="h-4 w-4" />
                  Submit Assignment
                </button>
              )}
            </div>
          </header>

          {showMeetingForm && (
            <form onSubmit={scheduleMeeting} className="flex flex-wrap items-center gap-2 border-b border-slate-200 px-5 py-3">
              <input
                type="datetime-local"
                value={meetingDateTime}
                onChange={(e) => setMeetingDateTime(e.target.value)}
                required
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs"
              />
              <button type="submit" disabled={schedulingMeeting} className="rounded-lg bg-[#5FBB46] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60">
                {schedulingMeeting ? 'Scheduling…' : 'Confirm'}
              </button>
            </form>
          )}

          {error && <p className="border-b border-slate-200 px-5 py-2 text-xs font-semibold text-red-600">{error}</p>}

          <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-16">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No messages yet — say hello to your group!</p>
            ) : (
              messages.map((message) => {
                const sender = members.find((m) => m.userId === message.senderId)
                return (
                  <article key={message.id} className={message.isMine ? 'ml-auto max-w-[88%] text-right' : 'max-w-[88%]'}>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1C1D52]">
                      {sender?.name ?? 'Member'}
                      <span className="font-normal text-slate-400">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className={`mt-2 rounded-xl px-3 py-3 text-left text-sm leading-5 ${message.isMine ? 'bg-[#e8f7eb]' : 'bg-[#f3f6fb]'} text-[#1C1D52]`}>{message.content}</p>
                  </article>
                )
              })
            )}
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-200 p-4 sm:px-5">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type a message..."
              aria-label="Type a message"
              className="min-w-0 flex-1 rounded-full bg-[#f3f6fb] px-4 py-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25"
            />
            <button type="submit" disabled={!draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5FBB46] text-white transition hover:bg-[#4aaa3e] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>

      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1D52]/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C1D52]">{selectedMember.name}</h3>
              <button type="button" onClick={() => setSelectedMember(null)} aria-label="Close"><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            {loadingProfile ? (
              <p className="mt-4 text-xs text-slate-400">Loading profile...</p>
            ) : memberProfile?.visible === false ? (
              <p className="mt-4 text-xs text-slate-500">This member has kept their profile private.</p>
            ) : memberProfile ? (
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                {memberProfile.isLeader && <span className="inline-block rounded-full bg-[#eaf1ff] px-2 py-1 text-[10px] font-semibold text-[#1C1D52]">Group Leader</span>}
                {memberProfile.bio && <p>{memberProfile.bio}</p>}
                {memberProfile.skills && memberProfile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {memberProfile.skills.map((skill) => <span key={skill} className="rounded bg-[#f3f6fb] px-2 py-1 text-[10px] font-medium text-[#1C1D52]">{skill}</span>)}
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3">
                  <p className="font-semibold text-[#1C1D52]">Progress: {memberProfile.progressPercent}%</p>
                  <p className="text-slate-400">{memberProfile.completedTasks} / {memberProfile.totalTasks} tasks completed</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-xs text-slate-400">Unable to load this profile.</p>
            )}
          </div>
        </div>
      )}

      {showSubmitForm && currentTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1D52]/50 p-4">
          <form onSubmit={submitTask} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1C1D52]">Submit: {currentTask.title}</h3>
              <button type="button" onClick={() => setShowSubmitForm(false)} aria-label="Close"><X className="h-4 w-4 text-slate-400" /></button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">{currentTask.moduleTitle}</p>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={5}
              placeholder="Paste your submission notes or a link to your work..."
              className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
            />
            <button type="submit" disabled={submitting || !submissionText.trim()} className="mt-4 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-white disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit Assignment'}
            </button>
            {submitMessage && <p className="mt-3 text-xs font-semibold text-[#397d3a]">{submitMessage}</p>}
          </form>
        </div>
      )}
    </InternshipShell>
  )
}