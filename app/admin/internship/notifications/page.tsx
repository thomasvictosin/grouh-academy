'use client'

import { Bell, CheckCheck } from 'lucide-react'
import AdminShell from '@/components/AdminShell'

const notifications = [
  { id: 1, title: 'New application received', body: 'Chinedu Adebayo submitted a Product Design application for review.', time: '5 minutes ago', unread: true },
  { id: 2, title: 'Assessment due soon', body: 'Assessment Alpha closes in 3 days for 27 learners.', time: '1 hour ago', unread: true },
  { id: 3, title: 'Payment verified', body: 'Ada Nwosu completed her payment for Software Development.', time: 'Today', unread: false },
]

export default function InternshipNotificationsPage() {
  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Notifications</h1>
            <p className="mt-2 text-xs text-slate-500">Keep up with internship activity, mentor updates, assessment progress, and payments.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className={`flex items-start gap-3 rounded-xl p-4 ${item.unread ? 'bg-[#f8fbff]' : 'bg-white'} border border-slate-200`}>
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]">
                  <Bell className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1C1D52]">{item.title}</p>
                    {item.unread && <span className="rounded-full bg-[#5FBB46] px-2 py-1 text-[8px] font-bold text-white">New</span>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{item.body}</p>
                  <p className="mt-2 text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
