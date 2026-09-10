import React from 'react'
import { CheckCircle, Clock } from 'lucide-react'

const assignments = [
  { id: 1, title: 'Project: Build Landing Page', due: '2026-08-25', status: 'Pending' },
  { id: 2, title: 'Quiz: React Hooks', due: '2026-08-30', status: 'Submitted' },
]

export default function AssignmentsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <header className="mb-2">
          <h1 className="text-2xl font-semibold">Assignments</h1>
          <p className="text-sm text-gray-500">Track and submit your assignments.</p>
        </header>

        <section className="rounded-lg bg-white p-6 shadow w-full">
          <div className="divide-y divide-gray-100">
            {assignments.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <div className="text-sm font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">Due {a.due}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {a.status === 'Submitted' ? (
                    <div className="inline-flex items-center gap-2 rounded-md bg-green-50 px-3 py-1 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Submitted
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-md bg-yellow-50 px-3 py-1 text-sm text-yellow-700">
                      <Clock className="h-4 w-4" />
                      {a.status}
                    </div>
                  )}
                  <button className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white">View</button>
                </div>
              </div>
            ))}
          </div>
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
