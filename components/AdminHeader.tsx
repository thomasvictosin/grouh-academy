'use client'

import { Bell, ChevronDown, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminHeader({ workspace }: { workspace: 'student' | 'internship' }) {
  const [open, setOpen] = useState(false)
  const label = workspace === 'student' ? 'Student Admin' : 'Internship Admin'

  return <header className="fixed inset-x-0 top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#e0e7f3] bg-[#edf3ff] px-4 py-3 sm:px-6 lg:px-8"><Link href={`/admin/${workspace}`} className="shrink-0"><Image src="/logo.png" alt="Grouh Academy" width={120} height={48} className="h-10 w-auto object-contain sm:h-12" /></Link><div className="relative"><button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-[#1C1D52] shadow-sm"><span>{label}</span><ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} /></button>{open && <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-xl bg-white p-1.5 shadow-[0_10px_28px_rgba(28,29,82,0.16)]"><Link href="/admin/student" onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-2 text-xs font-semibold ${workspace === 'student' ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] hover:bg-slate-50'}`}>Student Admin</Link><Link href="/admin/internship" onClick={() => setOpen(false)} className={`mt-1 block rounded-lg px-3 py-2 text-xs font-semibold ${workspace === 'internship' ? 'bg-[#e8f7eb] text-[#397d3a]' : 'text-[#1C1D52] hover:bg-slate-50'}`}>Internship Admin</Link></div>}</div><div className="flex items-center gap-4"><label className="hidden w-[300px] md:block"><span className="sr-only">Search admin workspace</span><div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><input className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search course, student, transaction..." /></div></label><button type="button" aria-label="Notifications" className="relative rounded-full bg-white p-2 text-[#1C1D52] shadow-sm"><Bell className="h-4 w-4" /><span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" /></button><span className="hidden text-xs font-semibold text-[#1C1D52] sm:inline">Emmanuel</span></div></header>
}
