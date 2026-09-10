"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'

export default function HeaderGuard() {
  const pathname = usePathname() || '/'

  // hide the public header for any student routes
  if (
    pathname.startsWith('/student') ||
    pathname.startsWith('/internship/dashboard') ||
    pathname.startsWith('/internship/enroll') ||
    pathname.startsWith('/internship/payment') ||
    pathname.startsWith('/internship/assessment') ||
    pathname.startsWith('/instructor') ||
    pathname.startsWith('/mentor') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/welcome') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/otp') ||
    pathname.startsWith('/reset-password-success')
  ) return null

  return <Header />
}
