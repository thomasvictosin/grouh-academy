'use client'

import React, { useState } from 'react'
import { navData } from '@/constants/data/nav'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Nav = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex-1 flex items-center justify-end sm:justify-center">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-full border border-[#5FBB46] bg-[#5FBB46] p-3 text-white shadow-lg shadow-[#5FBB46]/25 transition hover:bg-[#4aaa3e] sm:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <nav className={cn('hidden sm:flex sm:flex-row sm:justify-center capitalize sm:gap-6')}>
        {navData?.map((item) => (
          <Link
            key={item?.title}
            href={item?.href}
            className={cn(
              'group relative inline-flex text-base font-medium text-gray-700 hover:text-soft-gold hoverEffect',
              pathname === item?.href && 'text-[#4db848]'
            )}
          >
            {item.title}
            <span
              className={cn(
                'absolute inset-x-0 -bottom-1 h-0.5 bg-[#4db848] scale-x-0 transition-transform duration-300 origin-center group-hover:scale-x-100',
                pathname === item?.href && 'scale-x-100'
              )}
            />
          </Link>
        ))}
      </nav>



      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-[min(80vw,320px)] bg-slate-950 px-6 py-8 shadow-2xl transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {navData?.map((item) => (
            <Link
              key={item?.title}
              href={item?.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'rounded-2xl px-4 py-3 text-base font-medium text-white transition hover:bg-white/10',
                pathname === item?.href && 'bg-white/10'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <Link
            href="/apply"
            onClick={() => setIsOpen(false)}
            className="block rounded-full bg-[#5FBB46] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#4aaa3e]"
          >
            Apply Now
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="mt-3 block rounded-full border border-white/10 bg-white px-4 py-3 text-center text-sm font-semibold text-[#0f172a] transition hover:bg-slate-100"
          >
            Login
          </Link>
        </div>
      </aside>
    </div>
  )
}

export default Nav
