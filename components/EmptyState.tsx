import React from 'react'
import { Inbox } from 'lucide-react'

export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-600">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-400"><Inbox className="h-7 w-7" /></div>
      <div className="text-lg font-medium text-gray-800">{title}</div>
      {description && <div className="text-sm text-gray-500">{description}</div>}
    </div>
  )
}
