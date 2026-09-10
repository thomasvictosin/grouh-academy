import React from 'react'

export default function ProgressBar({ percent = 0 }: { percent?: number }) {
  const pct = Math.max(0, Math.min(100, percent))
  return (
    <div className="w-full" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-[#5FBB46] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-gray-500">{pct}% completed</div>
    </div>
  )
}
