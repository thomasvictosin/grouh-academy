'use client'

import { FormEvent, useState } from 'react'
import { CalendarDays, Paperclip, Send, Smile, Upload } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'

type Member = { name: string; role: string }
type Message = { id: number; sender: string; time: string; text: string; mine?: boolean }

const members: Member[] = [
  { name: 'Aster Seawalker', role: 'Intern (You)' },
  { name: 'David Chen', role: 'Intern' },
  { name: 'Priya Sharma', role: 'Intern' },
  { name: 'Marcus Johnson', role: 'Intern' },
  { name: 'Aisha Okafor', role: 'Intern' },
  { name: 'Liam Torres', role: 'Intern' },
]

const initialMessages: Message[] = [
  { id: 1, sender: 'David Chen', time: '10:28 AM', text: 'Hey everyone! Has anyone started working on the API integration assignment?' },
  { id: 2, sender: 'Priya Sharma', time: '10:30 AM', text: "Yes! I've set up the base endpoints. Want to sync up later today?" },
  { id: 3, sender: 'Marcus Johnson', time: '10:31 AM', text: "Count me in. I've been working on the database schema." },
  { id: 4, sender: 'Aster Seawalker', time: '10:32 AM', text: "Great progress team! Let's schedule a call to review everything together.", mine: true },
  { id: 5, sender: 'Aisha Okafor', time: '10:35 AM', text: 'Sounds good! I can share my frontend components during the call.' },
]

export default function DiscussionPage() {
  const [activeMember, setActiveMember] = useState('Aster Seawalker')
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const [meetingScheduled, setMeetingScheduled] = useState(false)
  const [attachment, setAttachment] = useState('')

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((current) => [...current, { id: Date.now(), sender: 'Aster Seawalker', time: 'Just now', text, mine: true }])
    setDraft('')
  }

  return (
    <InternshipShell>
      <div className="grid min-h-[calc(100dvh-104px)] gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
          <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-[#1C1D52]">Group Members</h1><span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-[10px] font-semibold text-[#1C1D52]">6 members</span></div>
          <div className="mt-5">{members.map((member) => <button key={member.name} type="button" onClick={() => setActiveMember(member.name)} className={`flex w-full items-center justify-between border-b border-slate-200 px-3 py-3 text-left transition ${activeMember === member.name ? 'bg-[#f3f6fb]' : 'hover:bg-[#f8fafc]'}`}><span><strong className="block text-sm text-[#1C1D52]">{member.name}</strong><span className="mt-1 block text-xs text-slate-500">{member.role}</span></span><span className="h-2 w-2 rounded-full bg-[#4bb455]" aria-label="Online" /></button>)}</div>
        </aside>

        <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
          <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"><div><h2 className="text-xl font-bold text-[#1C1D52]">Group A - Discussion</h2><p className="mt-1 text-xs text-slate-500">Internship Onboarding Cohort</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setMeetingScheduled((current) => !current)} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${meetingScheduled ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] shadow-[inset_0_0_0_2px_#1C1D52]'}`}><CalendarDays className="h-4 w-4" />{meetingScheduled ? 'Meeting Scheduled' : 'Schedule Meeting'}</button><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4aaa3e]"><Upload className="h-4 w-4" />Submit Assignment<input type="file" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')} /></label></div></header>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-16">{messages.map((message) => <article key={message.id} className={message.mine ? 'ml-auto max-w-[88%] text-right' : 'max-w-[88%]'}><div className="flex items-center gap-2 text-xs font-bold text-[#1C1D52]">{message.sender}<span className="font-normal text-slate-400">{message.time}</span></div><p className={`mt-2 rounded-xl px-3 py-3 text-left text-sm leading-5 ${message.mine ? 'bg-[#e8f7eb]' : 'bg-[#f3f6fb]'} text-[#1C1D52]`}>{message.text}</p></article>)}{attachment && <p className="text-right text-xs text-[#397d3a]">Attached: {attachment}</p>}</div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-200 p-4 sm:px-5"><label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f3f6fb] text-slate-500 hover:text-[#1C1D52]" aria-label="Attach a file"><Paperclip className="h-5 w-5" /><input type="file" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? '')} /></label><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type a message..." aria-label="Type a message" className="min-w-0 flex-1 rounded-full bg-[#f3f6fb] px-4 py-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" /><button type="button" className="-ml-12 flex h-8 w-8 items-center justify-center text-slate-500" aria-label="Emoji picker unavailable"><Smile className="h-4 w-4" /></button><button type="submit" disabled={!draft.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#5FBB46] text-white transition hover:bg-[#4aaa3e] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send message"><Send className="h-4 w-4" /></button></form>
        </section>
      </div>
    </InternshipShell>
  )
}
