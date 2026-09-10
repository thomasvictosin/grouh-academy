import React from 'react'

const notes = [
  { id: 1, text: 'New course released: Advanced CSS', time: '1d' },
  { id: 2, text: 'Assignment graded: Project 1', time: '3d' },
]

export default function NotificationsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-gray-500">Recent system and course notifications.</p>
        </header>

        <section className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-white p-4 shadow-[0_8px_24px_rgba(28,29,82,0.06)] sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm">{n.text}</div>
                <div className="text-xs text-gray-400">{n.time}</div>
              </div>
            </div>
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
