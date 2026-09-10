'use client'

import { FormEvent, useState } from 'react'
import { Search, Send } from 'lucide-react'
import Image from 'next/image'
import { MentorPage } from '@/components/MentorPage'

type Message = { sender: 'mentor' | 'intern'; text: string; time: string }
type Conversation = { name: string; track: string; unread: number; messages: Message[] }

const initialConversations: Conversation[] = [
  { name: 'Amaka Okafor', track: 'Software Development · Cohort A', unread: 2, messages: [{ sender: 'intern', text: 'Could you review the navigation state in my dashboard?', time: '9:42 AM' }, { sender: 'mentor', text: 'Yes. Send the latest submission and I will review it this afternoon.', time: '9:50 AM' }] },
  { name: 'Daniel Mensah', track: 'Product Design · Cohort A', unread: 0, messages: [{ sender: 'mentor', text: 'How is the product discovery brief progressing?', time: 'Yesterday' }, { sender: 'intern', text: 'The interview notes are complete. I am working on the themes now.', time: 'Yesterday' }] },
  { name: 'Ifeoma Nwosu', track: 'Software Development · Cohort B', unread: 1, messages: [{ sender: 'intern', text: 'I have submitted the API documentation exercise.', time: 'Mon' }] },
]

export default function MentorMessagesPage() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeName, setActiveName] = useState(initialConversations[0].name)
  const [draft, setDraft] = useState('')
  const activeConversation = conversations.find((conversation) => conversation.name === activeName) ?? conversations[0]

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    setConversations((current) => current.map((conversation) => conversation.name === activeName ? { ...conversation, messages: [...conversation.messages, { sender: 'mentor', text, time: 'Just now' }] } : conversation))
    setDraft('')
  }

  return <MentorPage title="Messages" description="Chat directly with your interns, answer questions, and keep mentorship conversations connected to their internship work."><section className="grid min-h-[620px] overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[280px_minmax(0,1fr)]"><aside className="border-b border-slate-200 md:border-b-0 md:border-r"><div className="border-b border-slate-200 p-4"><label className="flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search conversations</span><input placeholder="Search interns" className="w-full bg-transparent outline-none" /></label></div><div className="divide-y divide-slate-100">{conversations.map((conversation) => <button key={conversation.name} type="button" onClick={() => setActiveName(conversation.name)} className={`flex w-full items-center gap-3 p-4 text-left ${conversation.name === activeName ? 'bg-[#eef7f0]' : 'hover:bg-slate-50'}`}><Image src="/avatar-placeholder.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" /><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-[#1C1D52]">{conversation.name}</strong><span className="mt-1 block truncate text-[10px] text-slate-500">{conversation.track}</span></span>{conversation.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5FBB46] px-1 text-[9px] font-bold text-white">{conversation.unread}</span>}</button>)}</div></aside><div className="flex min-h-[560px] flex-col"><header className="border-b border-slate-200 p-4"><h2 className="text-sm font-bold text-[#1C1D52]">{activeConversation.name}</h2><p className="mt-1 text-[10px] text-slate-500">{activeConversation.track} · <span className="font-semibold text-[#5FBB46]">Online</span></p></header><div className="flex-1 space-y-4 overflow-y-auto bg-[#fbfdff] p-4 sm:p-6">{activeConversation.messages.map((message, index) => <div key={`${message.time}-${index}`} className={`flex ${message.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-5 ${message.sender === 'mentor' ? 'rounded-br-sm bg-[#1C1D52] text-white' : 'rounded-bl-sm bg-white text-slate-600 shadow-sm'}`}><p>{message.text}</p><span className={`mt-2 block text-[9px] ${message.sender === 'mentor' ? 'text-white/60' : 'text-slate-400'}`}>{message.time}</span></div></div>)}</div><form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 p-4"><label className="sr-only" htmlFor="mentor-message">Message {activeConversation.name}</label><input id="mentor-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message ${activeConversation.name}...`} className="min-w-0 flex-1 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" /><button type="submit" disabled={!draft.trim()} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-3.5 w-3.5" />Send</button></form></div></section></MentorPage>
}
