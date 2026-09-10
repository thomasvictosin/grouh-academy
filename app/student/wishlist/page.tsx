import React from 'react'
import CourseCard from '../../../components/CourseCard'

const wishlist = [
  { title: 'Advanced TypeScript', author: 'TS Guild', percent: 0 },
  { title: 'Product Management Basics', author: 'PM Org', percent: 0 },
]

export default function WishlistPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <main className="lg:col-span-2 space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Wishlist</h1>
          <p className="text-sm text-gray-500">Courses you&apos;ve saved to explore later.</p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {wishlist.map((c) => (
            <CourseCard key={c.title} title={c.title} author={c.author} percent={c.percent} />
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
