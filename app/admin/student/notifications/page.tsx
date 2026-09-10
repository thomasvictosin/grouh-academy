'use client'

import { Bell, CheckCheck, Info, Search, UserPlus, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type NotificationType = 'All' | 'Students' | 'Payments' | 'System'
type Notification = { id: number; title: string; body: string; time: string; type: Exclude<NotificationType, 'All'>; unread: boolean }

const initialNotifications: Notification[] = [
  { id: 1, title: 'New student registration', body: 'Mia Turner created a new student account.', time: '8 minutes ago', type: 'Students', unread: true },
  { id: 2, title: 'Payment received', body: 'A payment of $249.00 was received from James Wilson.', time: '42 minutes ago', type: 'Payments', unread: true },
  { id: 3, title: 'Course completion milestone', body: 'Ava Martinez completed Web Development with a perfect score.', time: '2 hours ago', type: 'Students', unread: false },
  { id: 4, title: 'Certificate queue ready', body: '23 certificates are waiting for approval and issuance.', time: 'Yesterday', type: 'System', unread: false },
  { id: 5, title: 'Payment gateway connected', body: 'Stripe integration was successfully connected.', time: 'Yesterday', type: 'Payments', unread: false },
]

const notificationIcons = { Students: UserPlus, Payments: WalletCards, System: Info }

export default function NotificationsPage() {
  const [activeType, setActiveType] = useState<NotificationType>('All')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [query, setQuery] = useState('')
  const visibleNotifications = useMemo(() => notifications.filter((notification) => (activeType === 'All' || notification.type === activeType) && `${notification.title} ${notification.body}`.toLowerCase().includes(query.toLowerCase())), [activeType, notifications, query])
  const unreadCount = notifications.filter((notification) => notification.unread).length

  function markAllRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1000px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Notifications</h1><p className="mt-2 text-xs text-slate-500">Stay up to date with student activity, payments, and system events.</p></div><button type="button" onClick={markAllRead} className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"><CheckCheck className="h-3.5 w-3.5" />Mark all as read</button></header><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2">{(['All', 'Students', 'Payments', 'System'] as NotificationType[]).map((type) => <button key={type} type="button" onClick={() => setActiveType(type)} className={`rounded-full px-3 py-2 text-[10px] font-semibold ${activeType === type ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{type}{type === 'All' && <span className="ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] text-slate-500">{unreadCount}</span>}</button>)}</div><label className="flex w-full max-w-[240px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search notifications</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search notifications..." /></label></div><div className="divide-y divide-slate-100">{visibleNotifications.map((notification) => { const Icon = notificationIcons[notification.type]; return <article key={notification.id} className={`flex gap-3 py-4 ${notification.unread ? 'bg-[#f8fbff]' : ''}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${notification.type === 'Payments' ? 'bg-[#fff0d8] text-orange-600' : notification.type === 'System' ? 'bg-slate-100 text-slate-500' : 'bg-[#e8faf7] text-teal-600'}`}><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xs font-bold text-[#1C1D52]">{notification.title}</h2>{notification.unread && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}</div><p className="mt-1 text-[10px] text-slate-500">{notification.body}</p><time className="mt-2 block text-[9px] text-slate-400">{notification.time}</time></div>{notification.unread && <button type="button" onClick={() => setNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, unread: false } : item))} className="self-center text-[9px] font-semibold text-blue-500 hover:text-blue-700">Mark read</button>}</article> })}{visibleNotifications.length === 0 && <div className="py-12 text-center"><Bell className="mx-auto h-7 w-7 text-slate-300" /><p className="mt-2 text-xs text-slate-500">No notifications found.</p></div>}</div></section></div></AdminShell>
}
