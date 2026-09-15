'use client'

import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import InternshipShell from '@/components/InternshipShell'

type Message = { id: string; senderId: string; content: string; createdAt: string; isMine: boolean }

const POLL_INTERVAL_MS = 4000

export default function MentorChatPage() {
  const [mentorName, setMentorName] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const lastFetchedAt = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function loadMessages(initial: boolean) {
    try {
      const url = new URL('/api/internship/mentor/messages', window.location.origin)
      if (!initial && lastFetchedAt.current) url.searchParams.set('after', lastFetchedAt.current)

      const response = await fetch(url.toString())
      const body = await response.json()

      if (!response.ok) {
        if (initial) setError(body?.error ?? 'Unable to load conversation.')
        return
      }

      setMentorName(body.mentorName)
      if (body.messages.length > 0) {
        lastFetchedAt.current = body.messages[body.messages.length - 1].createdAt
        setMessages((current) => (initial ? body.messages : [...current, ...body.messages]))
      }
      setError(null)
    } catch {
      if (initial) setError('Unable to load conversation.')
    } finally {
      if (initial) setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages(true)
    const interval = window.setInterval(() => loadMessages(false), POLL_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = draft.trim()
    if (!content || sending) return

    setSending(true)
    setError(null)
    try {
      const response = await fetch('/api/internship/mentor/messages', {
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
    } finally {
      setSending(false)
    }
  }

  return (
    <InternshipShell>
      <div className="flex h-[calc(100vh-160px)] flex-col rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div>
            <h1 className="text-sm font-bold text-[#1C1D52]">{mentorName ?? 'Your Mentor'}</h1>
            <p className="text-xs text-slate-500">Direct messages</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {loading ? (
            <p className="text-center text-sm text-slate-400">Loading conversation...</p>
          ) : error && messages.length === 0 ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-slate-400">No messages yet — say hello!</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs ${message.isMine ? 'bg-[#5FBB46] text-white' : 'bg-[#F3F6FB] text-[#1C1D52]'}`}>
                  <p className="leading-5">{message.content}</p>
                  <p className={`mt-1 text-[9px] ${message.isMine ? 'text-white/70' : 'text-slate-400'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {error && messages.length > 0 && <p className="px-5 pb-2 text-xs font-semibold text-red-600">{error}</p>}

        <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-100 px-5 py-4">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
            maxLength={2000}
            className="h-10 flex-1 rounded-lg bg-[#F3F6FB] px-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25"
          />
          <button type="submit" disabled={sending || !draft.trim()} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#5FBB46] px-4 text-xs font-bold text-white disabled:opacity-60">
            <Send className="h-3.5 w-3.5" />
            Send
          </button>
        </form>
      </div>
    </InternshipShell>
  )
}