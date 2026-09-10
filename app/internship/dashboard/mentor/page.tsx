'use client'

import { FormEvent, useState } from 'react'
import { CalendarDays, ChevronDown, Send } from 'lucide-react'
import Image from 'next/image'
import InternshipShell from '@/components/InternshipShell'

type Message = { id: number; sender: 'intern' | 'mentor'; text: string; time: string }

const initialMessages: Message[] = [
  { id: 1, sender: 'intern', text: 'How should I structure my API endpoints for the project?', time: '10:14 AM' },
  { id: 2, sender: 'mentor', text: "Great question! I recommend following RESTful conventions with proper versioning (e.g., /api/v1/resource). Here's a resource to help with endpoint hierarchy mapping.", time: '10:25 AM' },
  { id: 3, sender: 'intern', text: 'Thanks! Should I use REST or GraphQL for this use case?', time: '10:31 AM' },
  { id: 4, sender: 'mentor', text: "For your project scope, REST would be more straightforward. GraphQL is better when you have complex nested data requirements or strict bandwidth limits on mobile. Let's discuss in our next sync.", time: '10:45 AM' },
]

export default function MentorPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [topic, setTopic] = useState('Backend Architecture')
  const [isSending, setIsSending] = useState(false)

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isSending) return

    setMessages((current) => [...current, { id: Date.now(), sender: 'intern', text, time: 'Just now' }])
    setDraft('')
    setIsSending(true)
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, sender: 'mentor', text: 'Thanks for the question. I have received it and will follow up with a detailed answer shortly.', time: 'Just now' }])
      setIsSending(false)
    }, 700)
  }

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mentorship Workspace</h1><p className="mt-2 text-xs text-[#14204f]/75">Connect directly with senior advisors, resolve system doubts, and plan your software engineering career milestones.</p></section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Ask Your Mentor</h2><form onSubmit={sendMessage} className="mt-4"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type your question here..." aria-label="Message your mentor" rows={4} className="w-full resize-none rounded-lg bg-[#F3F6FB] px-3 py-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" /><div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><label className="flex items-center"><span className="sr-only">Select topic</span><select value={topic} onChange={(event) => setTopic(event.target.value)} className="h-9 rounded-lg bg-[#F3F6FB] px-3 text-[10px] text-[#1C1D52] outline-none"><option>Backend Architecture</option><option>Frontend Development</option><option>Career Guidance</option><option>Project Review</option></select><ChevronDown className="pointer-events-none -ml-6 h-3 w-3 text-slate-500" /></label><button type="submit" disabled={!draft.trim() || isSending} className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#5FBB46] px-5 text-[10px] font-semibold text-white transition hover:bg-[#4aaa3e] disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-3.5 w-3.5" />{isSending ? 'Sending...' : 'Submit Question'}</button></div></form></section>

            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><h2 className="text-sm font-bold text-[#1C1D52]">Discussion Thread</h2><span className="text-[9px] font-semibold text-[#5FBB46]">Live Sync Status: Online</span></div><div className="mt-4 space-y-4">{messages.map((message) => <div key={message.id} className={`flex gap-2 ${message.sender === 'mentor' ? 'flex-row-reverse' : ''}`}><Image src="/avatar-placeholder.png" alt="" width={24} height={24} className="h-6 w-6 shrink-0 rounded-full object-cover" /><div className={`max-w-[85%] ${message.sender === 'mentor' ? 'text-right' : ''}`}><div className="flex items-center gap-2 text-[9px] font-bold text-[#1C1D52]"><span>{message.sender === 'mentor' ? 'Dr. Sarah Chen (Mentor)' : 'Aster Seawalker'}</span><span className="font-normal text-slate-400">{message.time}</span></div><p className={`mt-1 rounded-lg px-3 py-2 text-left text-[10px] leading-4 ${message.sender === 'mentor' ? 'bg-[#eef7f0] text-slate-600' : 'bg-[#F3F6FB] text-[#1C1D52]'}`}>{message.text}</p></div></div>)}</div></section>
          </div>

          <aside className="space-y-5"><section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex items-start gap-3"><Image src="/avatar-placeholder.png" alt="Dr. Sarah Chen" width={56} height={56} className="h-14 w-14 rounded-full object-cover" /><div><h2 className="text-sm font-bold text-[#1C1D52]">Dr. Sarah Chen</h2><p className="mt-1 text-[10px] text-slate-500">Senior Software Engineer</p><p className="text-[10px] text-slate-500">TechCorp Inc.</p><p className="mt-1 text-[10px] font-bold text-[#f0b928]">★ 4.8 stars</p></div></div><div className="mt-5"><h3 className="text-[10px] font-bold text-[#1C1D52]">Bio</h3><p className="mt-2 text-[10px] leading-4 text-slate-500">10+ years in full-stack development. Specializes in distributed systems and cloud architecture. Previously at Google and Meta.</p><h3 className="mt-4 text-[10px] font-bold text-[#1C1D52]">Expertise</h3><div className="mt-2 flex flex-wrap gap-1.5">{['Distributed Systems', 'Cloud Architecture', 'System Design', 'React', 'Node.js', 'AWS'].map((item) => <span key={item} className="rounded bg-[#eef7f0] px-2 py-1 text-[9px] text-[#397d3a]">{item}</span>)}</div></div><button type="button" className="mt-5 w-full rounded-lg bg-[#5FBB46] py-2.5 text-[10px] font-semibold text-white">Schedule Meeting</button></section><section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#1C1D52]">Availability</h2><span className="text-[9px] font-semibold text-[#5FBB46]">● Online Now</span></div><div className="mt-4 flex justify-between text-[10px] text-slate-500"><span>Mon / Wed / Fri</span><strong className="text-[#1C1D52]">2:00 PM - 4:00 PM</strong></div></section><section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)]"><h2 className="text-sm font-bold text-[#1C1D52]">Upcoming Sessions</h2><div className="mt-4 rounded-lg bg-[#F3F6FB] p-3"><div className="flex items-center justify-between"><p className="text-[10px] font-bold text-[#1C1D52]">System Design Check-in</p><span className="text-[9px] font-semibold text-[#5FBB46]">Confirmed</span></div><p className="mt-2 flex items-center gap-1 text-[9px] text-slate-500"><CalendarDays className="h-3 w-3" />Oct 24, 2026 · 2:30 PM</p></div></section></aside>
        </div>
      </div>
    </InternshipShell>
  )
}
