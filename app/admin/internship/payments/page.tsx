'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

const payments = [
  { id: 'PAY-410', student: 'Ada Nwosu', track: 'Software Development', amount: '$249', status: 'Paid', date: '2026-09-08' },
  { id: 'PAY-409', student: 'Chinedu Adebayo', track: 'Product Design', amount: '$199', status: 'Pending', date: '2026-09-07' },
  { id: 'PAY-408', student: 'Tobi Akin', track: 'Data Analytics', amount: '$249', status: 'Refund review', date: '2026-09-06' },
]

const statusStyles = {
  Paid: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  'Refund review': 'bg-red-100 text-red-500',
}

export default function InternshipPaymentsPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const visiblePayments = useMemo(() => payments.filter((item) => {
    const matchesStatus = status === 'All' || item.status === status
    const searchValue = `${item.id} ${item.student} ${item.track}`.toLowerCase()
    return matchesStatus && searchValue.includes(query.toLowerCase())
  }), [query, status])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Payments</h1>
            <p className="mt-2 text-xs text-slate-500">Track internship fee collections, verification, and refund follow-up.</p>
          </div>
        </header>

        <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
          <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
            <label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search payment" />
            </label>
            <FilterSelect label="Status" value={status} onChange={setStatus} options={['All', 'Paid', 'Pending', 'Refund review']} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-[10px]">
              <thead>
                <tr className="bg-[#f5f8fb] text-slate-600">
                  <th className="px-3 py-3 font-semibold">Payment</th>
                  <th className="px-3 py-3 font-semibold">Intern</th>
                  <th className="px-3 py-3 font-semibold">Track</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                  <th className="px-3 py-3 font-semibold">Date</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visiblePayments.slice((page - 1) * 8, page * 8).map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 text-[#1C1D52]">
                    <td className="px-3 py-3.5 font-bold">{payment.id}</td>
                    <td className="px-3 py-3.5 text-slate-500">{payment.student}</td>
                    <td className="px-3 py-3.5 text-slate-500">{payment.track}</td>
                    <td className="px-3 py-3.5 font-semibold">{payment.amount}</td>
                    <td className="px-3 py-3.5 text-slate-500">{payment.date}</td>
                    <td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[payment.status as keyof typeof statusStyles]}`}>{payment.status}</span></td>
                    <td className="relative px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/internship/payments/${payment.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">View</Link>
                        <button type="button" aria-label={`More actions for ${payment.id}`} onClick={() => setOpenMenuId(openMenuId === payment.id ? null : payment.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100">
                          <MoreHorizontal className="inline h-3.5 w-3.5" />
                        </button>
                      </div>
                      {openMenuId === payment.id && (
                        <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                          <Link href={`/admin/internship/payments/${payment.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View payment</Link>
                          <Link href={`/admin/internship/payments/${payment.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/receipt`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Receipt</Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex w-fit items-center">
      <span className="sr-only">Filter by {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />
    </label>
  )
}
