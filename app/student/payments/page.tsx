import React from 'react'

const transactions = [
  { id: 'INV-1001', date: '2026-07-12', amount: '$199', status: 'Paid' },
  { id: 'INV-1002', date: '2026-06-01', amount: '$49', status: 'Paid' },
]

export default function PaymentsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-sm text-gray-500">Invoices and payment history.</p>
        </header>

        <section className="rounded-lg bg-white p-4 shadow-sm sm:p-5">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="pb-3">Invoice</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 text-sm">{t.id}</td>
                  <td className="py-3 text-sm text-gray-600">{t.date}</td>
                  <td className="py-3 text-sm font-medium">{t.amount}</td>
                  <td className="py-3 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${t.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-sm text-indigo-600">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
