'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function EnrollButton({ slug }: { slug: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const [enrolling, setEnrolling] = useState(false)
  async function enroll() {
    setEnrolling(true)
    const response = await fetch(`/api/courses/${slug}/enroll`, { method: 'POST' })
    setMessage(response.ok ? 'You are enrolled in this course.' : 'Unable to enroll. Please sign in and try again.')
    setEnrolling(false)
  }
  return message ? <div className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-2 rounded-lg bg-[#e8f7eb] px-4 py-2.5 text-xs font-bold text-[#397d3a]"><CheckCircle2 className="h-4 w-4" />{message}</span><Link href={`/student/my-courses/${slug}/learn`} className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">Open course</Link></div> : <button type="button" onClick={() => void enroll()} disabled={enrolling} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f] disabled:opacity-60">{enrolling ? 'Enrolling...' : 'Enroll now'}</button>
}