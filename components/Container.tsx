import React from 'react'
import { cn } from "@/lib/utils"

const Container = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("mx-auto max-w-screen-xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8", className)}>
      {children}
    </div>
  )
}

export default Container