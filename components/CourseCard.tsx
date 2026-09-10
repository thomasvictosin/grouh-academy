import React from 'react'
import ProgressBar from './ProgressBar'

export default function CourseCard({
  title,
  author,
  percent = 0,
}: {
  title: string
  author?: string
  percent?: number
}) {
  return (
    <article className="transform-gpu hover:scale-[1.02] transition-transform rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700">
          <span className="font-semibold">{(title || '').split(' ').slice(0,2).map(s=>s[0]).join('')}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{author || 'Instructor'}</div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm font-semibold text-indigo-600">{percent}%</div>
          <div className="text-xs text-gray-400">progress</div>
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar percent={percent} />
      </div>
    </article>
  )
}
