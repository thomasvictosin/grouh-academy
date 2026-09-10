'use client'

import React from 'react'
import { Hand } from 'lucide-react'

const WelcomeMsg = ({ name = 'Student' }: { name?: string }) => {
  return (
    <div className="hidden sm:block">
        <h2 className="flex items-center gap-2 text-lg font-semibold">Welcome back, {name} <Hand className="h-4 w-4 text-[#5FBB46]" /></h2>
        <p className="text-sm text-gray-500">Continue your learning journey today.</p>
    </div>
  )
}

export default WelcomeMsg
