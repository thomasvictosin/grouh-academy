'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { MentorPage } from '@/components/MentorPage'

export default function NewMentorTaskPage() {
  const [saved, setSaved] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <MentorPage title="Create task" description="Set up a practical task and assign it to the interns you supervise.">
      <form onSubmit={handleSubmit} className="max-w-3xl rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-xs font-bold text-[#1C1D52]">Task title</span>
            <input required name="title" placeholder="e.g. Build a responsive dashboard" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </label>
          <label>
            <span className="text-xs font-bold text-[#1C1D52]">Task type</span>
            <select name="type" defaultValue="Individual" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">
              <option>Individual</option>
              <option>Group</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-[#1C1D52]">Due date</span>
            <input required type="date" name="dueDate" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </label>
          <label>
            <span className="text-xs font-bold text-[#1C1D52]">Cohort</span>
            <select name="cohort" defaultValue="Cohort A · Software Development" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">
              <option>Cohort A · Software Development</option>
              <option>Cohort A · Product Design</option>
              <option>Cohort B · Software Development</option>
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-[#1C1D52]">Assign to</span>
            <select name="assignees" defaultValue="All supervised interns" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500">
              <option>All supervised interns</option>
              <option>Select interns after creating</option>
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="text-xs font-bold text-[#1C1D52]">Instructions</span>
            <textarea required name="instructions" rows={5} placeholder="Describe the expected outcome and submission requirements." className="mt-2 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
          </label>
        </div>
        {saved && <p className="mt-4 rounded-lg bg-[#e8f7eb] px-3 py-2 text-xs font-semibold text-[#397d3a]" role="status">Task details saved. Assignment workflow is ready to connect.</p>}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">Create task</button>
          <Link href="/mentor/tasks" className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-[#1C1D52]">Cancel</Link>
        </div>
      </form>
    </MentorPage>
  )
}