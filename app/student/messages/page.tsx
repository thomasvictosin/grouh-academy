import React from 'react'
import Link from 'next/link'

const conversations = [
  { id: 1, name: 'Instructor - Web Dev', last: 'Please check the assignment brief.', time: '2d' },
  { id: 2, name: 'Support', last: 'Your payment was processed.', time: '5d' },
]

export default function MessagesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="text-sm text-gray-500">Your recent conversations.</p>
        </header>

        <section className="space-y-2">
          {conversations.map((c) => (
            <Link key={c.id} href={`#`} className="block rounded-lg bg-white p-4 shadow-[0_8px_24px_rgba(28,29,82,0.06)] transition hover:shadow-md sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-medium">{c.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.last}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{c.time}</div>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <aside className="space-y-6">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Assignments Due</h3>
          <div className="mt-3 text-sm text-gray-600">No upcoming assignments due this week.</div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Certificates</h3>
          <div className="mt-3 text-sm text-gray-600">You have earned 0 certificates.</div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Announcements</h3>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>No new announcements.</li>
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="font-medium">Upcoming Deadlines</h3>
          <div className="mt-2 text-sm text-gray-600">No upcoming deadlines.</div>
        </div>
      </aside>
    </div>
  )
}
